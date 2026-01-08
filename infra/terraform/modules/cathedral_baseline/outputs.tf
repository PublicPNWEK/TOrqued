output "log_analytics_workspace_id" {
  description = "Log Analytics workspace ID used by the baseline."
  value       = local.la_workspace_id
}

output "key_vault_private_endpoint_id" {
  description = "Private Endpoint ID for Key Vault."
  value       = module.kv_private_endpoint.private_endpoint_id
}

output "storage_private_endpoint_ids" {
  description = "Storage private endpoint IDs by subresource (if enabled)."
  value       = try(module.storage_private_endpoints[0].private_endpoint_ids, {})
}
