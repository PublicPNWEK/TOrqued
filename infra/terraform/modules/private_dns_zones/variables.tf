variable "resource_group_name" {
  type        = string
  description = "Resource group where Private DNS zones will be created."
}

variable "location" {
  type        = string
  description = "Azure region for resources that require a location (not all DNS resources do)."
}

variable "vnet_id" {
  type        = string
  description = "ID of the Virtual Network to link the Private DNS zones to."
}

variable "tags" {
  type        = map(string)
  description = "Tags applied to taggable resources."
  default     = {}
}

variable "enable_key_vault" {
  type        = bool
  description = "Create privatelink.vaultcore.azure.net zone and link it."
  default     = true
}

variable "enable_storage_blob" {
  type        = bool
  description = "Create privatelink.blob.core.windows.net zone and link it."
  default     = false
}

variable "enable_storage_queue" {
  type        = bool
  description = "Create privatelink.queue.core.windows.net zone and link it."
  default     = false
}

variable "enable_storage_table" {
  type        = bool
  description = "Create privatelink.table.core.windows.net zone and link it."
  default     = false
}

variable "enable_storage_file" {
  type        = bool
  description = "Create privatelink.file.core.windows.net zone and link it."
  default     = false
}
