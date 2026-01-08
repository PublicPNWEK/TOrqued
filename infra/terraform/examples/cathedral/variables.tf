variable "environment_prefix" {
  type        = string
  description = "Prefix for resource names and module outputs (e.g., 'prod', 'staging')."
}

variable "location" {
  type        = string
  description = "Azure region for resources."
}

variable "resource_group_name" {
  type        = string
  description = "Resource group where Private Endpoints and Log Analytics workspace will be created."
}

variable "vnet_id" {
  type        = string
  description = "ID of the existing Virtual Network for Private DNS zone links."
}

variable "private_endpoint_subnet_id" {
  type        = string
  description = "Subnet ID where Private Endpoints will be deployed."
}

variable "key_vault_id" {
  type        = string
  description = "Resource ID of the Key Vault to harden (disable public access + add private endpoint)."
}

variable "enable_storage_private_endpoints" {
  type        = bool
  description = "Whether to create storage account private endpoints."
  default     = false
}

variable "storage_account_id" {
  type        = string
  description = "Resource ID of the Storage Account (for private endpoints). Leave empty if disabled."
  default     = ""
}

variable "create_log_analytics_workspace" {
  type        = bool
  description = "Create a new Log Analytics workspace, or use an existing one?"
  default     = true
}

variable "log_analytics_workspace_id" {
  type        = string
  description = "Existing Log Analytics workspace ID (if create_log_analytics_workspace=false)."
  default     = ""
}

variable "enable_policy_assignments" {
  type        = bool
  description = "Whether to deploy Azure Policy assignments for Key Vault hardening and diagnostics."
  default     = true
}

variable "policy_scope_type" {
  type        = string
  description = "Scope type for policy assignments: subscription, resource_group, management_group, or resource."
  default     = "resource_group"
}

variable "policy_scope" {
  type        = string
  description = "Scope ID for policy assignments (subscription ID, resource group ID, etc.)."
}

variable "required_tags" {
  type        = list(string)
  description = "List of required tag keys to enforce via Azure Policy."
  default     = ["Owner", "CostCenter", "Environment"]
}

variable "diagnostics_policy_definition_id" {
  type        = string
  description = "Optional built-in or custom policy definition ID for requiring diagnostics."
  default     = ""
}

variable "tags" {
  type        = map(string)
  description = "Base tags applied to all resources."
  default = {
    Project = "TOrqued"
  }
}
