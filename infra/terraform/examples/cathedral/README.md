# Cathedral Baseline Example

This example demonstrates how to use the `cathedral_baseline` module to add enterprise-grade hardening add-ons to your Azure infrastructure.

## Features Deployed

- **Key Vault Private Endpoint** – disable public network access and connect via private link
- **Diagnostic Logging** – send logs and metrics from Key Vault to Log Analytics
- **Storage Private Endpoints** (optional) – protect Functions/App Services storage dependencies
- **Azure Policy Assignments** – enforce Key Vault public access denial and required tags
- **Centralized Logging** – optional Log Analytics workspace for audit/diagnostics

## Usage

1. **Copy and fill in `terraform.tfvars`:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your subscription/resource IDs
   ```

2. **Initialize Terraform:**
   ```bash
   terraform init
   ```

3. **Plan (dry-run):**
   ```bash
   terraform plan -out=tfplan
   ```

4. **Apply:**
   ```bash
   terraform apply tfplan
   ```

## Input Variables

- `environment_prefix` – Name prefix for resources (e.g., 'prod', 'staging')
- `location` – Azure region
- `resource_group_name` – RG where Log Analytics and Private Endpoints are created
- `vnet_id` – Virtual Network ID
- `private_endpoint_subnet_id` – Subnet for Private Endpoints
- `key_vault_id` – Key Vault to harden
- `enable_storage_private_endpoints` – Optional (default: false)
- `storage_account_id` – Storage Account for private endpoints (if enabled)
- `policy_scope_type` – Scope for policies: `subscription`, `resource_group`, `management_group`, or `resource`
- `policy_scope` – Scope ID
- `required_tags` – Tag keys to enforce

## Outputs

- `log_analytics_workspace_id` – ID of the Log Analytics workspace
- `key_vault_private_endpoint_id` – ID of the Key Vault Private Endpoint
- `storage_private_endpoint_ids` – Map of storage private endpoint IDs by subresource

## Notes

- The example assumes your VNet, Key Vault, and Storage Account already exist.
- For multi-environment deployments, create separate `.tfvars` files (e.g., `prod.tfvars`, `staging.tfvars`).
- Use remote state (e.g., Azure Blob Storage) for production—uncomment the backend config in `main.tf`.
