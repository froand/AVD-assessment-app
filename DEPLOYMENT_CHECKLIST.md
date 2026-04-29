✅ AVD Assessment App — Azure Deployment Checklist

## Pre-Deployment Checklist

### 1. Prepare Azure Environment
- [ ] Have Azure Subscription ID ready
- [ ] Have Azure Tenant ID ready (optional)
- [ ] Azure CLI installed: `az --version`
- [ ] Logged into Azure: `az login`
- [ ] Set correct subscription: `az account set --subscription YOUR_SUBSCRIPTION_ID`

### 2. Prepare GitHub
- [ ] GitHub repository created and code pushed
- [ ] Have repository URL (e.g., https://github.com/username/AVD-assessment-app)
- [ ] Personal Access Token created: https://github.com/settings/tokens
  - [ ] Token has `repo` scope
  - [ ] Token has `workflow` scope
  - [ ] Token copied (you won't see it again!)

### 3. Update Configuration
- [ ] Edit `.azure/infrastructure/main.bicepparam`
- [ ] Set `repositoryUrl` to your GitHub repo
- [ ] Set `repositoryToken` to your GitHub PAT
- [ ] Set `appName` (default: `avd-assessment-app`)
- [ ] Set `branch` (default: `main`)

### 4. Deploy Infrastructure
```bash
# Create resource group
az group create \
  --name rg-avd-assessment-app \
  --location eastus

# Deploy infrastructure
az deployment group create \
  --name avd-assessment-deployment \
  --resource-group rg-avd-assessment-app \
  --template-file .azure/infrastructure/main.bicep \
  --parameters .azure/infrastructure/main.bicepparam
```

- [ ] Deployment completed successfully
- [ ] No errors in output

### 5. Retrieve Deployment Token
```bash
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name avd-assessment-app \
  --resource-group rg-avd-assessment-app \
  --query "properties.apiKey" \
  --output tsv)

echo $DEPLOYMENT_TOKEN
```

- [ ] Token retrieved successfully
- [ ] Token copied

### 6. Add GitHub Secret
- [ ] Go to GitHub repository
- [ ] Navigate to Settings → Secrets and variables → Actions
- [ ] Click "New repository secret"
- [ ] Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- [ ] Value: Paste the deployment token
- [ ] Click "Add secret"

### 7. Trigger Deployment
```bash
git add .
git commit -m "Deploy AVD assessment app to Azure"
git push origin main
```

- [ ] Pushed to main branch
- [ ] GitHub Actions workflow triggered
- [ ] Check Actions tab for build status

### 8. Verify Deployment
```bash
# Get app URL
az staticwebapp show \
  --name avd-assessment-app \
  --resource-group rg-avd-assessment-app \
  --query properties.defaultHostname \
  --output tsv
```

- [ ] App URL retrieved
- [ ] App is accessible in browser
- [ ] Assessment tool loads successfully
- [ ] Links and functionality work

## Post-Deployment (Optional)

### Custom Domain
- [ ] Register domain
- [ ] Add custom domain in Azure portal
- [ ] Update DNS records

### Monitoring
- [ ] Enable Application Insights
- [ ] Set up alerts
- [ ] Monitor usage

### Security
- [ ] Review CORS settings
- [ ] Set custom headers if needed
- [ ] Enable Azure AD B2C for authentication (future)

## Documentation Files

Quick Reference:
- 📄 `AZURE_DEPLOYMENT_READY.md` — Overview & summary
- 📄 `.azure/README.md` — Quick start
- 📄 `.azure/deployment-plan.md` — Full deployment plan
- 📄 `.github/DEPLOYMENT.md` — Step-by-step guide

## Troubleshooting

**Problem: Deployment failed**
→ Check Azure CLI output for error message
→ Verify subscription ID is correct
→ Check resource group name is available

**Problem: GitHub Actions not triggered**
→ Verify you pushed to `main` branch
→ Check repository doesn't have branch protection
→ Review Actions tab for workflow status

**Problem: App shows 404**
→ Verify `staticwebapp.config.json` is in `app/` directory
→ Check build output is `app/dist/`
→ Review GitHub Actions logs for build errors

**Problem: Can't find deployment token**
→ Run: `az staticwebapp show --name avd-assessment-app --resource-group rg-avd-assessment-app`
→ Verify Static Web App resource was created

## Help & Resources

- Azure Static Web Apps: https://docs.microsoft.com/azure/static-web-apps/
- GitHub Actions: https://docs.github.com/en/actions
- Azure CLI Reference: https://docs.microsoft.com/cli/azure/
- Bicep Language: https://docs.microsoft.com/azure/azure-resource-manager/bicep/

---

**Status: Ready to Deploy** ✅
All files generated. Follow checklist above to deploy your app!
