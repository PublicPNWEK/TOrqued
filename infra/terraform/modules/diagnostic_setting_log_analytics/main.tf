data "azurerm_monitor_diagnostic_categories" "this" {
  resource_id = var.target_resource_id
}

locals {
  log_categories    = length(var.enabled_log_categories) > 0 ? var.enabled_log_categories : try(data.azurerm_monitor_diagnostic_categories.this.log_category_types, [])
  metric_categories = length(var.enabled_metric_categories) > 0 ? var.enabled_metric_categories : try(data.azurerm_monitor_diagnostic_categories.this.metrics, [])
}

resource "azurerm_monitor_diagnostic_setting" "this" {
  name                       = var.name
  target_resource_id         = var.target_resource_id
  log_analytics_workspace_id = var.log_analytics_workspace_id

  log_analytics_destination_type = var.log_analytics_destination_type

  dynamic "enabled_log" {
    for_each = toset(local.log_categories)
    content {
      category = enabled_log.value
    }
  }

  dynamic "metric" {
    for_each = toset(local.metric_categories)
    content {
      category = metric.value
      enabled  = true
    }
  }
}
