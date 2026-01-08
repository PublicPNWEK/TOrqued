output "key_vault_zone_id" {
  description = "Resource ID of privatelink.vaultcore.azure.net zone, if enabled."
  value       = try(azurerm_private_dns_zone.this["key_vault"].id, null)
}

output "storage_blob_zone_id" {
  description = "Resource ID of privatelink.blob.core.windows.net zone, if enabled."
  value       = try(azurerm_private_dns_zone.this["storage_blob"].id, null)
}

output "storage_queue_zone_id" {
  description = "Resource ID of privatelink.queue.core.windows.net zone, if enabled."
  value       = try(azurerm_private_dns_zone.this["storage_queue"].id, null)
}

output "storage_table_zone_id" {
  description = "Resource ID of privatelink.table.core.windows.net zone, if enabled."
  value       = try(azurerm_private_dns_zone.this["storage_table"].id, null)
}

output "storage_file_zone_id" {
  description = "Resource ID of privatelink.file.core.windows.net zone, if enabled."
  value       = try(azurerm_private_dns_zone.this["storage_file"].id, null)
}
