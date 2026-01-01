# GPG Signing Setup and Troubleshooting

This guide helps you set up GPG commit signing and resolve common GPG verification issues in the TOrqued repository.

> **📚 For the complete, comprehensive GPG setup guide including:**
> - Detailed platform-specific instructions (macOS, Windows, Linux)
> - IDE integration (VS Code, IntelliJ, etc.)
> - Security best practices
> - CI/CD configuration
> - Advanced troubleshooting
>
> **See: [docs/GPG_SETUP.md](docs/GPG_SETUP.md)**

This file provides quick reference and common troubleshooting. For step-by-step setup instructions from scratch, use the comprehensive guide linked above.

## What is GPG Signing?

GPG (GNU Privacy Guard) signing allows you to cryptographically sign your commits, proving that you are the author. GitHub displays a "Verified" badge next to signed commits.

## Common GPG Issues

### Issue: "Can't check signature: No public key"

This error means Git cannot verify a commit signature because the GPG public key is not available.

**Solutions:**

1. **Add your GPG key to your GitHub account:**
   - Generate a GPG key (see below if you don't have one)
   - Export your public key: `gpg --armor --export YOUR_EMAIL@example.com`
   - Go to GitHub Settings → SSH and GPG keys → New GPG key
   - Paste your public key and save

2. **Verify your key is properly configured:**
   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```

### Issue: Expired GPG Key

If your GPG key has expired, you'll see signature verification failures.

**Solutions:**

1. **Extend your key's expiration date:**
   ```bash
   gpg --edit-key YOUR_KEY_ID
   # In the GPG prompt:
   expire
   # Choose new expiration time
   save
   ```

2. **Update your public key on GitHub:**
   - Export the updated key: `gpg --armor --export YOUR_EMAIL@example.com`
   - Update it in GitHub Settings → SSH and GPG keys

## Setting Up GPG Signing (First Time)

### 1. Generate a GPG Key

```bash
# Generate a new GPG key pair
gpg --full-generate-key

# Choose RSA and RSA (default)
# Key size: 4096 bits
# Expiration: Choose according to your preference (1 year recommended)
# Enter your name and email (use your GitHub email)
```

### 2. List Your GPG Keys

```bash
gpg --list-secret-keys --keyid-format=long
```

Output will look like:
```
sec   rsa4096/B5690EEEBB952194 2024-01-01 [SC] [expires: 2025-01-01]
      1234567890ABCDEF1234567890ABCDEF12345678
uid                 [ultimate] Your Name <your.email@example.com>
ssb   rsa4096/0987654321FEDCBA 2024-01-01 [E] [expires: 2025-01-01]
```

Your GPG key ID is `B5690EEEBB952194` in this example.

### 3. Export Your Public Key

```bash
gpg --armor --export YOUR_EMAIL@example.com
```

Copy the entire output, including:
```
-----BEGIN PGP PUBLIC KEY BLOCK-----
...
-----END PGP PUBLIC KEY BLOCK-----
```

### 4. Add GPG Key to GitHub

1. Go to: https://github.com/settings/keys
2. Click "New GPG key"
3. Paste your public key
4. Click "Add GPG key"

### 5. Configure Git to Sign Commits

```bash
# Tell Git about your GPG key
git config --global user.signingkey YOUR_KEY_ID

# Sign all commits by default
git config --global commit.gpgsign true

# (Optional) Sign tags by default
git config --global tag.gpgsign true
```

### 6. Configure GPG TTY (for terminal users)

Add to your `~/.bashrc` or `~/.zshrc`:
```bash
export GPG_TTY=$(tty)
```

Then reload your shell:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

## Testing Your Setup

Create a test commit to verify GPG signing works:

```bash
# Create a test commit
git commit --allow-empty -m "Test GPG signing"

# Verify the signature
git log --show-signature -1
```

You should see:
```
gpg: Signature made [date]
gpg:                using RSA key YOUR_KEY_ID
gpg: Good signature from "Your Name <your.email@example.com>"
```

## Troubleshooting

### GPG Agent Not Running

If you get "gpg: signing failed: No secret key":

```bash
# Start the GPG agent
gpgconf --launch gpg-agent

# Or restart it
gpgconf --kill gpg-agent
gpgconf --launch gpg-agent
```

### Passphrase Prompt Issues

If GPG doesn't prompt for your passphrase:

1. **Install pinentry** (if not installed):
   ```bash
   # Ubuntu/Debian
   sudo apt-get install pinentry-tty
   
   # macOS
   brew install pinentry-mac
   ```

2. **Configure GPG to use pinentry**:
   Edit `~/.gnupg/gpg-agent.conf`:
   ```
   pinentry-program /usr/bin/pinentry-tty
   # Or on macOS: /opt/homebrew/bin/pinentry-mac
   ```

3. **Reload the GPG agent**:
   ```bash
   gpgconf --kill gpg-agent
   gpgconf --launch gpg-agent
   ```

### GitHub Not Showing "Verified" Badge

1. **Ensure your commit email matches:**
   ```bash
   git config --global user.email "your.email@example.com"
   ```
   This email must match:
   - The email in your GPG key
   - An email verified in your GitHub account settings

2. **Check if key is added to GitHub:**
   Visit https://github.com/settings/keys

3. **Verify your local signature:**
   ```bash
   git log --show-signature -1
   ```

### Disabling GPG Signing (if needed)

If you want to temporarily disable GPG signing:

```bash
# Disable for all commits
git config --global commit.gpgsign false

# Or commit without signing once
git commit --no-gpg-sign -m "Your message"
```

## Repository-Specific GPG Issues

If you're having issues with this specific repository:

1. **Check if there are pre-commit hooks requiring signatures:**
   ```bash
   ls -la .git/hooks/
   ```

2. **Verify remote repository settings:**
   Some organizations require signed commits. Check with your repository administrator.

3. **For CI/CD pipelines:**
   - Automated commits from bots don't need GPG signing
   - Configure your CI/CD to use a dedicated bot account
   - Or use a deploy key instead of GPG signing

## Additional Resources

- [GitHub GPG Documentation](https://docs.github.com/en/authentication/managing-commit-signature-verification)
- [GPG Documentation](https://gnupg.org/documentation/)
- [Git GPG Signing](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)

## Need Help?

If you're still experiencing issues:

1. Check the repository's discussions or issues
2. Verify your GitHub account has the correct email verified
3. Ensure your GPG key hasn't expired
4. Contact the repository maintainers for assistance

---

**Note:** This repository currently has commits with verification issues. If you see "Can't check signature" warnings, it's likely due to missing public keys from other contributors. This doesn't affect your ability to contribute.
