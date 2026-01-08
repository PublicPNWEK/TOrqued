# Terraform (Azure) - Cathedral Baseline

This folder contains modular Terraform building blocks for “cathedral” hardening add-ons:

- Key Vault private endpoints + restricted network access
- Diagnostic logs to Log Analytics
- Storage private endpoints (common Functions dependencies)
- Azure Policy assignments (deny public KV, require diagnostics, require tags)
- Optional centralized logging workspace pattern

## Modules

- `modules/private_dns_zones` – Private DNS zones + VNet links
- `modules/key_vault_private_endpoint` – Private Endpoint + DNS for Key Vault
- `modules/diagnostic_setting_log_analytics` – Diagnostic settings to Log Analytics
- `modules/storage_private_endpoints` – Private endpoints + DNS for Storage
- `modules/policy_assignments` – Opinionated policy assignments
- `modules/log_analytics_workspace` – Log Analytics workspace
- `modules/cathedral_baseline` – Composes the above

## Notes

- These modules assume the VNet/subnet already exist.
- Prefer GitHub Actions OIDC (`azure/login`) rather than client secrets.
