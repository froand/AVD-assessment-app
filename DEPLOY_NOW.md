# 🎯 READY TO DEPLOY - froand

## ✅ Configuration Complete

**Your settings are now fully configured:**

```
App Name:              avd-assessment-app
GitHub Repo:           https://github.com/froand/AVD-assessment-app
Azure Subscription:    f1a699ce-2e05-43bc-8c74-0ea96c15dddc
GitHub Token:          ✅ SET (ghp_LMNvfuBBrCmdCrAMRLW8j...)
```

**File:** `.azure/infrastructure/main.bicepparam` ✅ **READY**

---

## 🚀 NOW FOLLOW THESE STEPS

### STEP 1: Open PowerShell Terminal

In VS Code, press: `Ctrl + `` (backtick) to open terminal

Navigate to your project:
```powershell
cd "c:\Users\anfrogne\OneDrive - Microsoft\VSCode workspaces\AVD-assessment-app"
```

---

### STEP 2: Login to Azure

```powershell
az login
```

**A browser will open.** Sign in with your Azure account.

---

### STEP 3: Create Resource Group

Copy and paste this command:

```powershell
az group create --name rg-avd-assessment-app --location eastus
```

**Wait for it to complete** (you should see: `"provisioningState": "Succeeded"`)

---

### STEP 4: Deploy Infrastructure

Copy and paste this entire command:

```powershell
az deployment group create `
  --name avd-assessment-deployment `
  --resource-group rg-avd-assessment-app `
  --template-file .azure/infrastructure/main.bicep `
  --parameters .azure/infrastructure/main.bicepparam
```

**Wait for it to complete** (2-3 minutes). You should see: `"provisioningState": "Succeeded"`

---

### STEP 5: Get Deployment Token

Copy and paste this command:

```powershell
$DEPLOYMENT_TOKEN = az staticwebapp secrets list `
  --name avd-assessment-app `
  --resource-group rg-avd-assessment-app `
  --query "properties.apiKey" `
  --output tsv

Write-Host $DEPLOYMENT_TOKEN
```

**A long token will appear. SELECT and COPY it.** (It starts with `_` or alphanumeric)

---

### STEP 6: Add GitHub Secret

1. Go to: https://github.com/froand/AVD-assessment-app
2. Click **Settings** (top right)
3. Left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`
6. **Value:** Paste the token from STEP 5
7. Click **Add secret**

✅ **Secret added!**

---

### STEP 7: Push Code to GitHub

In PowerShell, run:

```powershell
git add .
git commit -m "Deploy AVD assessment app to Azure"
git push origin main
```

**Your code is now pushed!**

---

### STEP 8: Check Deployment

Go to your GitHub repo and click the **Actions** tab.

You should see a workflow running (it will say "Deploy to Azure Static Web Apps").

**Wait 2-3 minutes for it to complete.** You should see a green checkmark ✅

---

### STEP 9: Access Your App

Your app is now live at:

```
https://avd-assessment-app.azurestaticapps.net
```

**Open this URL in your browser and test it!**

To find your exact URL anytime, run:

```powershell
az staticwebapp show `
  --name avd-assessment-app `
  --resource-group rg-avd-assessment-app `
  --query properties.defaultHostname `
  --output tsv
```

---

## ✨ That's It!

**Your app is now deployed and accessible to everyone!**

Every time you push code to GitHub (STEP 7), it will automatically rebuild and redeploy. 🎉

---

## 🆘 If Something Goes Wrong

**Error in STEP 3-4?**
- Run: `az account list` to verify your subscription
- Make sure Azure CLI is installed: `az --version`

**Error in STEP 5?**
- Wait 2-3 minutes and try again (resource may still be initializing)
- Check that Static Web Apps resource was created: `az staticwebapp list --resource-group rg-avd-assessment-app`

**GitHub Actions not triggering?**
- Go to your repo → Actions tab and check for errors
- Make sure you added the secret correctly (STEP 6)

**App shows 404?**
- Wait 5 minutes for deployment to complete
- Check Actions tab for build/deploy errors
- Verify `.github/workflows/deploy.yml` exists

---

## 📋 Quick Command Reference

Keep these handy:

```powershell
# Check status
az staticwebapp show --name avd-assessment-app --resource-group rg-avd-assessment-app

# View deployments
az staticwebapp deployments list --name avd-assessment-app --resource-group rg-avd-assessment-app

# Get app URL
az staticwebapp show --name avd-assessment-app --resource-group rg-avd-assessment-app --query properties.defaultHostname --output tsv
```

---

**Ready? Start with STEP 1 above!** 🚀

All your configuration is done. These 9 steps will get your app live!
