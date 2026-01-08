locals {
  endpoints = {
    blob = {
      enabled          = var.enable_blob
      subresource_name = "blob"
      dns_zone_id      = try(var.private_dns_zone_ids.blob, null)
    }
    file = {
      enabled          = var.enable_file
      subresource_name = "file"
      dns_zone_id      = try(var.private_dns_zone_ids.file, null)
    }
    queue = {
      enabled          = var.enable_queue
      subresource_name = "queue"
      dns_zone_id      = try(var.private_dns_zone_ids.queue, null)
    }
    table = {
      enabled          = var.enable_table
      subresource_name = "table"
      dns_zone_id      = try(var.private_dns_zone_ids.table, null)
    }
  }

  enabled_endpoints = { for k, v in local.endpoints : k => v if v.enabled }
}

resource "azurerm_private_endpoint" "this" {
  for_each            = local.enabled_endpoints
  name                = "${var.name}-st-${each.key}-pe"
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.subnet_id

  private_service_connection {
    name                           = "${var.name}-st-${each.key}-psc"
    private_connection_resource_id = var.storage_account_id
    is_manual_connection           = false
    subresource_names              = [each.value.subresource_name]
  }

  dynamic "private_dns_zone_group" {
    for_each = each.value.dns_zone_id != null ? [each.value.dns_zone_id] : []
    content {
      name                 = "${var.name}-st-${each.key}-dns"
      private_dns_zone_ids = [private_dns_zone_group.value]
    }
  }

  tags = var.tags
}
