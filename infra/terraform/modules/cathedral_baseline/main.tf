locals {
  la_workspace_id = var.create_log_analytics_workspace ? module.log_analytics[0].id : var.log_analytics_workspace_id
}

module "private_dns" {
  source              = "../private_dns_zones"
  resource_group_name = var.resource_group_name
  location            = var.location
  vnet_id             = var.vnet_id
  tags                = var.tags

  enable_key_vault     = true
  enable_storage_blob  = var.enable_storage_private_endpoints
  enable_storage_file  = var.enable_storage_private_endpoints
  enable_storage_queue = var.enable_storage_private_endpoints
  enable_storage_table = var.enable_storage_private_endpoints
}

module "log_analytics" {
  count               = var.create_log_analytics_workspace ? 1 : 0
  source              = "../log_analytics_workspace"
  name                = length(var.log_analytics_workspace_name) > 0 ? var.log_analytics_workspace_name : "${var.name}-law"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

module "kv_private_endpoint" {
  source              = "../key_vault_private_endpoint"
  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.private_endpoint_subnet_id
  key_vault_id        = var.key_vault_id
  private_dns_zone_id = module.private_dns.key_vault_zone_id
  tags                = var.tags
}

module "kv_diagnostics" {
  source                     = "../diagnostic_setting_log_analytics"
  name                       = "${var.diagnostic_settings_name_prefix}-kv"
  target_resource_id         = var.key_vault_id
  log_analytics_workspace_id = local.la_workspace_id
}

module "storage_private_endpoints" {
  count               = var.enable_storage_private_endpoints && length(var.storage_account_id) > 0 ? 1 : 0
  source              = "../storage_private_endpoints"
  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.private_endpoint_subnet_id
  storage_account_id  = var.storage_account_id
  tags                = var.tags

  enable_blob  = true
  enable_file  = true
  enable_queue = true
  enable_table = true

  private_dns_zone_ids = {
    blob  = module.private_dns.storage_blob_zone_id
    file  = module.private_dns.storage_file_zone_id
    queue = module.private_dns.storage_queue_zone_id
    table = module.private_dns.storage_table_zone_id
  }
}

module "storage_diagnostics" {
  count                      = var.enable_storage_private_endpoints && length(var.storage_account_id) > 0 ? 1 : 0
  source                     = "../diagnostic_setting_log_analytics"
  name                       = "${var.diagnostic_settings_name_prefix}-st"
  target_resource_id         = var.storage_account_id
  log_analytics_workspace_id = local.la_workspace_id
}

module "policies" {
  count                              = var.enable_policy_assignments ? 1 : 0
  source                             = "../policy_assignments"
  scope_type                         = var.policy_scope_type
  scope_id                           = var.policy_scope
  name_prefix                        = var.name
  enforce_kv_public_network_disabled = true
  required_tags                      = var.required_tags
  diagnostics_policy_definition_id   = var.diagnostics_policy_definition_id
  tags                               = var.tags
}
