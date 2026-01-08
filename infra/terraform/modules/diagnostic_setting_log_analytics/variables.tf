variable "name" {
  type        = string
  description = "Name of the diagnostic setting."
}

variable "target_resource_id" {
  type        = string
  description = "Resource ID to attach diagnostics to."
}

variable "log_analytics_workspace_id" {
  type        = string
  description = "Log Analytics Workspace ID to send logs/metrics to."
}

variable "log_analytics_destination_type" {
  type        = string
  description = "Destination type for Log Analytics. Common values: null or 'Dedicated'."
  default     = null
}

variable "enabled_log_categories" {
  type        = list(string)
  description = "Optional list of log categories to enable. If empty, enables all available log categories."
  default     = []
}

variable "enabled_metric_categories" {
  type        = list(string)
  description = "Optional list of metric categories to enable. If empty, enables all available metric categories."
  default     = []
}

variable "tags" {
  type        = map(string)
  description = "Tags for taggable resources (diagnostic setting itself is not taggable; kept for interface consistency)."
  default     = {}
}
