locals {
  zones = {
    key_vault = {
      enabled = var.enable_key_vault
      name    = "privatelink.vaultcore.azure.net"
    }
    storage_blob = {
      enabled = var.enable_storage_blob
      name    = "privatelink.blob.core.windows.net"
    }
    storage_queue = {
      enabled = var.enable_storage_queue
      name    = "privatelink.queue.core.windows.net"
    }
    storage_table = {
      enabled = var.enable_storage_table
      name    = "privatelink.table.core.windows.net"
    }
    storage_file = {
      enabled = var.enable_storage_file
      name    = "privatelink.file.core.windows.net"
    }
  }

  enabled_zones = { for k, v in local.zones : k => v if v.enabled }
}

resource "azurerm_private_dns_zone" "this" {
  for_each            = local.enabled_zones
  name                = each.value.name
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "this" {
  for_each              = local.enabled_zones
  name                  = "${each.key}-link"
  resource_group_name   = var.resource_group_name
  private_dns_zone_name = azurerm_private_dns_zone.this[each.key].name
  virtual_network_id    = var.vnet_id

  tags = var.tags
}
