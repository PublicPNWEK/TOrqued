# Branch Synchronization Guide

## Overview

This guide explains how to keep all feature branches synchronized with the default branch (`master` or `main`) in the TOrqued repository.

## Quick Sync

### Automated Method

Use the provided sync script to automatically sync all branches:

```bash
./scripts/sync-branches.sh
```

This script will:
1. Automatically detect the default branch (`master` or `main`)
2. Discover all feature branches in the repository
3. Fetch the latest changes from the default branch
4. Checkout each feature branch
5. Merge the default branch into each feature branch
6. Push the changes back to origin
7. Handle merge conflicts gracefully

### Manual Method

To sync a single branch manually:

```bash
# 1. Fetch latest changes (replace 'master' with 'main' if that's your default branch)
git fetch origin master

# 2. Checkout your branch
git checkout your-branch-name

# 3. Merge the default branch
git merge origin/master

# 4. Resolve any conflicts (if needed)
# Edit conflicting files, then:
git add .
git commit

# 5. Push changes
git push origin your-branch-name
```

## Verifying Sync Status

To check if your branch is up-to-date with the default branch:

```bash
# Compare your branch with the default branch (e.g., master)
git fetch origin master
git log --oneline HEAD..origin/master

# If no commits are shown, you're up-to-date!
```

## Handling Merge Conflicts

If you encounter merge conflicts during sync:

1. **Identify conflicting files:**
   ```bash
   git status
   ```

2. **Edit each conflicting file** - Look for conflict markers:
   ```
   <<<<<<< HEAD
   your changes
   =======
   master's changes
   >>>>>>> origin/master
   ```

3. **Choose which changes to keep** or merge them manually

4. **Mark as resolved:**
   ```bash
   git add <resolved-file>
   ```

5. **Complete the merge:**
   ```bash
   git commit
   git push origin your-branch-name
   ```

## Best Practices

1. **Sync regularly** - Sync your branch with the default branch frequently to avoid large merge conflicts

2. **Test after syncing** - Always run tests after syncing:
   ```bash
   npm ci
   npm run lint
   npm run build
   npm run test
   ```

3. **Commit before syncing** - Always commit your work before syncing to avoid losing changes

4. **Sync before creating PRs** - Ensure your branch is up-to-date with the default branch before opening a pull request

## Troubleshooting

### "Authentication failed" error

If you see authentication errors, make sure you have:
- Set up SSH keys or Personal Access Token
- Proper repository permissions

### "Your branch has diverged" message

If branches have diverged significantly:

```bash
# Option 1: Rebase (cleaner history)
git rebase origin/master  # or origin/main

# Option 2: Merge (preserves all history)
git merge origin/master  # or origin/main
```

### Aborting a merge

If things go wrong during a merge:

```bash
git merge --abort
```

## Questions?

For more help, consult the [GitHub documentation on merging](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line).
