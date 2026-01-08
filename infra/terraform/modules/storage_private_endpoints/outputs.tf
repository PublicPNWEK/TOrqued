output "private_endpoint_ids" {
  description = "Map of private endpoint IDs by subresource (blob/file/queue/table)."
  value       = { for k, v in azurerm_private_endpoint.this : k => v.id }
}
