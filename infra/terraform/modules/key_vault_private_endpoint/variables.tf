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
  description = "Resource group for the Private Endpoint and DNS zone group."
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID where the Private Endpoint will be created."
}

variable "key_vault_id" {
  type        = string
  description = "Resource ID of the Key Vault to connect privately."
}

variable "private_dns_zone_id" {
  type        = string
  description = "Private DNS zone ID for privatelink.vaultcore.azure.net."
}

variable "tags" {
  type        = map(string)
  description = "Tags applied to taggable resources."
  default     = {}
}
