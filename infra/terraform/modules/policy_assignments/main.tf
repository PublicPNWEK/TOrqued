locals {
  is_subscription     = var.scope_type == "subscription"
  is_resource_group   = var.scope_type == "resource_group"
  is_management_group = var.scope_type == "management_group"
  is_resource         = var.scope_type == "resource"

  required_tag_conditions = [
    for tag_key in var.required_tags : {
      field  = "tags['${tag_key}']"
      exists = "false"
    }
  ]
}

resource "azurerm_policy_definition" "kv_public_network" {
  count        = var.enforce_kv_public_network_disabled ? 1 : 0
  name         = "${var.name_prefix}-kv-public-network-disabled"
  policy_type  = "Custom"
  mode         = "All"
  display_name = "Key Vault public network access must be disabled"
  description  = "Denies Key Vaults that allow public network access."

  policy_rule = jsonencode({
    if = {
      allOf = [
        {
          field  = "type"
          equals = "Microsoft.KeyVault/vaults"
        },
        {
          anyOf = [
            {
              field     = "Microsoft.KeyVault/vaults/publicNetworkAccess"
              notEquals = "Disabled"
            },
            {
              field  = "Microsoft.KeyVault/vaults/networkAcls.defaultAction"
              equals = "Allow"
            }
          ]
        }
      ]
    }
    then = {
      effect = var.kv_public_network_effect
    }
  })
}

resource "azurerm_subscription_policy_assignment" "kv_public_network" {
  count                = var.enforce_kv_public_network_disabled && local.is_subscription ? 1 : 0
  name                 = "${var.name_prefix}-kv-public-network"
  display_name         = "Deny Key Vault public network access"
  policy_definition_id = azurerm_policy_definition.kv_public_network[0].id
  subscription_id      = var.scope_id
  enforce              = true
}

resource "azurerm_resource_group_policy_assignment" "kv_public_network" {
  count                = var.enforce_kv_public_network_disabled && local.is_resource_group ? 1 : 0
  name                 = "${var.name_prefix}-kv-public-network"
  display_name         = "Deny Key Vault public network access"
  policy_definition_id = azurerm_policy_definition.kv_public_network[0].id
  resource_group_id    = var.scope_id
  enforce              = true
}

resource "azurerm_management_group_policy_assignment" "kv_public_network" {
  count                = var.enforce_kv_public_network_disabled && local.is_management_group ? 1 : 0
  name                 = "${var.name_prefix}-kv-public-network"
  display_name         = "Deny Key Vault public network access"
  policy_definition_id = azurerm_policy_definition.kv_public_network[0].id
  management_group_id  = var.scope_id
  enforce              = true
}

resource "azurerm_resource_policy_assignment" "kv_public_network" {
  count                = var.enforce_kv_public_network_disabled && local.is_resource ? 1 : 0
  name                 = "${var.name_prefix}-kv-public-network"
  display_name         = "Deny Key Vault public network access"
  policy_definition_id = azurerm_policy_definition.kv_public_network[0].id
  resource_id          = var.scope_id
  enforce              = true
}

resource "azurerm_policy_definition" "required_tags" {
  count        = length(var.required_tags) > 0 ? 1 : 0
  name         = "${var.name_prefix}-required-tags"
  policy_type  = "Custom"
  mode         = "All"
  display_name = "Required tags must be present"
  description  = "Denies resources missing required tag keys."

  policy_rule = jsonencode({
    if = {
      anyOf = local.required_tag_conditions
    }
    then = {
      effect = "Deny"
    }
  })
}

resource "azurerm_subscription_policy_assignment" "required_tags" {
  count                = length(var.required_tags) > 0 && local.is_subscription ? 1 : 0
  name                 = "${var.name_prefix}-required-tags"
  display_name         = "Require tags"
  policy_definition_id = azurerm_policy_definition.required_tags[0].id
  subscription_id      = var.scope_id
  enforce              = true
}

resource "azurerm_resource_group_policy_assignment" "required_tags" {
  count                = length(var.required_tags) > 0 && local.is_resource_group ? 1 : 0
  name                 = "${var.name_prefix}-required-tags"
  display_name         = "Require tags"
  policy_definition_id = azurerm_policy_definition.required_tags[0].id
  resource_group_id    = var.scope_id
  enforce              = true
}

resource "azurerm_management_group_policy_assignment" "required_tags" {
  count                = length(var.required_tags) > 0 && local.is_management_group ? 1 : 0
  name                 = "${var.name_prefix}-required-tags"
  display_name         = "Require tags"
  policy_definition_id = azurerm_policy_definition.required_tags[0].id
  management_group_id  = var.scope_id
  enforce              = true
}

resource "azurerm_resource_policy_assignment" "required_tags" {
  count                = length(var.required_tags) > 0 && local.is_resource ? 1 : 0
  name                 = "${var.name_prefix}-required-tags"
  display_name         = "Require tags"
  policy_definition_id = azurerm_policy_definition.required_tags[0].id
  resource_id          = var.scope_id
  enforce              = true
}

resource "azurerm_subscription_policy_assignment" "diagnostics" {
  count                = length(var.diagnostics_policy_definition_id) > 0 && local.is_subscription ? 1 : 0
  name                 = "${var.name_prefix}-require-diagnostics"
  display_name         = "Require diagnostics settings"
  policy_definition_id = var.diagnostics_policy_definition_id
  subscription_id      = var.scope_id

  dynamic "identity" {
    for_each = var.identity_required_for_diagnostics ? [1] : []
    content {
      type = "SystemAssigned"
    }
  }

  enforce = true
}

resource "azurerm_resource_group_policy_assignment" "diagnostics" {
  count                = length(var.diagnostics_policy_definition_id) > 0 && local.is_resource_group ? 1 : 0
  name                 = "${var.name_prefix}-require-diagnostics"
  display_name         = "Require diagnostics settings"
  policy_definition_id = var.diagnostics_policy_definition_id
  resource_group_id    = var.scope_id

  dynamic "identity" {
    for_each = var.identity_required_for_diagnostics ? [1] : []
    content {
      type = "SystemAssigned"
    }
  }

  enforce = true
}

resource "azurerm_management_group_policy_assignment" "diagnostics" {
  count                = length(var.diagnostics_policy_definition_id) > 0 && local.is_management_group ? 1 : 0
  name                 = "${var.name_prefix}-require-diagnostics"
  display_name         = "Require diagnostics settings"
  policy_definition_id = var.diagnostics_policy_definition_id
  management_group_id  = var.scope_id

  dynamic "identity" {
    for_each = var.identity_required_for_diagnostics ? [1] : []
    content {
      type = "SystemAssigned"
    }
  }

  enforce = true
}

resource "azurerm_resource_policy_assignment" "diagnostics" {
  count                = length(var.diagnostics_policy_definition_id) > 0 && local.is_resource ? 1 : 0
  name                 = "${var.name_prefix}-require-diagnostics"
  display_name         = "Require diagnostics settings"
  policy_definition_id = var.diagnostics_policy_definition_id
  resource_id          = var.scope_id

  dynamic "identity" {
    for_each = var.identity_required_for_diagnostics ? [1] : []
    content {
      type = "SystemAssigned"
    }
  }

  enforce = true
}
