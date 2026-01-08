terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.90.0"
    }
  }

  # Uncomment and configure for production remote state:
  # backend "azurerm" {
  #   resource_group_name  = "tfstate-rg"
  #   storage_account_name = "tfstate..."
  #   container_name       = "tfstate"
  #   key                  = "cathedral/terraform.tfstate"
  # }
}

provider "azurerm" {
  features {}
}

# If your Azure resources (VNet, Key Vault, Storage) are managed elsewhere,
# use data sources to reference them:
# data "azurerm_virtual_network" "existing" {
#   name                = var.vnet_name
#   resource_group_name = var.rg_name
# }
#
# data "azurerm_key_vault" "existing" {
#   name                = var.key_vault_name
#   resource_group_name = var.rg_name
# }
#
# data "azurerm_storage_account" "existing" {
#   name                = var.storage_account_name
#   resource_group_name = var.rg_name
# }

module "cathedral_baseline" {
  source = "../../modules/cathedral_baseline"

  # Basic naming and location
  name     = var.environment_prefix
  location = var.location

  # Resource group where Private Endpoints, DNS zones, and Log Analytics will live
  resource_group_name = var.resource_group_name

  # Existing network resources
  vnet_id                    = var.vnet_id
  private_endpoint_subnet_id = var.private_endpoint_subnet_id

  # Key Vault hardening (disable public access + private endpoint)
  key_vault_id = var.key_vault_id

  # Optional: Storage Account private endpoints
  enable_storage_private_endpoints = var.enable_storage_private_endpoints
  storage_account_id               = var.storage_account_id

  # Log Analytics workspace (can create new or use existing)
  create_log_analytics_workspace = var.create_log_analytics_workspace
  log_analytics_workspace_id     = var.log_analytics_workspace_id
  log_analytics_workspace_name   = "${var.environment_prefix}-law"

  # Azure Policy assignments
  enable_policy_assignments        = var.enable_policy_assignments
  policy_scope                     = var.policy_scope
  policy_scope_type                = var.policy_scope_type
  required_tags                    = var.required_tags
  diagnostics_policy_definition_id = var.diagnostics_policy_definition_id

  # Common tags
  tags = merge(var.tags, {
    Environment = var.environment_prefix
    ManagedBy   = "Terraform"
    Module      = "cathedral_baseline"
  })
}
