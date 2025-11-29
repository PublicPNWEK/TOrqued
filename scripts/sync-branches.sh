#!/usr/bin/env bash

# Script to sync all feature branches with the default branch
# This ensures all branches have the latest changes from the default branch

set -e

echo "🔄 Syncing all branches with default branch..."

# Detect the default branch more reliably
echo "🔍 Detecting default branch..."
DEFAULT_BRANCH=""

# Try method 1: symbolic-ref (works if local HEAD is set)
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "")

# Try method 2: ls-remote (more reliable for remote repos)
if [ -z "$DEFAULT_BRANCH" ]; then
  DEFAULT_BRANCH=$(git ls-remote --symref origin HEAD 2>/dev/null | grep '^ref:' | awk '{print $2}' | sed 's@refs/heads/@@' || echo "")
fi

# Try method 3: check for main, then master
if [ -z "$DEFAULT_BRANCH" ]; then
  if git ls-remote --heads origin main 2>/dev/null | grep -q 'refs/heads/main'; then
    DEFAULT_BRANCH="main"
  elif git ls-remote --heads origin master 2>/dev/null | grep -q 'refs/heads/master'; then
    DEFAULT_BRANCH="master"
  else
    echo "❌ Error: Could not detect default branch"
    exit 1
  fi
fi

echo "📌 Default branch detected: $DEFAULT_BRANCH"

# Fetch all remote refs
echo "📥 Fetching all branches from origin..."
git fetch origin || {
  echo "❌ Failed to fetch from origin"
  exit 1
}

# Get list of all remote branches (excluding the default branch)
echo "📋 Discovering feature branches..."
BRANCH_LIST=$(git branch -r --format='%(refname:short)' | grep -v "^origin/$DEFAULT_BRANCH$" | grep -v 'origin/HEAD' | sed 's|^origin/||' || echo "")

if [ -z "$BRANCH_LIST" ]; then
  echo "⚠ No feature branches found to sync"
  exit 0
fi

# Convert to array
IFS=$'\n' read -d '' -r -a BRANCHES <<< "$BRANCH_LIST" || true

echo "  Found ${#BRANCHES[@]} feature branch(es) to sync"

# Current branch or HEAD state (save for later)
CURRENT_BRANCH=$(git branch --show-current || echo "")
CURRENT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "")

if [ -z "$CURRENT_BRANCH" ]; then
  echo "⚠ Currently in detached HEAD state at commit ${CURRENT_COMMIT:0:7}"
fi

# Sync each branch
for BRANCH in "${BRANCHES[@]}"; do
  echo ""
  echo "🔀 Syncing branch: $BRANCH"
  
  # Check if branch exists locally
  if git show-ref --verify --quiet refs/heads/"$BRANCH"; then
    echo "  ✓ Branch exists locally"
    git checkout "$BRANCH" || {
      echo "  ❌ Failed to checkout branch"
      continue
    }
  else
    echo "  📥 Checking out branch from origin..."
    git checkout -b "$BRANCH" "origin/$BRANCH" || {
      echo "  ❌ Failed to checkout branch from origin"
      continue
    }
  fi
  
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

# Return to original state
echo ""
if [ -n "$CURRENT_BRANCH" ] && git show-ref --verify --quiet refs/heads/"$CURRENT_BRANCH"; then
  echo "🔙 Returning to original branch: $CURRENT_BRANCH"
  git checkout "$CURRENT_BRANCH"
elif [ -n "$CURRENT_COMMIT" ]; then
  echo "🔙 Returning to previous HEAD state: ${CURRENT_COMMIT:0:7}"
  git checkout "$CURRENT_COMMIT" --detach 2>/dev/null || git checkout "$DEFAULT_BRANCH"
else
  echo "🔙 Checking out default branch: $DEFAULT_BRANCH"
  git checkout "$DEFAULT_BRANCH"
fi

echo ""
echo "✨ Branch sync complete!"
