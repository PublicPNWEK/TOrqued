# Contributing to TOrqued

Thank you for your interest in contributing to TOrqued! This guide will help you understand our development workflow, coding standards, and how to submit contributions.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Getting Help](#getting-help)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. By participating in this project, you agree to:

- **Be Respectful**: Treat everyone with respect and consideration
- **Be Collaborative**: Work together and help each other
- **Be Professional**: Focus on constructive feedback and solutions
- **Be Inclusive**: Welcome diverse perspectives and experiences

Unacceptable behavior will not be tolerated. If you witness or experience any issues, please report them to the project maintainers.

## Getting Started

### Prerequisites

Before you begin contributing, make sure you have:

1. **Node.js 18+** and **npm 9+** installed
   ```bash
   node --version  # Should be 18.0.0 or higher
   npm --version   # Should be 9.0.0 or higher
   ```

2. **Git** installed and configured
   ```bash
   git --version
   ```

3. **GPG signing** set up for commits (recommended)
   - See our [GPG Setup Guide](docs/GPG_SETUP.md) for detailed instructions

4. **A GitHub account** with:
   - Two-factor authentication enabled
   - SSH keys or HTTPS credentials configured

### Fork and Clone the Repository

1. **Fork the repository** on GitHub by clicking the "Fork" button

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/TOrqued.git
   cd TOrqued
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/PublicPNWEK/TOrqued.git
   ```

4. **Verify remotes**:
   ```bash
   git remote -v
   # origin    https://github.com/YOUR_USERNAME/TOrqued.git (fetch)
   # origin    https://github.com/YOUR_USERNAME/TOrqued.git (push)
   # upstream  https://github.com/PublicPNWEK/TOrqued.git (fetch)
   # upstream  https://github.com/PublicPNWEK/TOrqued.git (push)
   ```

### Install Dependencies

```bash
npm install
```

This will install all required dependencies from `package.json`.

### Set Up Environment Variables

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** and fill in the required values:
   - At minimum, you'll need `SHOPIFY_STORE`, `SHOPIFY_TOKEN`, and `SHOPIFY_THEME_ID`
   - See the [README.md](README.md) for detailed instructions on obtaining these values
   - Optional values can be left as-is for development

### Verify Your Setup

Run the development server to ensure everything works:
```bash
npm run dev
```

You should see the application running at `http://localhost:5173/`.

## Development Workflow

### 1. Create a New Branch

Always create a new branch for your work:
```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

**Branch Naming Convention:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Adding or updating tests
- `chore/description` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow our [Coding Standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

Before committing, ensure your changes work correctly:

```bash
# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Run tests
npm test

# Test the build
npm run build

# Validate theme structure (for Shopify changes)
npm run shopify:validate
```

### 4. Commit Your Changes

Write clear, descriptive commit messages following our [Commit Guidelines](#commit-guidelines):

```bash
git add .
git commit -m "feat: add user authentication feature"
```

If you've set up GPG signing, your commits will be automatically signed.

### 5. Keep Your Branch Updated

Regularly sync your branch with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

If conflicts occur, resolve them and continue the rebase:
```bash
# Fix conflicts in your editor
git add .
git rebase --continue
```

### 6. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the pull request template:
   - Clear title describing the change
   - Detailed description of what and why
   - Reference any related issues (e.g., "Closes #123")
   - Screenshots or GIFs for UI changes
4. Submit the pull request

## Coding Standards

### TypeScript/JavaScript

- **Use TypeScript** for all new code when possible
- **ESLint** will enforce code style (run `npm run lint`)
- Use **meaningful variable and function names**
- Add **JSDoc comments** for public APIs and complex logic
- Prefer **functional programming** patterns where appropriate
- Use **async/await** instead of promises chains

**Example:**
```typescript
/**
 * Fetches user data from the Shopify API
 * @param userId - The unique identifier for the user
 * @returns Promise resolving to user data
 */
async function fetchUserData(userId: string): Promise<UserData> {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }
  return response.json();
}
```

### React Components

- Use **functional components** with hooks
- Keep components **small and focused** (single responsibility)
- Use **TypeScript interfaces** for props
- Extract **reusable logic into custom hooks**
- Use **React.memo()** for expensive components

**Example:**
```typescript
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const { data, isLoading, error } = useUserData(userId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="user-profile">
      <h2>{data.name}</h2>
      {/* Component content */}
    </div>
  );
};
```

### Styling

- Use **existing CSS classes** when possible
- Follow **BEM naming convention** for new CSS classes
- Keep styles **scoped to components**
- Use **CSS variables** for theme colors and values
- Ensure **responsive design** (mobile-first approach)

### File Organization

```
src/
├── client/
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
├── server/            # Server-side code
│   ├── api/          # API routes
│   ├── middleware/   # Express middleware
│   └── services/     # Business logic
└── shared/           # Shared code between client and server
```

### Security Best Practices

- **Never commit secrets** or API keys
- **Validate all user input** on both client and server
- **Sanitize data** before rendering in templates
- Use **Liquid's `json` filter** for outputting data into JavaScript
- Follow **OWASP security guidelines**
- Run `npm run security:scan` before submitting PRs

**Example of safe data output in Liquid:**
```liquid
<script>
  const configData = {{ section.settings | json }};
</script>
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no feature change or bug fix)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI/CD configuration
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add OAuth2 authentication support"

# Bug fix
git commit -m "fix(dashboard): correct calculation in revenue chart"

# Documentation
git commit -m "docs: update installation instructions in README"

# Refactoring
git commit -m "refactor(api): simplify error handling logic"

# Multiple paragraphs
git commit -m "feat(analytics): add real-time metrics dashboard

Implements WebSocket connection for live data updates.
Includes new charts and visualization components.

Closes #123"
```

### Commit Message Guidelines

- **Use the imperative mood** in the subject line ("add" not "added")
- **Keep subject line under 72 characters**
- **Separate subject from body** with a blank line
- **Wrap body text at 72 characters**
- **Reference issues and PRs** in the footer
- **Sign your commits** with GPG (recommended)

## Pull Request Process

### Before Submitting

1. ✅ Code follows our coding standards
2. ✅ All tests pass (`npm test`)
3. ✅ Linting passes (`npm run lint`)
4. ✅ Type checking passes (`npx tsc --noEmit`)
5. ✅ Build succeeds (`npm run build`)
6. ✅ Theme validation passes (`npm run shopify:validate`)
7. ✅ Security scan is clean (`npm run security:scan`)
8. ✅ Documentation is updated (if needed)
9. ✅ Commits are properly formatted and signed

### PR Title

Use the same format as commit messages:
```
feat(scope): description
fix(scope): description
docs: description
```

### PR Description Template

```markdown
## Description
Brief description of changes and why they were made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Closes #123
Relates to #456

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Theme validation passed

## Screenshots (if applicable)
[Add screenshots or GIFs for UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated and passing
- [ ] Dependent changes merged
```

### Review Process

1. **Automated Checks**: GitHub Actions will run tests, linting, and security scans
2. **Code Review**: Maintainers will review your code and provide feedback
3. **Address Feedback**: Make requested changes and push updates
4. **Approval**: Once approved, a maintainer will merge your PR

### After Your PR is Merged

1. **Delete your branch**:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your local main**:
   ```bash
   git checkout main
   git pull upstream main
   ```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.spec.ts
```

### Writing Tests

- Write tests for **all new features**
- Use **descriptive test names** that explain what is being tested
- Follow **AAA pattern**: Arrange, Act, Assert
- Use **test fixtures and mocks** for external dependencies
- Aim for **high code coverage** (80%+ target)

**Example:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { calculateRevenue } from './revenue';

describe('calculateRevenue', () => {
  it('should calculate total revenue from order list', () => {
    // Arrange
    const orders = [
      { id: '1', amount: 100 },
      { id: '2', amount: 200 },
    ];
    
    // Act
    const result = calculateRevenue(orders);
    
    // Assert
    expect(result).toBe(300);
  });
  
  it('should return 0 for empty order list', () => {
    expect(calculateRevenue([])).toBe(0);
  });
});
```

### Integration Tests

For Shopify theme changes:
```bash
npm run shopify:validate
```

For API endpoints and server logic:
```bash
npm run test:integration
```

### End-to-End Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:playwright
```

## Documentation

Good documentation is crucial for project maintainability.

### When to Update Documentation

Update documentation when you:
- Add a new feature
- Change existing functionality
- Fix a bug that affects documented behavior
- Add new configuration options
- Introduce breaking changes

### Documentation Types

1. **Code Comments**: For complex logic and public APIs
2. **README.md**: High-level project overview and getting started
3. **API Documentation**: For API endpoints and functions
4. **Shopify Theme Documentation**: For theme structure and customization
5. **Guides and Tutorials**: In the `docs/` directory

### Documentation Style

- Use **clear, simple language**
- Provide **code examples** where helpful
- Include **screenshots** for UI-related documentation
- Keep documentation **up-to-date** with code changes
- Use **Markdown** for formatting

### Key Documentation Files

- `README.md` - Project overview and quick start
- `CONTRIBUTING.md` - This file
- `docs/GPG_SETUP.md` - GPG signing setup
- `docs/THEME_STRUCTURE.md` - Shopify theme architecture
- `COMPETITIVE_ADVANTAGES.md` - Advanced features
- `THEME_IMPORT.md` - Theme import guide

## Getting Help

### Resources

- **Documentation**: Check the `docs/` directory and README.md
- **Issues**: Search [existing issues](https://github.com/PublicPNWEK/TOrqued/issues) for similar problems
- **Discussions**: Use [GitHub Discussions](https://github.com/PublicPNWEK/TOrqued/discussions) for questions

### Asking Questions

When asking for help:
1. **Search first**: Check if your question has been answered
2. **Be specific**: Provide context and details
3. **Include examples**: Share code snippets, error messages, or screenshots
4. **Environment details**: Mention your OS, Node version, etc.

### Reporting Bugs

Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Environment information
- Error messages or logs
- Screenshots if applicable

### Suggesting Features

Use the feature request template and include:
- Clear description of the feature
- Use case and benefits
- Proposed implementation (if you have ideas)
- Alternative solutions considered

## Recognition

Contributors will be recognized in the following ways:
- Listed in the project's contributor list
- Mentioned in release notes for significant contributions
- GitHub contribution graph reflects your work

## License

By contributing to TOrqued, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to TOrqued!** Your efforts help make this project better for everyone. If you have questions about this guide, please open an issue or discussion.
Thank you for your interest in contributing to TOrqued! This document provides guidelines and information to help you contribute effectively.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Commit Signing with GPG](#commit-signing-with-gpg)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/PublicPNWEK/TOrqued.git
cd TOrqued

# Install dependencies
npm install

# Run development server
npm run dev
```

## Commit Signing with GPG

### Why GPG Signing?

GPG (GNU Privacy Guard) signing provides cryptographic verification that commits actually came from you. This helps maintain the security and integrity of the codebase.

### The GPG Verification Issue

You may encounter commits in the repository with unverified signatures showing the error:
```
gpg: Can't check signature: No public key
```

This occurs when:
1. A commit was signed with a GPG key
2. The public key for that GPG key is not available to verify the signature
3. Git cannot verify the authenticity of the commit

This is **not a security vulnerability** in your local environment, but rather a verification status that indicates the commit's signature cannot be verified without the signer's public key.

### Setting Up GPG Signing (Optional but Recommended)

#### 1. Check if you have GPG installed

```bash
gpg --version
```

If GPG is not installed:
- **Ubuntu/Debian**: `sudo apt-get install gnupg`
- **macOS**: `brew install gnupg`
- **Windows**: Download from [GnuPG.org](https://gnupg.org/download/)

#### 2. Generate a GPG key (if you don't have one)

```bash
gpg --full-generate-key
```

Follow the prompts:
- Choose RSA and RSA (default)
- Key size: 4096 bits (recommended)
- Expiration: 0 (key does not expire) or your preference
- Enter your name and email (use the email associated with your GitHub account)
- Enter a secure passphrase

#### 3. List your GPG keys

```bash
gpg --list-secret-keys --keyid-format=long
```

Look for output like:
```
sec   rsa4096/YOUR_KEY_ID 2025-11-29 [SC]
```

Copy YOUR_KEY_ID (the part after `rsa4096/`)

#### 4. Export your public key

```bash
gpg --armor --export YOUR_KEY_ID
```

Copy the entire output, including `-----BEGIN PGP PUBLIC KEY BLOCK-----` and `-----END PGP PUBLIC KEY BLOCK-----`

#### 5. Add the GPG key to GitHub

1. Go to GitHub Settings → SSH and GPG keys
2. Click "New GPG key"
3. Paste your public key
4. Click "Add GPG key"

#### 6. Configure Git to use your GPG key

```bash
# Set your GPG key
git config --global user.signingkey YOUR_KEY_ID

# Enable commit signing by default (applies to all repositories on this system)
git config --global commit.gpgsign true

# For tag signing
git config --global tag.gpgsign true
```

**Note**: Using `--global` affects all repositories on your system. To enable GPG signing only for this repository, omit `--global`:
```bash
git config user.signingkey YOUR_KEY_ID
git config commit.gpgsign true
```

#### 7. Configure GPG agent (optional, for convenience)

To avoid entering your passphrase repeatedly:

**On macOS:**
```bash
echo "use-agent" >> ~/.gnupg/gpg.conf
echo "pinentry-program /usr/local/bin/pinentry-mac" >> ~/.gnupg/gpg-agent.conf
killall gpg-agent
```

**On Linux:**
```bash
echo "use-agent" >> ~/.gnupg/gpg.conf
killall gpg-agent
```

### Troubleshooting GPG Issues

#### Problem: "gpg failed to sign the data"

**Solutions:**
1. Test GPG signing manually:
   ```bash
   echo "test" | gpg --clearsign
   ```

2. If the above fails, restart the GPG agent:
   ```bash
   killall gpg-agent
   gpg-agent --daemon
   ```

3. Check GPG configuration:
   ```bash
   git config --global user.signingkey
   gpg --list-secret-keys --keyid-format=long
   ```

4. Ensure your key hasn't expired:
   ```bash
   gpg --list-keys YOUR_KEY_ID
   ```

#### Problem: "secret key not available"

This means Git is configured to use a GPG key that doesn't exist on your system.

**Solution:**
```bash
# Check current configuration
git config --global user.signingkey

# Either generate a new key (see step 2 above) or unset signing
git config --global --unset user.signingkey
git config --global --unset commit.gpgsign
```

#### Problem: "Can't check signature: No public key" when pulling

This is normal and not an error. It simply means:
- Someone else's commit is GPG-signed
- Their public key isn't in your keyring
- The commit itself is still valid and safe to use

You can:
1. Ignore it (recommended) - it doesn't affect functionality
2. Import their public key if you need to verify their commits
3. Disable GPG signature verification for fetch/pull operations:
   ```bash
   git config --global gpg.program true  # Disables all GPG operations
   # OR more explicitly:
   git config --global commit.gpgsign false  # Only disables signing your commits
   ```

#### Problem: Commits are being signed, but GitHub shows "Unverified"

**Causes:**
1. The email in your GPG key doesn't match your Git/GitHub email
2. The public key wasn't added to GitHub
3. The email isn't verified on GitHub

**Solution:**
```bash
# Check Git email
git config --global user.email

# Check GPG key email
gpg --list-keys YOUR_KEY_ID

# Update GPG key email if needed (requires generating a new key)
# OR change Git email to match GPG key:
git config --global user.email "your-gpg-key-email@example.com"
```

### Contributing Without GPG Signing

GPG signing is **not required** to contribute to this repository. You can disable it:

```bash
git config --global commit.gpgsign false
```

Your contributions are welcome regardless of signing status!

## Pull Request Process

1. **Create a descriptive branch name**: `feature/your-feature-name` or `fix/bug-description`
2. **Keep commits atomic**: Each commit should represent a single logical change
3. **Write clear commit messages**: Follow the format:
   ```
   Brief description (50 chars or less)

   Longer explanation if needed, wrapped at 72 characters.
   Include motivation for the change and contrast with previous behavior.
   ```
4. **Update documentation**: If your changes affect how users interact with the project, update relevant documentation
5. **Test your changes**: Ensure all existing tests pass and add tests for new functionality
6. **Submit the PR**: Include a clear description of what changed and why

### PR Review Process

- All PRs require at least one approval
- CI checks must pass
- Merge conflicts must be resolved
- Code should follow project style guidelines

## Code Style

- **JavaScript/TypeScript**: Follow existing code patterns
- **React Components**: Use functional components with hooks
- **File naming**: Use kebab-case for files: `component-name.tsx`
- **Imports**: Organize imports logically (React imports first, then external packages, then internal imports)

## Testing

Before submitting a pull request:

```bash
# Run tests (when test infrastructure exists)
npm test

# Run linter
npm run lint

# Build the project
npm run build

# Test Shopify deployment locally
npm run shopify:deploy
```

## Questions?

If you have questions or need help:
1. Check existing issues and pull requests
2. Open a new issue with the `question` label
3. Reach out to maintainers

---

Thank you for contributing to TOrqued! 🚀
