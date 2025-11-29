#!/usr/bin/env bash

# Script to sync all feature branches with master
# This ensures all branches have the latest changes from master

set -e

echo "🔄 Syncing all branches with master..."

# Detect the default branch (master or main)
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "master")
echo "📌 Default branch detected: $DEFAULT_BRANCH"

# Get list of all remote branches (excluding the default branch)
echo "📋 Discovering branches..."
BRANCHES=($(git branch -r --format='%(refname:short)' | grep -v "^origin/$DEFAULT_BRANCH$" | grep -v 'origin/HEAD' | sed 's|^origin/||'))

echo "  Found ${#BRANCHES[@]} branch(es) to sync"

# Fetch latest changes from origin
echo "📥 Fetching latest changes from origin..."
git fetch origin "$DEFAULT_BRANCH"

# Current branch (save for later)
CURRENT_BRANCH=$(git branch --show-current)

# Sync each branch
for BRANCH in "${BRANCHES[@]}"; do
  echo ""
  echo "🔀 Syncing branch: $BRANCH"
  
  # Fetch the remote branch
  echo "  📥 Fetching branch from origin..."
  git fetch origin "$BRANCH" || {
    echo "  ❌ Failed to fetch branch from origin"
    continue
  }
  
  # Check if branch exists locally
  if git show-ref --verify --quiet refs/heads/"$BRANCH"; then
    echo "  ✓ Branch exists locally"
  else
    echo "  ⚠ Branch doesn't exist locally, checking out from origin..."
    git checkout -b "$BRANCH" "origin/$BRANCH" || {
      echo "  ❌ Failed to checkout branch"
      continue
    }
  fi
  
  # Switch to branch
  git checkout "$BRANCH" || {
    echo "  ❌ Failed to checkout branch"
    continue
  }
  
  # Merge default branch
  echo "  🔀 Merging $DEFAULT_BRANCH into $BRANCH..."
  if git merge "origin/$DEFAULT_BRANCH" --no-edit; then
    echo "  ✅ Successfully merged $DEFAULT_BRANCH"
    
    # Push changes
    echo "  📤 Pushing changes to origin..."
    git push origin "$BRANCH" || echo "  ⚠ Failed to push changes (may need manual intervention)"
  else
    echo "  ⚠ Merge conflict detected. Please resolve manually."
    git merge --abort
  fi
done

# Return to original branch (with fallback)
echo ""
if [ -n "$CURRENT_BRANCH" ] && git show-ref --verify --quiet refs/heads/"$CURRENT_BRANCH"; then
  echo "🔙 Returning to original branch: $CURRENT_BRANCH"
  git checkout "$CURRENT_BRANCH"
else
  echo "🔙 Returning to default branch: $DEFAULT_BRANCH"
  git checkout "$DEFAULT_BRANCH"
fi

echo ""
echo "✨ Branch sync complete!"
