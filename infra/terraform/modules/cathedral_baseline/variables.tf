variable "name" {
  type        = string
  description = "Base name/prefix for resources created by the baseline."
}

variable "location" {
  type        = string
  description = "Azure region."
}

variable "resource_group_name" {
  type        = string
  description = "Resource group used for baseline resources (DNS zones, Private Endpoints, workspace if created)."
}

variable "vnet_id" {
  type        = string
  description = "Virtual network ID for Private DNS links."
}

variable "private_endpoint_subnet_id" {
  type        = string
  description = "Subnet ID to place Private Endpoints into."
}

variable "key_vault_id" {
  type        = string
  description = "Key Vault resource ID (the KV must be managed by Terraform or imported if you want to disable public access on it separately)."
}

variable "storage_account_id" {
  type        = string
  description = "Optional storage account resource ID for private endpoints."
  default     = ""
}

variable "enable_storage_private_endpoints" {
  type        = bool
  description = "Whether to create storage private endpoints."
  default     = false
}

variable "create_log_analytics_workspace" {
  type        = bool
  description = "Whether to create a Log Analytics workspace as part of this baseline."
  default     = true
}

variable "log_analytics_workspace_id" {
  type        = string
  description = "Existing Log Analytics workspace ID. Used when create_log_analytics_workspace=false."
  default     = ""
}

variable "log_analytics_workspace_name" {
  type        = string
  description = "Workspace name when create_log_analytics_workspace=true."
  default     = ""
}

variable "diagnostic_settings_name_prefix" {
  type        = string
  description = "Prefix for diagnostic setting names."
  default     = "diag"
}

variable "policy_scope" {
  type        = string
  description = "Scope for policy assignments. Typically a resource group or subscription ID."
}

variable "policy_scope_type" {
  type        = string
  description = "Scope type for policy assignments. One of: subscription | resource_group | management_group | resource."
  default     = "resource_group"
}

variable "enable_policy_assignments" {
  type        = bool
  description = "Whether to create policy assignments."
  default     = true
}

variable "required_tags" {
  type        = list(string)
  description = "Tag keys required by policy (if policy assignments enabled)."
  default     = []
}

variable "diagnostics_policy_definition_id" {
  type        = string
  description = "Optional policy definition ID for requiring diagnostics."
  default     = ""
}

variable "tags" {
  type        = map(string)
  description = "Tags applied to taggable resources."
  default     = {}
}
