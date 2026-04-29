# Azure Deployment Setup

## Quick Start

This folder contains everything needed to deploy the AVD Security Assessment App to Azure Static Web Apps.

### Files Overview

- **`deployment-plan.md`** — Complete deployment plan and status
- **`infrastructure/main.bicep`** — Bicep template for Static Web Apps
- **`infrastructure/main.bicepparam`** — Parameters file (customize with your values)

### 1-Minute Setup

1. **Get your values ready:**
   - GitHub repository URL (e.g., `https://github.com/username/AVD-assessment-app`)
   - GitHub Personal Access Token ([create one here](https://github.com/settings/tokens))

2. **Update parameters:**
   ```bash
   # Edit this file with your values:
   nano infrastructure/main.bicepparam
   ```

3. **Create resource group:**
   ```bash
   az group create --name rg-avd-assessment-app --location eastus
   ```

4. **Deploy:**
   ```bash
   az deployment group create \
     --name avd-assessment-deployment \
     --resource-group rg-avd-assessment-app \
     --template-file infrastructure/main.bicep \
     --parameters infrastructure/main.bicepparam
   ```

5. **Add GitHub secret:**
   - Go to your GitHub repo → Settings → Secrets → New repository secret
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Get from: `az staticwebapp secrets list --name avd-assessment-app --resource-group rg-avd-assessment-app --query "properties.apiKey" --output tsv`

6. **Push to GitHub:**
   ```bash
   git push origin main
   ```

That's it! Your app will be live at `https://avd-assessment-app.azurestaticapps.net`

---

### Full Guide

See [`.github/DEPLOYMENT.md`](../.github/DEPLOYMENT.md) for complete step-by-step instructions.

### Questions?

- Check [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- Review GitHub Actions logs in your repository's **Actions** tab
