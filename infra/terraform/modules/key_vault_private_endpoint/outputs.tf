output "private_endpoint_id" {
  description = "Private Endpoint resource ID."
  value       = azurerm_private_endpoint.kv.id
}

output "private_endpoint_private_ip" {
  description = "Private IP address assigned to the private endpoint NIC (best-effort)."
  value       = try(azurerm_private_endpoint.kv.private_service_connection[0].private_ip_address, null)
}
