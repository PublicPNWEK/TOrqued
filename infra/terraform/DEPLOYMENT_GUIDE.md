# Cathedral Baseline Deployment Guide

> **Enterprise-grade hardening for Azure Key Vault, Storage, diagnostics, and policy enforcement.**

## Prerequisites

- **Terraform** >= 1.5.0 ([install](https://www.terraform.io/downloads))
- **Azure CLI** >= 2.50.0 ([install](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli))
- **Azure subscription** with permissions to:
  - Create/manage Key Vaults, Storage Accounts
  - Create Virtual Networks, Subnets (or use existing)
  - Create Private Endpoints, Private DNS zones
  - Create Log Analytics Workspaces
  - Assign Azure Policies
  - Create Resource Groups

- **Existing Azure resources:**
  - Virtual Network (VNet)
  - Subnet for Private Endpoints
  - Key Vault (to harden)
  - (Optional) Storage Account

## Deployment Steps

### 1. Prepare Your Environment

```bash
# Authenticate with Azure
az login

# Set your default subscription
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Navigate to the example
cd infra/terraform/examples/cathedral
```

### 2. Configure Terraform Variables

```bash
# Copy the example tfvars
cp terraform.tfvars.example terraform.tfvars

# Edit with your Azure resource IDs
nano terraform.tfvars
# or: vim terraform.tfvars
```

**Example values to fill in:**

| Variable | Description | Example |
|----------|-------------|---------|
| `environment_prefix` | Naming prefix (prod, staging, etc.) | `prod` |
| `location` | Azure region | `eastus`, `westus2` |
| `resource_group_name` | RG for Log Analytics & Private Endpoints | `my-rg` |
| `vnet_id` | Existing VNet ID | `/subscriptions/.../virtualNetworks/my-vnet` |
| `private_endpoint_subnet_id` | Subnet for Private Endpoints | `/subscriptions/.../subnets/pe-subnet` |
| `key_vault_id` | Key Vault to harden (disable public access) | `/subscriptions/.../vaults/my-kv` |
| `storage_account_id` | (Optional) Storage Account for PE | `/subscriptions/.../storageAccounts/mystg` |
| `policy_scope` | Resource Group or Subscription ID for policies | `/subscriptions/.../resourceGroups/my-rg` |

**To find your resource IDs:**

```bash
# List your subscriptions
az account list --output table

# Get a VNet ID
az network vnet list --resource-group MY_RG --query "[].id" -o tsv

# Get a Key Vault ID
az keyvault list --resource-group MY_RG --query "[].id" -o tsv

# Get a Storage Account ID
az storage account list --resource-group MY_RG --query "[].id" -o tsv
```

### 3. Initialize Terraform

```bash
terraform init
```

Output should show:
```
Terraform has been successfully initialized!
```

### 4. Review the Plan (Dry-Run)

```bash
terraform plan -out=tfplan
```

This shows all resources that will be created:
- Private DNS zones (Key Vault, Storage)
- Private Endpoints (Key Vault, Storage)
- Log Analytics workspace
- Diagnostic settings (KV → Log Analytics)
- Azure Policy definitions & assignments

### 5. Apply the Configuration

```bash
# Review the plan, then apply
terraform apply tfplan
```

**This will:**
1. ✅ Create/link Private DNS zones to your VNet
2. ✅ Deploy Private Endpoints for Key Vault and Storage
3. ✅ Create Log Analytics workspace (if `create_log_analytics_workspace=true`)
4. ✅ Configure diagnostic settings (logs → Log Analytics)
5. ✅ Deploy Azure Policy assignments to:
   - Deny Key Vault public network access
   - Require specific tags
   - (Optionally) require diagnostics settings

### 6. Verify Deployment

```bash
# Check outputs
terraform output

# Verify Private Endpoint DNS (from a VM in your VNet)
nslookup my-kv.vault.azure.net

# Check Log Analytics workspace
az monitor log-analytics workspace list --resource-group MY_RG
```

## Outputs

After successful `terraform apply`:

```
Outputs:

key_vault_private_endpoint_id = "/subscriptions/...privateEndpoints/prod-kv-pe"
log_analytics_workspace_id = "/subscriptions/...providers/Microsoft.OperationalInsights/workspaces/prod-law"
storage_private_endpoint_ids = {
  "blob" = "/subscriptions/...privateEndpoints/prod-st-blob-pe"
  "file" = "/subscriptions/...privateEndpoints/prod-st-file-pe"
  ...
}
```

## Key Vault Configuration After Deployment

Your Key Vault will have:

```
Public network access: Disabled
Network ACLs: 
  - Default action: Deny
  - Allow from Private Endpoints
Private Endpoint: prod-kv-pe (on your subnet)
Diagnostics: → Log Analytics workspace (prod-law)
```

## Access Key Vault After Hardening

Clients **must now use** the Private Endpoint:

1. **From a VM in your VNet:**
   ```bash
   # Should resolve to the private IP of the PE
   nslookup my-kv.vault.azure.net
   ```

2. **From Azure DevOps/GitHub Actions:**
   - Use [GitHub OIDC with `azure/login`](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
   - The runner must connect to your VNet (self-hosted runner or ExpressRoute/VPN)

3. **From Application Services:**
   - Deploy in the same VNet or configure VNet integration
   - Use Managed Identity (no secrets needed)

## Scaling: Multiple Environments

For production, staging, and dev:

```bash
# Create separate tfvars files
cp terraform.tfvars.example prod.tfvars
cp terraform.tfvars.example staging.tfvars

# Deploy each environment
terraform apply -var-file=prod.tfvars
terraform apply -var-file=staging.tfvars
```

## Remote State (Production)

Uncomment and configure the backend in `main.tf`:

```hcl
backend "azurerm" {
  resource_group_name  = "tfstate-rg"
  storage_account_name = "tfstate1234..."
  container_name       = "tfstate"
  key                  = "cathedral/terraform.tfstate"
}
```

Then:
```bash
terraform init -migrate-state
```

## GitHub Actions Integration

To automate deployments, add a workflow (`.github/workflows/deploy-cathedral.yml`):

```yaml
name: Deploy Cathedral Baseline

on:
  push:
    branches: [ main ]
    paths: [ 'infra/terraform/**' ]

permissions:
  id-token: write
  contents: read

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Azure Login (OIDC)
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Terraform Plan
        working-directory: infra/terraform/examples/cathedral
        run: |
          terraform init
          terraform plan -out=tfplan

      - name: Terraform Apply
        working-directory: infra/terraform/examples/cathedral
        run: terraform apply tfplan
```

## Troubleshooting

### "Private Endpoint creation failed"

**Cause:** Subnet doesn't have Network Interface permissions.

**Fix:** Ensure your subnet allows delegation:
```bash
az network vnet subnet update \
  --resource-group MY_RG \
  --vnet-name MY_VNET \
  --name MY_SUBNET \
  --disable-private-endpoint-network-policies false
```

### "Policy assignment failed"

**Cause:** Insufficient RBAC permissions.

**Fix:** Ensure your user has `Policy Contributor` role at the target scope.

### "Terraform cannot access modules"

**Cause:** Running `terraform init` from the wrong directory.

**Fix:** Always run from `infra/terraform/examples/cathedral/`.

## Cleanup

To remove all deployed resources:

```bash
terraform destroy
```

⚠️ **Warning:** This **disables public access** on your Key Vault. Verify all clients can reach it via the Private Endpoint before destroying.

## Support

For issues or questions:
- [Azure Terraform Provider Docs](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Terraform on Azure](https://learn.microsoft.com/en-us/azure/developer/terraform/)
- Repository: [TOrqued](https://github.com/PublicPNWEK/TOrqued)
