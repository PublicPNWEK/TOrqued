#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TF_IMAGE="hashicorp/terraform:1.7.5"

cd "$ROOT_DIR"

echo "==> Terraform fmt (check)"
docker run --rm -v "$PWD:/src" -w /src "$TF_IMAGE" fmt -check -recursive infra/terraform

echo "==> Terraform validate (modules)"
MODULES_DIR="infra/terraform/modules"

for module_dir in "$MODULES_DIR"/*; do
  if [[ ! -d "$module_dir" ]]; then
    continue
  fi

  echo "--> Validating $module_dir"
  docker run --rm \
    -v "$PWD:/src" \
    -w "/src/$module_dir" \
    "$TF_IMAGE" init -backend=false -input=false -no-color >/dev/null

  docker run --rm \
    -v "$PWD:/src" \
    -w "/src/$module_dir" \
    "$TF_IMAGE" validate -no-color

done

echo "==> OK"
