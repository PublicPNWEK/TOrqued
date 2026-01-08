output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics workspace created or used by the baseline."
  value       = module.cathedral_baseline.log_analytics_workspace_id
}

output "key_vault_private_endpoint_id" {
  description = "ID of the Key Vault Private Endpoint."
  value       = module.cathedral_baseline.key_vault_private_endpoint_id
}

output "storage_private_endpoint_ids" {
  description = "Map of storage account private endpoint IDs by subresource (blob/file/queue/table)."
  value       = module.cathedral_baseline.storage_private_endpoint_ids
}
