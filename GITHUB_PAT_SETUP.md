# GitHub Personal Access Token (PAT) Setup

## Quick Setup (2 minutes)

### Step 1: Create PAT
1. Visit: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Fill in:
   - **Token name:** `azure-swa-deployment`
   - **Expiration:** 90 days (or your preference)

### Step 2: Select Scopes
Check these boxes:
- ✅ **repo** (Full control of private and public repositories)
- ✅ **workflow** (Update GitHub Actions workflows)

### Step 3: Generate & Copy
1. Click **Generate token**
2. **COPY the token immediately** (you won't see it again!)
3. Save it somewhere safe temporarily

### Step 4: Use in Deployment
Add to `.azure/infrastructure/main.bicepparam`:
```bicep
param repositoryToken = 'github_pat_XXXXXXXXXXXX'
```

---

## What These Scopes Do

| Scope | Allows |
|-------|--------|
| `repo` | Read your repository code, trigger builds, access workflows |
| `workflow` | Manage GitHub Actions workflows (CI/CD pipeline) |

---

## Security Notes

- ✅ Never commit the PAT to your repository
- ✅ PAT is only used during deployment to connect Azure with GitHub
- ✅ You can revoke/regenerate the token anytime from GitHub Settings
- ✅ Consider setting expiration (90 days is recommended)

---

## Verify it Works

After deployment, you can test the connection:
```bash
# Your GitHub Actions should auto-trigger on push to main
git push origin main

# Check status in GitHub → Actions tab
```

---

## Troubleshooting

**"Invalid token" error?**
- Verify token has `repo` AND `workflow` scopes
- Token may have expired (check GitHub Settings)
- Regenerate a new token if unsure

**"Repository not found" error?**
- Verify repository URL is correct in `main.bicepparam`
- Check token has `repo` scope
- Ensure repository is public or token user has access

**Workflow not triggering?**
- Check GitHub Actions logs (Actions tab)
- Verify `deploy.yml` is in `.github/workflows/`
- Ensure you pushed to `main` branch
