#!/usr/bin/env bash

# Script to sync all feature branches with master
# This ensures all branches have the latest changes from master

set -e

echo "🔄 Syncing all branches with master..."

# List of branches to sync (excluding master)
BRANCHES=(
  "copilot/sync-all-branches"
  "copilot/sync-branches-with-master"
  "copilot/add-license-and-fix-shopify-deploy"
  "copilot/fix-theme-import-compatibility"
  "copilot/optimize-readme-for-beginners"
)

# Fetch latest changes from origin
echo "📥 Fetching latest changes from origin..."
git fetch origin master

# Current branch
CURRENT_BRANCH=$(git branch --show-current)

# Sync each branch
for BRANCH in "${BRANCHES[@]}"; do
  echo ""
  echo "🔀 Syncing branch: $BRANCH"
  
  # Check if branch exists
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
  git checkout "$BRANCH"
  
  # Merge master
  echo "  🔀 Merging master into $BRANCH..."
  if git merge origin/master --no-edit; then
    echo "  ✅ Successfully merged master"
    
    # Push changes
    echo "  📤 Pushing changes to origin..."
    git push origin "$BRANCH"
  else
    echo "  ⚠ Merge conflict detected. Please resolve manually."
    git merge --abort
  fi
done

# Return to original branch
echo ""
echo "🔙 Returning to original branch: $CURRENT_BRANCH"
git checkout "$CURRENT_BRANCH"

echo ""
echo "✨ Branch sync complete!"
