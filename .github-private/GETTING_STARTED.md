# Getting Started with .github-private

Welcome to the organization's private GitHub directory! This guide will help you understand and use the `.github-private` structure effectively.

## Quick Overview

The `.github-private` directory is designed to store:
- 🔒 Private organizational workflows and automations
- 📋 Internal templates for issues and pull requests
- 📜 Security and compliance policies
- ⚙️ Organization-wide configurations
- 🛠️ Private scripts and tools

## First Steps

### 1. Review the Main README
Start by reading the [main README](README.md) to understand the complete structure and purpose.

### 2. Understand What Goes Here vs. Public .github
- **`.github`** (public): Templates and workflows visible to external contributors
- **`.github-private`** (this directory): Internal organizational configurations

### 3. Review the .gitignore
The `.github-private/.gitignore` file is configured to prevent accidentally committing sensitive data. Review it to understand what's protected.

## Using the Directory Structure

### Workflows (`.github-private/workflows/`)
Store private GitHub Actions workflows here:

```yaml
# Example: Internal deployment workflow
name: Deploy to Internal Systems
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options:
          - staging
          - production
```

**Best Practice**: Keep sensitive deployment logic and internal API integrations private.

### Templates (`.github-private/templates/`)
Create internal issue and PR templates:

- **Internal Bug Reports**: For bugs in internal systems
- **Security Reports**: For vulnerability reporting
- **Infrastructure Changes**: For infrastructure modification requests

**Usage**: Reference these templates in internal documentation or automation.

### Policies (`.github-private/policies/`)
Document organizational policies:

- Security policies and procedures
- Code review requirements
- Compliance guidelines
- Data handling procedures

**Example**: The included `SECURITY_POLICY.md` provides a comprehensive template.

### Config (`.github-private/config/`)
Store shared configuration files:

- Environment variable templates
- Shared ESLint/Prettier configs
- Docker compose templates
- CI/CD configuration templates

**Example**: Use `env-template.example` as a base for project-specific `.env` files.

### Scripts (`.github-private/scripts/`)
Place private automation scripts:

```bash
# Example usage of the deployment script
./github-private/scripts/example-deploy.sh staging v1.2.3
```

**Remember**: Make scripts executable with `chmod +x script-name.sh`

## Security Best Practices

### ✅ DO:
- Use environment variables for secrets
- Document the purpose of each file
- Review changes before committing
- Keep sensitive data in proper secret management systems
- Regularly audit access to this directory

### ❌ DON'T:
- Commit API keys, passwords, or tokens
- Store actual production credentials
- Share sensitive information via this directory
- Make this directory publicly accessible

## Customizing for Your Organization

### Adding New Content
1. Choose the appropriate subdirectory
2. Follow existing naming conventions
3. Add a README if creating new subdirectories
4. Update the main `.github-private/README.md` if needed

### Removing Example Files
The directory includes several example files:
- `workflows/example-internal-deploy.yml`
- `scripts/example-deploy.sh`
- `templates/internal-bug-report.md`
- `templates/security-report.md`

Feel free to remove or modify these based on your needs.

## Common Use Cases

### 1. Internal Deployment Automation
```yaml
# .github-private/workflows/deploy-internal.yml
name: Deploy to Internal Systems
on: workflow_dispatch
# ... workflow configuration
```

### 2. Security Vulnerability Tracking
Use the `templates/security-report.md` template to standardize how security issues are reported and tracked internally.

### 3. Organization-Wide Settings
Store shared configurations that all projects should inherit:
```bash
# .github-private/config/shared-eslint.config.js
# .github-private/config/prettier-org.config.js
```

### 4. Private Automation Scripts
Create scripts for:
- Automated deployments
- Data migrations
- Backup procedures
- System maintenance

## Integrating with Projects

### In GitHub Actions
Reference private workflows or scripts:
```yaml
- name: Run private deployment script
  run: bash .github-private/scripts/example-deploy.sh staging v1.0.0
```

### In Documentation
Link to private policies in internal documentation:
```markdown
See our [Security Policy](.github-private/policies/SECURITY_POLICY.md)
```

### As Configuration Base
Copy configurations to projects:
```bash
cp .github-private/config/env-template.example .env.example
```

## Maintaining the Directory

### Regular Reviews
- **Quarterly**: Review all files for relevance and accuracy
- **Annually**: Update policies and documentation
- **As Needed**: When organizational processes change

### Access Control
- Limit access to team members who need it
- Review access permissions regularly
- Remove access when roles change

### Documentation
- Keep README files up to date
- Document all custom scripts and workflows
- Explain the purpose of new files

## Getting Help

### Questions?
- Check the main [README](README.md)
- Review subdirectory README files
- Contact your DevOps or security team

### Contributing
When adding or modifying content:
1. Follow existing patterns and conventions
2. Add appropriate documentation
3. Review security implications
4. Test before committing

## Additional Resources

- [GitHub Organization Documentation](https://docs.github.com/en/organizations)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)
- [Secret Management Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

**Remember**: The `.github-private` directory is a powerful tool for organizing internal processes. Use it wisely and maintain it regularly!

**Last Updated**: 2025-12-12  
**Version**: 1.0
