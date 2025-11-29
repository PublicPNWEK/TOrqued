# GPG Key Setup for Contributors

This guide will help you set up GPG signing for your commits to the TOrqued repository. Signed commits provide verification that commits actually came from you and weren't tampered with.

## Table of Contents
- [Why GPG Signing?](#why-gpg-signing)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Generating a GPG Key](#generating-a-gpg-key)
- [Adding Your GPG Key to GitHub](#adding-your-gpg-key-to-github)
- [Configuring Git to Use GPG](#configuring-git-to-use-gpg)
- [Signing Your Commits](#signing-your-commits)
- [Troubleshooting](#troubleshooting)

## Why GPG Signing?

GPG (GNU Privacy Guard) signing ensures:
- **Authenticity**: Verifies that commits come from you
- **Integrity**: Ensures commits haven't been tampered with
- **Trust**: Builds confidence in the codebase security
- **Compliance**: Meets security requirements for enterprise projects

## Prerequisites

Before you begin, ensure you have:
- Git installed (version 2.0 or higher)
- A GitHub account
- Command line access (Terminal on macOS/Linux, Git Bash or PowerShell on Windows)

## Installation

### macOS

Install GPG using Homebrew:
```bash
brew install gnupg
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install gnupg
```

### Linux (Fedora/RHEL)

```bash
sudo dnf install gnupg2
```

### Windows

Download and install [Gpg4win](https://www.gpg4win.org/download.html), or use Chocolatey:
```powershell
choco install gpg4win
```

### Verify Installation

Check that GPG is installed correctly:
```bash
gpg --version
```

You should see output showing the GPG version (e.g., `gpg (GnuPG) 2.x.x`).

## Generating a GPG Key

### Step 1: Generate the Key

Run the following command:
```bash
gpg --full-generate-key
```

### Step 2: Choose Key Type

When prompted, select:
- **Key type**: `(1) RSA and RSA` (default)
- Press `Enter` to confirm

### Step 3: Choose Key Size

- **Key size**: `4096` (recommended for maximum security)
- Type `4096` and press `Enter`

### Step 4: Set Expiration

- **Expiration**: Choose based on your preference
  - `0` = key does not expire (simplest, but less secure)
  - `1y` = key expires in 1 year (recommended)
  - `2y` = key expires in 2 years
- Enter your choice and press `Enter`
- Confirm with `y`

### Step 5: Enter User Information

Provide the following information:
- **Real name**: Your full name (as it appears on GitHub)
- **Email address**: The email address associated with your GitHub account
- **Comment**: Optional (you can leave blank or add "GitHub signing key")

Example:
```
Real name: John Doe
Email address: john.doe@example.com
Comment: GitHub signing key
```

### Step 6: Create a Passphrase

- Enter a strong passphrase (you'll need this to sign commits)
- Confirm the passphrase
- **Important**: Store this passphrase securely (e.g., in a password manager)

### Step 7: Generate Entropy

The system will generate random data. You may be asked to perform actions to generate entropy (move your mouse, type randomly, etc.). Wait for the process to complete.

### Step 8: Verify Key Creation

List your GPG keys:
```bash
gpg --list-secret-keys --keyid-format=long
```

You should see output similar to:
```
/Users/yourusername/.gnupg/secring.gpg
---------------------------------------
sec   rsa4096/3AA5C34371567BD2 2024-01-15 [SC] [expires: 2025-01-15]
      1234567890ABCDEF1234567890ABCDEF12345678
uid                 [ultimate] John Doe <john.doe@example.com>
ssb   rsa4096/42B317FD4BA89E7A 2024-01-15 [E] [expires: 2025-01-15]
```

**Important**: Note the GPG key ID on the `sec` line after `rsa4096/`. In the example above, it's `3AA5C34371567BD2`.

## Adding Your GPG Key to GitHub

### Step 1: Export Your Public Key

Replace `3AA5C34371567BD2` with your actual GPG key ID:
```bash
gpg --armor --export 3AA5C34371567BD2
```

This will output your public key, which looks like:
```
-----BEGIN PGP PUBLIC KEY BLOCK-----

[long string of characters]

-----END PGP PUBLIC KEY BLOCK-----
```

### Step 2: Copy the Public Key

Copy the entire output, including the `-----BEGIN PGP PUBLIC KEY BLOCK-----` and `-----END PGP PUBLIC KEY BLOCK-----` lines.

### Step 3: Add to GitHub

1. Go to [GitHub.com](https://github.com) and log in
2. Click your profile photo in the top right, then click **Settings**
3. In the left sidebar, click **SSH and GPG keys**
4. Click **New GPG key**
5. In the "Title" field, type a descriptive name for the key (e.g., "Personal Laptop")
6. Paste your GPG key into the "Key" field
7. Click **Add GPG key**
8. If prompted, confirm your GitHub password

## Configuring Git to Use GPG

### Step 1: Tell Git About Your GPG Key

Replace `3AA5C34371567BD2` with your GPG key ID:
```bash
git config --global user.signingkey 3AA5C34371567BD2
```

### Step 2: Set Your Git Email

Make sure your Git email matches the email used in your GPG key:
```bash
git config --global user.email "john.doe@example.com"
```

### Step 3: Set Your Git Name

```bash
git config --global user.name "John Doe"
```

### Step 4: Enable Commit Signing (Optional but Recommended)

To automatically sign all commits:
```bash
git config --global commit.gpgsign true
```

If you don't enable this, you'll need to add `-S` to each commit: `git commit -S -m "Your message"`

### Step 5: Configure GPG Program (if needed)

On some systems, you may need to tell Git where to find GPG:

**macOS/Linux:**
```bash
git config --global gpg.program gpg
```

**Windows:**
```powershell
git config --global gpg.program "C:\Program Files (x86)\GnuPG\bin\gpg.exe"
```

## Signing Your Commits

### Automatic Signing

If you enabled automatic signing (`commit.gpgsign true`), just commit normally:
```bash
git add .
git commit -m "Your commit message"
```

### Manual Signing

If you didn't enable automatic signing, use the `-S` flag:
```bash
git commit -S -m "Your commit message"
```

### Verifying Signed Commits

Check if your commit was signed:
```bash
git log --show-signature -1
```

You should see output like:
```
gpg: Signature made Mon Jan 15 10:30:45 2024 PST
gpg:                using RSA key 3AA5C34371567BD2
gpg: Good signature from "John Doe <john.doe@example.com>" [ultimate]
```

### Push to GitHub

Push your signed commits:
```bash
git push origin your-branch-name
```

On GitHub, your commits will show a "Verified" badge ✅ next to them.

## Troubleshooting

### Issue: "gpg failed to sign the data"

**Solutions:**

1. **Test GPG signing manually:**
   ```bash
   echo "test" | gpg --clearsign
   ```
   If this fails, your GPG setup has an issue.

2. **Set GPG_TTY environment variable:**
   Add to your `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`:
   ```bash
   export GPG_TTY=$(tty)
   ```
   Then reload your shell:
   ```bash
   source ~/.bashrc  # or ~/.zshrc
   ```

3. **Check GPG agent:**
   ```bash
   gpgconf --kill gpg-agent
   gpgconf --launch gpg-agent
   ```

4. **Use a different GPG program (macOS):**
   If you installed GPG via Homebrew:
   ```bash
   git config --global gpg.program $(which gpg)
   ```

### Issue: "no secret key" Error

**Solution:**
Your Git email doesn't match your GPG key email. Check both:
```bash
git config --global user.email
gpg --list-secret-keys --keyid-format=long
```
Make sure they match exactly.

### Issue: Passphrase Prompt Not Appearing (macOS)

**Solution:**
Install `pinentry-mac`:
```bash
brew install pinentry-mac
echo "pinentry-program $(which pinentry-mac)" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent
```

### Issue: Passphrase Prompt Not Appearing (Windows)

**Solution:**
Make sure Gpg4win is installed with the Kleopatra component, which provides the passphrase dialog.

### Issue: "Inappropriate ioctl for device"

**Solution:**
Add to your shell profile (`~/.bashrc` or `~/.zshrc`):
```bash
export GPG_TTY=$(tty)
```

### Issue: Commits Not Showing as Verified on GitHub

**Checklist:**
1. ✅ GPG key added to GitHub (Settings → SSH and GPG keys)
2. ✅ Git email matches GPG key email exactly
3. ✅ Commit is actually signed (check with `git log --show-signature`)
4. ✅ GPG key has not expired
5. ✅ Public key uploaded to GitHub is the correct one

**Verify your setup:**
```bash
# Check Git email
git config user.email

# Check GPG key email
gpg --list-secret-keys --keyid-format=long

# Check if key is on GitHub
# Visit: https://github.com/settings/keys
```

### Issue: Signing Commits in VS Code

**Solution:**
1. Enable commit signing in Git (see "Configuring Git to Use GPG")
2. In VS Code, open Settings (Cmd/Ctrl + ,)
3. Search for "git.enableCommitSigning"
4. Enable the checkbox

### Issue: Multiple GPG Keys

If you have multiple GPG keys, specify which one to use:
```bash
git config --global user.signingkey YOUR_KEY_ID
```

To see all your keys:
```bash
gpg --list-secret-keys --keyid-format=long
```

## Additional Resources

- [GitHub Documentation on GPG Signing](https://docs.github.com/en/authentication/managing-commit-signature-verification)
- [GnuPG Documentation](https://www.gnupg.org/documentation/)
- [Git Tools - Signing Your Work](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)

## Getting Help

If you encounter issues not covered in this guide:
1. Check the [GitHub Community](https://github.community/)
2. Open an issue in the TOrqued repository
3. Ask in the project's communication channels

---

**Next Steps**: After setting up GPG signing, review the [Contributing Guide](../CONTRIBUTING.md) to learn about our development workflow and contribution standards.
