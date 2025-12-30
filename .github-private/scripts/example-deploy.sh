#!/bin/bash
#
# Script: example-deploy.sh
# Description: Example deployment script template for organization use
# Author: DevOps Team
# Date: 2025-12-12
#
# Environment Variables Required:
#   - DEPLOY_ENV: Target environment (staging/production)
#   - DEPLOY_TOKEN: Deployment authentication token
#
# Usage:
#   ./example-deploy.sh <environment> <version>
#
# Example:
#   ./example-deploy.sh staging v1.2.3
#

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check arguments
if [ $# -ne 2 ]; then
    log_error "Usage: $0 <environment> <version>"
    log_error "Example: $0 staging v1.2.3"
    exit 1
fi

ENVIRONMENT=$1
VERSION=$2

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    log_error "Invalid environment: $ENVIRONMENT"
    log_error "Must be 'staging' or 'production'"
    exit 1
fi

# Validate version format
if [[ ! "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    log_warn "Version format should be vX.Y.Z (e.g., v1.2.3)"
fi

log_info "Starting deployment to $ENVIRONMENT"
log_info "Version: $VERSION"

# Check required environment variables
if [ -z "${DEPLOY_TOKEN:-}" ]; then
    log_error "DEPLOY_TOKEN environment variable is not set"
    exit 1
fi

# Pre-deployment checks
log_info "Running pre-deployment checks..."

# Example: Check if version exists
# git rev-parse "$VERSION" >/dev/null 2>&1 || {
#     log_error "Version $VERSION does not exist in git"
#     exit 1
# }

# Example: Run tests
log_info "Running tests..."
# npm test

# Build application
log_info "Building application..."
# npm run build

# Deploy based on environment
case $ENVIRONMENT in
    staging)
        log_info "Deploying to staging environment..."
        # Add staging deployment commands here
        # Example: scp, rsync, cloud provider CLI commands
        ;;
    production)
        log_warn "Deploying to PRODUCTION environment!"
        
        # Check if running in CI/CD (non-interactive) environment
        if [ -t 0 ]; then
            # Interactive terminal available
            read -p "Are you sure you want to deploy to production? (yes/no): " confirm
            if [ "$confirm" != "yes" ]; then
                log_error "Deployment cancelled by user"
                exit 1
            fi
        else
            # Non-interactive environment - check for CONFIRM_PRODUCTION env var
            if [ "${CONFIRM_PRODUCTION:-}" != "yes" ]; then
                log_error "Production deployment requires CONFIRM_PRODUCTION=yes in non-interactive mode"
                exit 1
            fi
        fi
        # Add production deployment commands here
        ;;
esac

# Post-deployment checks
log_info "Running post-deployment checks..."
# Example: Health check
# curl -f https://$ENVIRONMENT.example.com/health || {
#     log_error "Health check failed"
#     exit 1
# }

# Notification
log_info "Deployment completed successfully!"
# Add notification logic here (Slack, email, etc.)

log_info "Deployment summary:"
log_info "  Environment: $ENVIRONMENT"
log_info "  Version: $VERSION"
log_info "  Deployed at: $(date)"

exit 0
