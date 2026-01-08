resource "azurerm_private_endpoint" "kv" {
  name                = "${var.name}-kv-pe"
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.subnet_id

  private_service_connection {
    name                           = "${var.name}-kv-psc"
    private_connection_resource_id = var.key_vault_id
    is_manual_connection           = false
    subresource_names              = ["vault"]
  }

  private_dns_zone_group {
    name                 = "${var.name}-kv-dns"
    private_dns_zone_ids = [var.private_dns_zone_id]
  }

  tags = var.tags
}
