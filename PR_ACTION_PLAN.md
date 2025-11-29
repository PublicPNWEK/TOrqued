# Pull Request Action Plan

This document provides a step-by-step plan for resolving all open pull requests in the TOrqued repository.

## Current Status

- **Total Open PRs**: 8 (including this one, PR #9)
- **PRs Ready to Merge**: 4-5 (after fixes)
- **PRs Needing Work**: 1 critical (PR #4)
- **PRs Completed**: 1 (PR #8, completed in PR #9)
- **Meta PRs**: 2 (PR #9 and #10)

## Step-by-Step Action Plan

### Phase 1: Critical Fixes (Do First)

#### Step 1: Fix PR #4 - Remove node_modules 🚨

**Problem**: PR #4 accidentally committed the entire node_modules directory (2.7M additions, 13,800 files).

**Solution**:
```bash
# Switch to the problematic branch
git fetch origin
git checkout copilot/add-license-and-fix-shopify-deploy

# Remove node_modules from git tracking (but keep locally)
git rm -r --cached node_modules/

# Commit the fix
git commit -m "Remove node_modules from version control"

# Force push (safe because it's a feature branch)
git push --force-with-lease origin copilot/add-license-and-fix-shopify-deploy
```

**Expected Result**: PR #4 should show only the legitimate changes (~100 files instead of 13,800).

**Verification**:
- Check PR #4 on GitHub - should show ~100 files changed
- .gitignore should be present
- node_modules should not be tracked

---

#### Step 2: Close PR #8

**Reason**: The work for PR #8 (GPG documentation) has been completed in PR #9.

**Action**:
1. Go to PR #8 on GitHub
2. Add a comment: "Work completed in PR #9. Closing as duplicate."
3. Close the pull request

---

### Phase 2: Choose Branch Sync Strategy

You have two PRs that both address branch synchronization:

#### Option A: Use PR #7 (GitHub Actions - Recommended)
- **Pros**: 
  - Automated - runs on every push to master
  - No manual intervention needed
  - Creates issues if conflicts occur
- **Cons**: 
  - Uses GitHub Actions minutes
  - Automated syncs might create unexpected updates

**If choosing PR #7**:
1. Review `.github/workflows/sync-branches.yml`
2. Test the workflow on a non-critical branch first
3. Merge PR #7
4. Close PR #6 with comment "Using automated workflow from PR #7 instead"

#### Option B: Use PR #6 (Manual Script)
- **Pros**: 
  - Manual control over when syncs occur
  - No GitHub Actions usage
  - More predictable
- **Cons**: 
  - Requires manual execution
  - Easy to forget to run

**If choosing PR #6**:
1. Review `scripts/sync-branches.sh`
2. Test the script locally
3. Merge PR #6
4. Close PR #7 with comment "Using manual script from PR #6 instead"

#### Option C: Keep Both
- Merge both for maximum flexibility
- Use GitHub Actions for automated syncs
- Keep script available for manual syncs when needed

**Recommendation**: Choose Option C (keep both) for maximum flexibility.

---

### Phase 3: Merge Documentation and Features

These PRs are ready to merge after Phase 1 and 2 are complete:

#### Step 3: Merge PR #2 (README Restructure)
**Order**: Merge this first as it makes major README changes.

**Before merging**:
1. Review the README changes
2. Ensure the new structure is acceptable
3. Verify deployment instructions are clear

**Action**:
```bash
git checkout master
git pull origin master
git merge --no-ff copilot/optimize-readme-for-beginners
git push origin master
```

**After merging**:
- Close PR #2 on GitHub
- Delete the branch: `git push origin --delete copilot/optimize-readme-for-beginners`

---

#### Step 4: Merge PR #3 (Shopify Theme Structure)
**Order**: Merge this second.

**Before merging**:
1. Review the Shopify theme files
2. Test theme import if possible
3. Run the validation script: `node scripts/validate-theme.mjs`

**Action**:
```bash
git checkout master
git pull origin master
git merge --no-ff copilot/fix-theme-import-compatibility
git push origin master
```

**Potential Conflict**: If README conflicts with PR #2, resolve in favor of PR #2's structure while keeping PR #3's content.

**After merging**:
- Close PR #3 on GitHub
- Delete the branch

---

#### Step 5: Merge PR #4 (LICENSE and Shopify Fix)
**Order**: Merge this third, after node_modules fix from Phase 1.

**Before merging**:
1. Verify node_modules was removed successfully
2. Review vite.config.ts changes
3. Test Shopify deployment if possible:
   ```bash
   npm run build
   # Verify single bundle is created
   ```

**Action**:
```bash
git checkout master
git pull origin master
git merge --no-ff copilot/add-license-and-fix-shopify-deploy
git push origin master
```

**Potential Conflicts**: README conflicts with PR #2 and #3. Resolve by:
1. Keep README structure from PR #2
2. Add Shopify import content from PR #3  
3. Add LICENSE section and BUILD_TARGET docs from PR #4

**After merging**:
- Close PR #4 on GitHub
- Delete the branch
- Verify LICENSE file is present
- Verify BUILD_TARGET functionality: `BUILD_TARGET=shopify npm run build`

---

#### Step 6: Merge Branch Sync Solution (PR #7 and/or #6)
**Order**: Merge after all documentation PRs.

**If merging PR #7** (GitHub Actions):
```bash
git checkout master
git pull origin master
git merge --no-ff copilot/sync-branches-with-master
git push origin master
```

**If merging PR #6** (Script):
```bash
git checkout master  
git pull origin master
git merge --no-ff copilot/sync-all-branches
git push origin master
```

**Testing**:
- For PR #7: Wait for next push to master and verify workflow runs
- For PR #6: Run `./scripts/sync-branches.sh` and verify it works

**After merging**:
- Close the merged PR(s)
- Delete the branch(es)

---

### Phase 4: Cleanup

#### Step 7: Close PR #9 (This PR)
**When**: After all other PRs are handled.

**Action**:
1. Review that all tasks are complete
2. Merge PR #9 to bring in CONTRIBUTING.md and PR summary docs:
   ```bash
   git checkout master
   git pull origin master
   git merge --no-ff copilot/work-through-open-pulls
   git push origin master
   ```
3. Close PR #9
4. Delete branch: `git push origin --delete copilot/work-through-open-pulls`

---

#### Step 8: Close PR #10
**Reason**: PR #10 was a duplicate/meta PR for completing pull requests.

**Action**:
1. Add comment: "Pull requests have been worked through in PR #9. Closing as complete."
2. Close PR #10
3. Delete branch: `git push origin --delete copilot/complete-pull-requests`

---

## Post-Merge Verification Checklist

After completing all phases:

- [ ] No open PRs remain (except legitimate new ones)
- [ ] `node_modules/` is not tracked in git
- [ ] LICENSE file exists
- [ ] CONTRIBUTING.md exists with GPG documentation
- [ ] README.md has Contributing section
- [ ] Shopify theme structure is present
- [ ] Shopify deployment works (test with `npm run shopify:deploy`)
- [ ] Branch sync solution is in place (workflow or script)
- [ ] All PR branches are deleted from remote

---

## Timeline Estimate

- **Phase 1** (Critical Fixes): 15-30 minutes
- **Phase 2** (Branch Sync Decision): 15-30 minutes
- **Phase 3** (Merge PRs): 1-2 hours (including testing and conflict resolution)
- **Phase 4** (Cleanup): 15-30 minutes

**Total Time**: 2-4 hours (depending on testing thoroughness)

---

## Rollback Plan

If something goes wrong during merging:

### For Specific PR Issues
```bash
# If a merge causes problems
git revert <commit-hash>
git push origin master
```

### For Complete Rollback
```bash
# Reset master to before the merges
git checkout master
git reset --hard <commit-before-merges>
git push --force-with-lease origin master
```

**Note**: Always create a backup branch before starting:
```bash
git checkout master
git checkout -b backup-before-pr-merge
git push origin backup-before-pr-merge
```

---

## Questions or Issues?

If you encounter problems during this process:

1. **Merge Conflicts**: Document the conflict and decide whether to favor PR #2's README structure
2. **Test Failures**: Document the failure and determine if it's a pre-existing issue
3. **Missing Information**: Refer to individual PR descriptions for context

---

## Success Criteria

When complete, the repository should have:
- ✅ Clean git history (no node_modules)
- ✅ Comprehensive documentation (CONTRIBUTING.md)
- ✅ MIT License file
- ✅ Shopify theme structure for direct import
- ✅ Fixed Shopify deployment with single bundle
- ✅ Branch synchronization system (automated or manual)
- ✅ Beginner-friendly README
- ✅ All PR branches cleaned up

Good luck! 🚀
