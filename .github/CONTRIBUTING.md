# Contributing to TOrqued

Thank you for your interest in contributing to TOrqued! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/TOrqued.git
   cd TOrqued
   ```
3. **Install dependencies**:
   ```bash
   npm ci
   ```
4. **Set up your environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Development Workflow

### Making Changes

1. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   npm test
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

### Code Style

- Follow the existing code style and patterns
- Run `npm run lint` before committing
- Ensure TypeScript types are properly defined
- Write clear, descriptive commit messages

## GPG Commit Signing

This repository may have commits that require GPG signature verification. While not mandatory for all contributions, we recommend setting up GPG signing for better security.

**⚠️ If you encounter GPG verification errors or see warnings about unverified signatures, please refer to our [GPG Setup Guide](../GPG_SETUP.md).**

Common GPG-related issues:
- "Can't check signature: No public key" - See [GPG Setup Guide](../GPG_SETUP.md)
- Expired GPG keys - Instructions for renewal in the guide
- GitHub not showing "Verified" badge - Troubleshooting steps provided

## Pull Request Process

1. **Update documentation** if you've made changes that affect it
2. **Ensure all tests pass** and there are no linting errors
3. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
4. **Create a Pull Request** on GitHub with:
   - Clear description of changes
   - Link to related issues (if applicable)
   - Screenshots for UI changes

### Pull Request Guidelines

- Keep changes focused and atomic
- Write descriptive PR titles and descriptions
- Update tests for new features or bug fixes
- Ensure CI/CD pipeline passes
- Respond to code review feedback promptly

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types (avoid `any` unless absolutely necessary)
- Use modern ES6+ syntax
- Follow the existing project structure

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow React best practices

### Testing

- Write unit tests for new functionality
- Ensure test coverage for critical paths
- Integration tests for complex features
- E2E tests for user workflows

## Security

- Never commit secrets, API keys, or credentials
- Use environment variables for configuration
- Report security vulnerabilities privately to maintainers
- Follow security best practices

## Reporting Issues

When reporting issues, please include:

1. **Description** of the issue
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details** (OS, Node version, etc.)
6. **Screenshots or error messages** (if applicable)

### Issue Templates

Use the provided issue templates when available:
- Bug reports
- Feature requests
- Security vulnerabilities

## Getting Help

- Check the [README](../README.md) for setup instructions
- Review [GPG_SETUP.md](../GPG_SETUP.md) for GPG-related issues
- Search existing issues before creating new ones
- Ask questions in GitHub Discussions (if enabled)
- Contact maintainers for urgent issues

## Project Structure

```
TOrqued/
├── .github/          # GitHub workflows and templates
├── src/              # Source code
│   ├── components/   # React components
│   ├── utils/        # Utility functions
│   ├── types/        # TypeScript type definitions
│   └── ...
├── scripts/          # Build and deployment scripts
├── tests/            # Test files
├── public/           # Static assets
└── dist/             # Build output (not committed)
```

## License

By contributing to TOrqued, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Welcome newcomers
- Help maintain a positive environment

## Questions?

If you have questions about contributing, please:
1. Check this guide and other documentation
2. Search existing issues and discussions
3. Create a new issue with the "question" label
4. Reach out to maintainers

Thank you for contributing to TOrqued! 🚀
