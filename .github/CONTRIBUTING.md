# Contributing to TOrqued

Thank you for your interest in contributing to TOrqued!

## 📖 Full Contributing Guide

Please see our comprehensive **[Contributing Guide](../CONTRIBUTING.md)** in the root of the repository for detailed information on:

- **Getting Started**: Prerequisites, fork/clone process, environment setup
- **Development Workflow**: Branches, commits, testing, and deployment
- **Coding Standards**: TypeScript, React, styling, and security best practices
- **Commit Guidelines**: Conventional commits format with examples
- **Pull Request Process**: Checklist, templates, and review process
- **Testing**: Unit tests, integration tests, and E2E testing
- **Documentation**: When and how to update docs
- **Getting Help**: Resources, reporting bugs, and feature requests

## 🔐 GPG Commit Signing

For detailed information about GPG commit signing (optional but recommended), see:
- **[GPG Setup Guide](../docs/GPG_SETUP.md)** - Complete guide to setting up GPG signing

## Quick Start for Contributors

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/TOrqued.git
cd TOrqued

# Install dependencies
npm install
**📚 For complete setup instructions, troubleshooting, and best practices, see our comprehensive [GPG Setup Guide](../docs/GPG_SETUP.md).**

**⚠️ If you encounter GPG verification errors or see warnings about unverified signatures:**
- Full guide: [GPG Setup Guide](../docs/GPG_SETUP.md)
- Quick fixes: [GPG Quick Fix Guide](../GPG_QUICK_FIX.md)

Common GPG-related issues covered in the guide:
- "Can't check signature: No public key"
- Expired GPG keys and renewal instructions
- GitHub not showing "Verified" badge
- Platform-specific setup (macOS, Windows, Linux)
- IDE integration (VS Code, IntelliJ, etc.)
- CI/CD configuration

# Copy environment file
cp .env.example .env
# Edit .env with your Shopify credentials

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run lint
npm run build
npm test

# Commit and push
git commit -m "feat: description of changes"
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Questions?

- Check the [main Contributing Guide](../CONTRIBUTING.md)
- Review existing [issues](https://github.com/PublicPNWEK/TOrqued/issues)
- Open a new issue with your question

---

**Thank you for contributing!** 🚀
