variable "scope_type" {
  type        = string
  description = "Scope type for the policy assignments. One of: subscription | resource_group | management_group | resource."
  default     = "resource_group"
}

variable "scope_id" {
  type        = string
  description = "ID for the chosen scope_type (subscription_id, resource_group_id, management_group_id, or resource_id)."
}

variable "name_prefix" {
  type        = string
  description = "Prefix used for policy definition and assignment names."
}

variable "enforce_kv_public_network_disabled" {
  type        = bool
  description = "Create/assign a custom policy that denies Key Vault public network access."
  default     = true
}

variable "kv_public_network_effect" {
  type        = string
  description = "Effect for the Key Vault public network access policy. Typically 'Deny' or 'Audit'."
  default     = "Deny"
}

variable "required_tags" {
  type        = list(string)
  description = "List of required tag keys. Empty disables the required-tags policy."
  default     = []
}

variable "diagnostics_policy_definition_id" {
  type        = string
  description = "Optional policy definition ID for requiring diagnostics (built-in or custom). If empty, no diagnostics policy assignment is created."
  default     = ""
}

variable "identity_required_for_diagnostics" {
  type        = bool
  description = "If true, assigns a system-assigned identity to the diagnostics policy assignment (needed for DeployIfNotExists)."
  default     = true
}

variable "tags" {
  type        = map(string)
  description = "Tags for taggable resources."
  default     = {}
}
