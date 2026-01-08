variable "name" {
  type        = string
  description = "Base name used for Private Endpoint resources."
}

variable "location" {
  type        = string
  description = "Azure region."
}

variable "resource_group_name" {
  type        = string
  description = "Resource group for the Private Endpoints and DNS zone groups."
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID where Private Endpoints will be created."
}

variable "storage_account_id" {
  type        = string
  description = "Resource ID of the Storage Account."
}

variable "enable_blob" {
  type        = bool
  description = "Create private endpoint for 'blob'."
  default     = true
}

variable "enable_file" {
  type        = bool
  description = "Create private endpoint for 'file'."
  default     = false
}

variable "enable_queue" {
  type        = bool
  description = "Create private endpoint for 'queue'."
  default     = false
}

variable "enable_table" {
  type        = bool
  description = "Create private endpoint for 'table'."
  default     = false
}

variable "private_dns_zone_ids" {
  type = object({
    blob  = optional(string)
    file  = optional(string)
    queue = optional(string)
    table = optional(string)
  })
  description = "Optional Private DNS zone IDs for each storage subresource."
  default     = {}
}

variable "tags" {
  type        = map(string)
  description = "Tags applied to taggable resources."
  default     = {}
}
