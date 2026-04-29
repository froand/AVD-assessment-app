# AVD Assessment App — Azure Deployment Summary

## ✅ What's Been Prepared

Your app is ready to deploy to Azure Static Web Apps! All infrastructure code and deployment automation has been generated.

---

## 📁 Generated Files

### Infrastructure & Configuration
```
.azure/
├── deployment-plan.md          # Full deployment plan & status
├── README.md                   # Quick start guide
└── infrastructure/
    ├── main.bicep              # Static Web Apps Bicep template
    └── main.bicepparam         # Parameters (customize with your values)

.github/
├── DEPLOYMENT.md               # Complete step-by-step guide
└── workflows/
    └── deploy.yml              # GitHub Actions CI/CD workflow

app/
└── staticwebapp.config.json    # SPA routing configuration
```

---

## 🚀 What You Need to Do

### Step 1: Prepare Your Values
Gather these before deployment:
- ✏️ GitHub Repository URL (e.g., `https://github.com/username/AVD-assessment-app`)
- ✏️ GitHub Personal Access Token (PAT) with `repo` and `workflow` scopes
  - [Create PAT here](https://github.com/settings/tokens)
- ✏️ Azure Subscription ID (from Azure Portal → Subscriptions)
- ✏️ Azure Region (default: `eastus`)

### Step 2: Update Parameters
Edit `.azure/infrastructure/main.bicepparam`:
```bicep
param appName = 'avd-assessment-app'
param repositoryUrl = 'https://github.com/YOUR_USERNAME/AVD-assessment-app'
param branch = 'main'
param repositoryToken = 'github_pat_XXXXXXXXXX'  # Your GitHub PAT
```

### Step 3: Deploy to Azure
Run these Azure CLI commands:

```bash
# 1. Create resource group
az group create --name rg-avd-assessment-app --location eastus

# 2. Deploy infrastructure
az deployment group create \
  --name avd-assessment-deployment \
  --resource-group rg-avd-assessment-app \
  --template-file .azure/infrastructure/main.bicep \
  --parameters .azure/infrastructure/main.bicepparam

# 3. Get deployment token
az staticwebapp secrets list \
  --name avd-assessment-app \
  --resource-group rg-avd-assessment-app \
  --query "properties.apiKey" \
  --output tsv
```

### Step 4: Add GitHub Secret
1. Go to your GitHub repository
2. Settings → **Secrets and variables** → **Actions**
3. **New repository secret**
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Paste the token from Step 3
4. **Add secret**

### Step 5: Deploy!
```bash
git add .
git commit -m "Deploy AVD assessment app to Azure"
git push origin main
```

GitHub Actions will automatically:
- ✅ Install dependencies
- ✅ Build the React app
- ✅ Deploy to Azure Static Web Apps
- ✅ Make it live at: `https://avd-assessment-app.azurestaticapps.net`

---

## 📋 Deployment Options

### Automatic Deployment (Recommended)
- Trigger: Push to `main` branch
- Method: GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Status: Check in repository **Actions** tab

### Manual Deployment
```bash
az staticwebapp deploy \
  --name avd-assessment-app \
  --source-location dist \
  --artifact-location app
```

---

## 🔗 Access Your App

After deployment, your app will be available at:
```
https://avd-assessment-app.azurestaticapps.net
```

To get the exact URL:
```bash
az staticwebapp show \
  --name avd-assessment-app \
  --resource-group rg-avd-assessment-app \
  --query properties.defaultHostname \
  --output tsv
```

---

## 📚 Documentation

- **Quick Start:** [`.azure/README.md`](.azure/README.md)
- **Step-by-Step Guide:** [`.github/DEPLOYMENT.md`](.github/DEPLOYMENT.md)
- **Full Plan:** [`.azure/deployment-plan.md`](.azure/deployment-plan.md)
- **Azure Static Web Apps Docs:** https://docs.microsoft.com/azure/static-web-apps/

---

## ⚡ Cost Estimate

- **Free Tier:** $0 (1 SWA per subscription)
  - Bandwidth: 100 GB/month free
  - Builds: 100 free per month
- **After Free Tier:** ~$0.02 per build + overage bandwidth costs

---

## ✨ Features Included

- ✅ **Global CDN** — App served from edge locations worldwide
- ✅ **HTTPS** — Automatic SSL/TLS certificates
- ✅ **Auto-Deploy** — GitHub Actions CI/CD pipeline
- ✅ **Preview Environments** — Test PRs before merge
- ✅ **SPA Routing** — Client-side routing configured
- ✅ **Build Optimization** — Vite build integrated

---

## 🆘 Troubleshooting

**Deployment failed?**
- Check GitHub Actions logs: Repository → **Actions** tab
- Verify GitHub PAT has correct scopes

**App shows 404?**
- Ensure `staticwebapp.config.json` is in `app/` directory
- Check build output location is `app/dist/`

**Can't find deployment token?**
- Run: `az staticwebapp show --name avd-assessment-app --resource-group rg-avd-assessment-app`

---

## 🎯 Next Steps (Optional)

### Add Custom Domain
```bash
az staticwebapp custom-domain create \
  --name avd-assessment-app \
  --resource-group rg-avd-assessment-app \
  --domain-name yourdomain.com
```

### Enable Monitoring
```bash
az monitor app-insights component create \
  --app avd-assessment-insights \
  --location eastus \
  --resource-group rg-avd-assessment-app \
  --application-type web
```

### Add Authentication (Future)
- Integrate Azure AD B2C for user login
- Restrict access to specific users/groups

---

**Ready to deploy? Follow Steps 1-5 above and your app will be live!** 🚀
