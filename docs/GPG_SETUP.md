# GPG Key Setup for Contributors

This guide will help you set up GPG signing for your commits to the TOrqued repository. Signed commits provide verification that commits actually came from you and weren't tampered with.

## Table of Contents
- [Why GPG Signing?](#why-gpg-signing)
  - [When to Use GPG Signing](#when-to-use-gpg-signing)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [macOS](#macos)
  - [Linux](#linux-ubuntudebian)
  - [Windows](#windows)
- [Generating a GPG Key](#generating-a-gpg-key)
- [Adding Your GPG Key to GitHub](#adding-your-gpg-key-to-github)
- [Configuring Git to Use GPG](#configuring-git-to-use-gpg)
- [Signing Your Commits](#signing-your-commits)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)
- [IDE and Editor Integration](#ide-and-editor-integration)
- [Platform-Specific Notes](#platform-specific-notes)
- [Verifying Commits](#verifying-commits)
- [CI/CD Considerations](#cicd-considerations)
- [Additional Resources](#additional-resources)
- [Getting Help](#getting-help)

## Why GPG Signing?

GPG (GNU Privacy Guard) signing ensures:
- **Authenticity**: Verifies that commits come from you
- **Integrity**: Ensures commits haven't been tampered with
- **Trust**: Builds confidence in the codebase security
- **Compliance**: Meets security requirements for enterprise projects

### When to Use GPG Signing

**Required scenarios:**
- Contributing to security-sensitive projects
- Working on projects with compliance requirements (SOC 2, ISO 27001)
- Organizations with mandatory commit signing policies
- Open source projects requiring verified contributions

**Recommended scenarios:**
- Any production code deployment
- Contributions to high-profile open source projects
- When you want to build trust with maintainers
- Personal projects where you want to prove authenticity

**Optional scenarios:**
- Personal experimentation repositories
- Internal development environments without security requirements
- Educational or learning projects

**Note:** While this repository doesn't strictly require GPG signing, it is highly recommended for all contributions to maintain code integrity and build trust within the community.

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

## Security Best Practices

### Protecting Your GPG Key

1. **Use a Strong Passphrase**
   - At least 20 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Store in a password manager
   - Never share your passphrase

2. **Backup Your Keys**
   ```bash
   # Export private key (keep this VERY secure!)
   gpg --export-secret-keys --armor YOUR_KEY_ID > private-key-backup.asc
   
   # Export public key
   gpg --export --armor YOUR_KEY_ID > public-key-backup.asc
   
   # Export trust database
   gpg --export-ownertrust > trustdb-backup.txt
   ```
   
   Store these backups:
   - Encrypted USB drive
   - Encrypted cloud storage (with strong encryption)
   - Physical safe or secure location
   - **Never** commit to a repository

3. **Set Key Expiration**
   - Always set an expiration date (1-2 years recommended)
   - Extend before expiration, don't let it expire
   - Expired keys can still decrypt old messages but can't sign new ones

4. **Regular Key Rotation**
   - Consider rotating keys every 1-2 years
   - Update all services when rotating
   - Keep old keys for historical verification

5. **Revocation Certificate**
   Generate a revocation certificate (in case key is compromised):
   ```bash
   gpg --gen-revoke YOUR_KEY_ID > revocation-cert.asc
   ```
   Store securely - anyone with this can revoke your key.

### What NOT to Do

❌ **Never commit private keys to repositories**
❌ **Never share your private key or passphrase**
❌ **Don't use the same key for multiple purposes (encrypt vs. sign)**
❌ **Don't use keys without expiration dates**
❌ **Don't reuse passphrases across different keys**
❌ **Don't skip backing up your keys**

### If Your Key is Compromised

If you believe your private key has been compromised:

1. **Revoke the key immediately:**
   ```bash
   gpg --import revocation-cert.asc
   gpg --send-keys YOUR_KEY_ID
   ```

2. **Remove from GitHub:**
   - Go to https://github.com/settings/keys
   - Delete the compromised key

3. **Generate a new key** (see "Generating a GPG Key" section)

4. **Update all services** that use your GPG key

5. **Notify maintainers** of repositories where you're a contributor

### Using Multiple Keys

It's good practice to have separate keys for different purposes:

- **Personal projects**: Personal GPG key
- **Work projects**: Work email GPG key
- **CI/CD**: Dedicated bot account key

Configure per-repository:
```bash
# In the repository directory
git config user.signingkey YOUR_KEY_ID
git config user.email your.email@example.com
```

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

### Issue: Expired GPG Key

If your GPG key has expired, your commits won't be verified by GitHub.

**Check key expiration:**
```bash
gpg --list-keys YOUR_KEY_ID
```

Look for `[expires: YYYY-MM-DD]` in the output.

**Solution 1: Extend Key Expiration**
```bash
# Edit your key
gpg --edit-key YOUR_KEY_ID

# In the GPG prompt, type:
expire

# Choose new expiration time:
# - 0 = key does not expire (NOT RECOMMENDED for security)
# - 1y = expires in 1 year (recommended)
# - 2y = expires in 2 years (recommended)

# Save changes
save
```

**Solution 2: Update Public Key on GitHub**
After extending expiration:
```bash
# Export the updated public key
gpg --armor --export YOUR_EMAIL@example.com
```

Then update it on GitHub:
1. Go to https://github.com/settings/keys
2. Delete the old key
3. Add the new (updated) key

**Solution 3: Generate a New Key**
If you prefer a fresh start, generate a new GPG key (see "Generating a GPG Key" section) and add it to GitHub.

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

## IDE and Editor Integration

### Visual Studio Code

VS Code has built-in support for GPG signing:

1. **Enable commit signing in Git** (see "Configuring Git to Use GPG" section above)
2. **Configure VS Code settings**:
   - Open Settings (Cmd/Ctrl + ,)
   - Search for "git.enableCommitSigning"
   - Enable the checkbox
3. **Alternative**: Add to your settings.json:
   ```json
   {
     "git.enableCommitSigning": true
   }
   ```

### JetBrains IDEs (IntelliJ IDEA, WebStorm, PyCharm, etc.)

1. **Open Settings/Preferences** (Cmd/Ctrl + ,)
2. Navigate to **Version Control → Git**
3. Check the box for **"Sign commits with GPG"**
4. Ensure the GPG executable path is correct
5. Apply and save changes

### Atom

1. Open Settings (Cmd/Ctrl + ,)
2. Go to Packages → github
3. Enable **"Sign commits with GPG"**

### Sublime Text with Sublime Merge

Sublime Merge supports GPG signing:
1. Open Preferences → Settings
2. Add: `"commit_sign": true`

### Command Line Tools

For git commands directly in terminal, ensure you've configured:
```bash
git config --global commit.gpgsign true
git config --global user.signingkey YOUR_KEY_ID
```

## Platform-Specific Notes

### macOS

**Homebrew Installation:**
```bash
brew install gnupg pinentry-mac
```

**GPG Agent Configuration:**
Create or edit `~/.gnupg/gpg-agent.conf`:
```
pinentry-program /opt/homebrew/bin/pinentry-mac
default-cache-ttl 600
max-cache-ttl 7200
```

**Shell Configuration:**
Add to `~/.zshrc` or `~/.bash_profile`:
```bash
export GPG_TTY=$(tty)
```

**Apple Silicon Notes:**
- Use ARM64 version of Homebrew (`/opt/homebrew`)
- Pinentry path: `/opt/homebrew/bin/pinentry-mac`

### Windows

**Installation Options:**
1. **Gpg4win** (recommended): Full suite with GUI
   - Download from https://www.gpg4win.org/download.html
   - Includes Kleopatra (key management GUI)
   
2. **Chocolatey**:
   ```powershell
   choco install gpg4win
   ```

**Git Bash Configuration:**
If using Git Bash, add to `~/.bashrc`:
```bash
export GPG_TTY=$(tty)
```

**PowerShell Configuration:**
```powershell
# PowerShell does not require GPG_TTY to be set.
# If you encounter issues with passphrase prompts, configure the pinentry program instead.
# See Gpg4win documentation for details: https://www.gpg4win.org/documentation.html
```

**Windows Subsystem for Linux (WSL):**
If using WSL, you have two options:
1. Install GPG in WSL and configure there
2. Use Windows GPG with WSL:
   ```bash
   # In WSL, configure git to use Windows GPG
   git config --global gpg.program "/mnt/c/Program Files (x86)/GnuPG/bin/gpg.exe"
   ```

### Linux

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install gnupg pinentry-tty
```

**Fedora/RHEL/CentOS:**
```bash
sudo dnf install gnupg2 pinentry
```

**Arch Linux:**
```bash
sudo pacman -S gnupg pinentry
```

**Shell Configuration:**
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export GPG_TTY=$(tty)
```

**Systemd User Service (Optional):**
To start GPG agent automatically:
```bash
systemctl --user enable gpg-agent.service
systemctl --user start gpg-agent.service
```

## Verifying Commits

### Verifying Your Own Commits

After signing a commit, verify it worked:
```bash
# View last commit with signature
git log --show-signature -1

# View specific commit
git log --show-signature COMMIT_SHA -1
```

**Expected output:**
```
gpg: Signature made Mon Jan 15 10:30:45 2024 PST
gpg:                using RSA key 3AA5C34371567BD2
gpg: Good signature from "John Doe <john.doe@example.com>" [ultimate]
```

### Verifying on GitHub

1. Navigate to the repository on GitHub
2. Click on "Commits"
3. Look for the **"Verified"** badge next to your commits:
   - ✅ **Verified**: GitHub successfully verified the GPG signature
   - ⚠️ **Unverified**: Commit is signed but GitHub cannot verify it
   - No badge: Commit is not signed

### Understanding Verification Badges

**Verified Badge:**
- The signature is valid
- The email in the signature matches a verified email in the committer's GitHub account
- The public key is registered with GitHub

**Unverified (despite being signed):**
- GPG key not added to GitHub account
- Email in GPG key doesn't match GitHub verified email
- GPG key has expired
- Signature was created with an untrusted key

### Verifying Other People's Commits

To verify commits from other contributors:

1. **Get their public key** (if available):
   ```bash
   # From a keyserver
   gpg --keyserver keys.openpgp.org --recv-keys KEY_ID
   
   # Or import from a file
   gpg --import their-public-key.asc
   ```

2. **Verify the commit**:
   ```bash
   git verify-commit COMMIT_SHA
   ```

3. **View signature details**:
   ```bash
   git log --show-signature COMMIT_SHA -1
   ```

**Note:** If you see "Can't check signature: No public key", it means:
- The commit is signed
- You don't have the signer's public key in your keyring
- The commit is still valid; you just can't verify it locally

### Batch Verification

Verify multiple commits:
```bash
# Verify all commits in current branch
git log --show-signature

# Verify commits in a range
git log --show-signature COMMIT1..COMMIT2

# Verify all commits from a specific author
git log --show-signature --author="author@example.com"
```

### Verification in Scripts

Use git's verification commands in scripts:
```bash
# Exit with error if commit is not properly signed
git verify-commit HEAD || exit 1

# Check if a commit is signed (returns 0 if signed)
git log --format="%G?" -1 HEAD | grep -q "G"
```

**Format specifiers for signature status:**
- `%G?`: Show "G" for good signature, "B" for bad, "U" for untrusted, "N" for no signature
- `%GS`: Show signer's name
- `%GK`: Show key used to sign

## CI/CD Considerations

### GitHub Actions

When setting up GPG signing in GitHub Actions:

```yaml
name: CI with GPG Signing
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Import GPG key
        uses: crazy-max/ghaction-import-gpg@v5
        with:
          gpg_private_key: ${{ secrets.GPG_PRIVATE_KEY }}
          passphrase: ${{ secrets.GPG_PASSPHRASE }}
          git_user_signingkey: true
          git_commit_gpgsign: true
```

**Security Note:** Store GPG private key and passphrase as encrypted secrets in GitHub repository settings.

### GitLab CI

```yaml
before_script:
  - apt-get update -y
  - apt-get install -y gnupg
  - echo "$GPG_PRIVATE_KEY" | gpg --import
  - git config --global user.signingkey YOUR_KEY_ID
  - git config --global commit.gpgsign true
```

**Security Note:** Store `GPG_PRIVATE_KEY` as a masked CI/CD variable in GitLab project settings (Settings → CI/CD → Variables) and enable masking to prevent exposure in logs.

### Jenkins

Use the GPG Plugin:
1. Install "GPG Plugin" from Jenkins Plugin Manager
2. Configure GPG credentials in Jenkins credentials store
3. Use in pipeline:
   ```groovy
   withCredentials([file(credentialsId: 'gpg-key', variable: 'GPG_KEY_FILE')]) {
     sh 'gpg --import $GPG_KEY_FILE'
     sh 'git config --global user.signingkey YOUR_KEY_ID'
     sh 'git config --global commit.gpgsign true'
   }
   ```

**Security Note:** Store the GPG private key as a secret file credential in Jenkins credentials store, and ensure proper access controls are configured.

### Best Practices for CI/CD

- Use separate GPG keys for CI/CD (not your personal key)
- Store private keys securely (use secret management)
- Set appropriate key expiration (1-2 years recommended)
- Use bot accounts for automated commits
- Document which key is used for automated releases

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
