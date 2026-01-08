output "kv_public_network_policy_definition_id" {
  description = "Custom policy definition id for Key Vault public network access."
  value       = try(azurerm_policy_definition.kv_public_network[0].id, null)
}

output "required_tags_policy_definition_id" {
  description = "Custom policy definition id for required tags."
  value       = try(azurerm_policy_definition.required_tags[0].id, null)
}
