# AVD Security Assessment App — Azure Deployment Guide

## Overview

This guide walks you through deploying the AVD Security Assessment App to Azure Static Web Apps.

**What you'll get:**
- ✅ Public URL: `https://avd-assessment-app.azurestaticapps.net`
- ✅ Automatic deployments on GitHub pushes
- ✅ Free tier hosting (1 SWA per subscription)
- ✅ Global CDN distribution
- ✅ HTTPS enabled by default

---

## Prerequisites

- **Azure Subscription** with at least one free Static Web Apps slot available
- **GitHub Repository** with the AVD assessment app code
- **Azure CLI** installed and authenticated locally (`az login`)
- **GitHub Personal Access Token (PAT)** with `repo` and `workflow` scopes

### Generate GitHub Personal Access Token (PAT)

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Name: `azure-swa-deployment`
4. Scopes: Check `repo` and `workflow`
5. Click **Generate token** and **copy it** (you won't see it again)

---

## Deployment Steps

### Step 1: Prepare Azure Context

Gather these values:
- **Azure Tenant ID** — Microsoft Entra ID → Overview → Tenant ID
- **Azure Subscription ID** — Subscriptions → Select subscription → Subscription ID
- **Resource Group Name** — `rg-avd-assessment-app` (we'll create this)
- **GitHub Repository URL** — `https://github.com/username/AVD-assessment-app`
- **GitHub PAT** — Generated in prerequisites above

### Step 2: Create Resource Group

```bash
az group create \
  --name rg-avd-assessment-app \
  --location eastus
```

### Step 3: Update Bicep Parameters

Edit `.azure/infrastructure/main.bicepparam`:

```bicep
param appName = 'avd-assessment-app'
param repositoryUrl = 'https://github.com/YOUR_USERNAME/AVD-assessment-app'
param branch = 'main'
param repositoryToken = 'github_pat_XXXXXXXXXX' # Your GitHub PAT
```

### Step 4: Deploy Infrastructure

```bash
# Deploy using Bicep
az deployment group create \
  --name avd-assessment-deployment \
  --resource-group rg-avd-assessment-app \
  --template-file .azure/infrastructure/main.bicep \
  --parameters .azure/infrastructure/main.bicepparam
```

### Step 5: Retrieve Deployment ID

After successful deployment, Static Web Apps will generate a deployment token. Retrieve it:

```bash
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name avd-assessment-app \
  --resource-group rg-avd-assessment-app \
  --query "properties.apiKey" \
  --output tsv)

echo $DEPLOYMENT_TOKEN
```

### Step 6: Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Value: Paste the deployment token from Step 5
6. Click **Add secret**

### Step 7: Deploy!

Push to your `main` branch to trigger the GitHub Actions workflow:

```bash
git add .
git commit -m "Deploy AVD assessment app to Azure"
git push origin main
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- ✅ Install dependencies
- ✅ Build the React app
- ✅ Deploy to Azure Static Web Apps
- ✅ Make it available at `https://avd-assessment-app.azurestaticapps.net`

---

## Verification

### Check Deployment Status

```bash
# View Static Web App details
az staticwebapp show \
  --name avd-assessment-app \
  --resource-group rg-avd-assessment-app

# View recent deployments
az staticwebapp deployments list \
  --name avd-assessment-app \
  --resource-group rg-avd-assessment-app
```

### Test the App

Open your browser to the URL provided in the deployment output, or:

```bash
# Get the default hostname
az staticwebapp show \
  --name avd-assessment-app \
  --resource-group rg-avd-assessment-app \
  --query properties.defaultHostname \
  --output tsv
```

---

## Next Steps

### Option A: Custom Domain
```bash
az staticwebapp custom-domain create \
  --name avd-assessment-app \
  --resource-group rg-avd-assessment-app \
  --domain-name yourdomain.com
```

### Option B: Enable Monitoring
Add Application Insights to monitor performance:

```bash
az monitor app-insights component create \
  --app avd-assessment-app-insights \
  --location eastus \
  --resource-group rg-avd-assessment-app \
  --application-type web
```

### Option C: Add Authentication
Integrate Azure AD B2C if you want user authentication (future enhancement).

---

## Troubleshooting

### Deployment Failed
- Check GitHub Actions logs: Repository → **Actions** tab
- Verify GitHub PAT has `repo` and `workflow` scopes
- Ensure `app/dist/` directory exists after build

### App Shows 404 Error
- Verify `staticwebapp.config.json` exists in `app/` directory
- Ensure build output is `app/dist/`
- Check GitHub Actions workflow logs for build errors

### GitHub Actions Not Triggered
- Ensure you pushed to `main` branch (workflow only triggers on `main`)
- Check repository has the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret

---

## Commands Reference

```bash
# List all Static Web Apps
az staticwebapp list --resource-group rg-avd-assessment-app

# Get app details
az staticwebapp show --name avd-assessment-app --resource-group rg-avd-assessment-app

# View build history
az staticwebapp deployments list --name avd-assessment-app --resource-group rg-avd-assessment-app

# Delete app (if needed)
az staticwebapp delete --name avd-assessment-app --resource-group rg-avd-assessment-app
```

---

## Support

For issues:
1. Check [Azure Static Web Apps documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
2. Review GitHub Actions logs for build/deploy errors
3. Verify all prerequisites are met
