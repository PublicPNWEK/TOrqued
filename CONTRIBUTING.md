# Contributing to TOrqued

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
