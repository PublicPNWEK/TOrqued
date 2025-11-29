# GPG Quick Fix Guide

Having GPG signature verification issues? Here's a quick reference to solve common problems.

## The Problem

You're seeing one of these errors:
- ❌ `gpg: Can't check signature: No public key`
- ❌ `gpg: Signature made ... gpg: using RSA key ... gpg: Can't check signature: No public key`
- ❌ GitHub commits show as "Unverified"
- ❌ Git log shows signature errors

## Quick Solutions

### Option 1: Ignore GPG Warnings (Quick Fix for Development)

If you just need to continue working and GPG warnings don't affect your work:

```bash
# These warnings don't prevent you from committing or pushing
# They just mean Git can't verify other people's signatures
# You can safely ignore them and continue working
```

**Note:** This doesn't fix the root issue, but it won't prevent you from contributing.

### Option 2: Set Up GPG Signing (Recommended)

If you want to sign your own commits:

1. **Generate a GPG key:**
   ```bash
   gpg --full-generate-key
   ```
   - Choose RSA and RSA
   - 4096 bits
   - Your GitHub email address

2. **Get your key ID:**
   ```bash
   gpg --list-secret-keys --keyid-format=long
   # Look for sec rsa4096/YOUR_KEY_ID
   ```

3. **Tell Git about your key:**
   ```bash
   git config --global user.signingkey YOUR_KEY_ID
   git config --global commit.gpgsign true
   ```

4. **Export your public key:**
   ```bash
   gpg --armor --export YOUR_EMAIL@example.com
   ```

5. **Add to GitHub:**
   - Go to https://github.com/settings/keys
   - Click "New GPG key"
   - Paste your public key
   - Save

6. **Test it:**
   ```bash
   git commit --allow-empty -m "Test GPG signing"
   git log --show-signature -1
   ```

### Option 3: Fix Expired GPG Key

If your GPG key expired:

```bash
# Edit your key
gpg --edit-key YOUR_KEY_ID

# In the GPG prompt, type:
expire
# Choose new expiration
save

# Export updated key
gpg --armor --export YOUR_EMAIL@example.com

# Update on GitHub (Settings → SSH and GPG keys)
```

## Common Issues

### "No GPG secret key"

```bash
# List your keys
gpg --list-secret-keys

# If no keys exist, generate one (see Option 2 above)
gpg --full-generate-key
```

### "Inappropriate ioctl for device" or GPG hanging

```bash
# Add to ~/.bashrc or ~/.zshrc
export GPG_TTY=$(tty)

# Reload your shell
source ~/.bashrc  # or source ~/.zshrc
```

### GitHub not showing "Verified"

Check that:
1. ✅ Email in GPG key matches Git config
2. ✅ Email is verified in GitHub settings
3. ✅ Public key is added to GitHub
4. ✅ Commit was signed (`git log --show-signature`)

```bash
# Check your Git email
git config --global user.email

# Check your GPG key email
gpg --list-keys

# They must match!
```

## Still Having Issues?

See the full [GPG Setup Guide](GPG_SETUP.md) for:
- Detailed explanations
- Advanced troubleshooting
- Platform-specific instructions
- CI/CD integration
- And more...

## Quick Commands Reference

```bash
# Generate new key
gpg --full-generate-key

# List keys
gpg --list-secret-keys --keyid-format=long

# Export public key
gpg --armor --export YOUR_EMAIL@example.com

# Configure Git
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true

# Verify signature
git log --show-signature -1

# Commit without signing (one-time)
git commit --no-gpg-sign -m "Message"

# Disable signing globally
git config --global commit.gpgsign false
```

## Need More Help?

1. Check the [full GPG Setup Guide](GPG_SETUP.md)
2. Review [Contributing Guidelines](.github/CONTRIBUTING.md)
3. Search GitHub issues
4. Create a new issue with the "gpg" label

---

**Remember:** GPG warnings about other people's signatures won't prevent you from working. They're informational. Focus on setting up YOUR OWN signing if needed.
