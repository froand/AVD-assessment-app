# 🚀 Your Deployment - Ready to Go!

**Your Information (Pre-filled):**
- ✅ GitHub username: `froand`
- ✅ GitHub repo: `AVD-assessment-app`
- ✅ Azure Subscription ID: `f1a699ce-2e05-43bc-8c74-0ea96c15dddc`
- ⏳ GitHub PAT: **[See STEP 1 below]**

---

## STEP 1: Create GitHub Personal Access Token (2 minutes)

**This is the ONLY manual step remaining.**

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Fill in:
   - **Token name:** `azure-deployment`
   - **Expiration:** 90 days
4. **CHECK ONLY these two:**
   - ✅ `repo` 
   - ✅ `workflow`
5. Click **Generate token**
6. **COPY the token** (long string starting with `github_pat_`)
7. **Paste it below and save this file:**

```
Your GitHub PAT: _________________________________________________________
```

---

## STEP 2: Update Configuration File

Once you have your PAT from STEP 1:

1. Open file: `.azure/infrastructure/main.bicepparam`
2. You'll see:
   ```bicep
   param repositoryToken = ''
   ```
3. Replace with your PAT:
   ```bicep
   param repositoryToken = 'github_pat_YOUR_TOKEN_HERE'
   ```
4. Save the file (Ctrl+S)

---

## STEP 3: Open PowerShell Terminal

Open VS Code terminal (or PowerShell) and navigate to your project:

```powershell
cd "c:\Users\anfrogne\OneDrive - Microsoft\VSCode workspaces\AVD-assessment-app"
```

---

## STEP 4: Login to Azure

```powershell
az login
```

This will open your browser. Sign in with your Azure account.

---

## STEP 5: Create Resource Group

```powershell
az group create --name rg-avd-assessment-app --location eastus
```

Wait for it to complete (should say "created").

---

## STEP 6: Deploy Infrastructure

```powershell
az deployment group create `
  --name avd-assessment-deployment `
  --resource-group rg-avd-assessment-app `
  --template-file .azure/infrastructure/main.bicep `
  --parameters .azure/infrastructure/main.bicepparam
```

**Wait for this to complete** (2-3 minutes). You should see "Succeeded" at the end.

---

## STEP 7: Get Deployment Token

After STEP 6 succeeds, run:

```powershell
$DEPLOYMENT_TOKEN = az staticwebapp secrets list `
  --name avd-assessment-app `
  --resource-group rg-avd-assessment-app `
  --query "properties.apiKey" `
  --output tsv

Write-Host $DEPLOYMENT_TOKEN
```

**Copy the output** (it's a long token).

---

## STEP 8: Add GitHub Secret

1. Go to: https://github.com/froand/AVD-assessment-app
2. Click **Settings** (top right)
3. Left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`
6. **Value:** Paste the token from STEP 7
7. Click **Add secret**

---

## STEP 9: Push to GitHub

In your terminal, run:

```powershell
git add .
git commit -m "Deploy AVD assessment app to Azure"
git push origin main
```

---

## STEP 10: Verify Deployment

Go to your GitHub repo and click **Actions** tab. You should see your workflow running and deploying!

After ~2-3 minutes, your app will be live at:

```
https://avd-assessment-app.azurestaticapps.net
```

---

## ✅ That's It!

Your app is now live and accessible to everyone!

**Every time you push code to GitHub, it will automatically redeploy.** 🎉

---

## 🆘 Troubleshooting

**"Command not found" error?**
- Make sure Azure CLI is installed: `az --version`
- If not installed, get it from: https://aka.ms/azure-cli

**"Invalid subscription" error?**
- Verify your subscription ID is correct: `f1a699ce-2e05-43bc-8c74-0ea96c15dddc`
- Run `az account list` to see your subscriptions

**GitHub Actions not triggering?**
- Make sure you added the secret (STEP 8) correctly
- Check the GitHub **Actions** tab for errors

**App shows 404?**
- Wait 2-3 minutes after push
- Check GitHub Actions logs (Actions tab)
- Make sure `.github/workflows/deploy.yml` exists

---

## Your Commands Summary

Save these for quick reference:

```powershell
# Step 4: Login
az login

# Step 5: Create resource group
az group create --name rg-avd-assessment-app --location eastus

# Step 6: Deploy
az deployment group create `
  --name avd-assessment-deployment `
  --resource-group rg-avd-assessment-app `
  --template-file .azure/infrastructure/main.bicep `
  --parameters .azure/infrastructure/main.bicepparam

# Step 7: Get token
$DEPLOYMENT_TOKEN = az staticwebapp secrets list `
  --name avd-assessment-app `
  --resource-group rg-avd-assessment-app `
  --query "properties.apiKey" `
  --output tsv
Write-Host $DEPLOYMENT_TOKEN

# Step 9: Push to GitHub
git add .
git commit -m "Deploy AVD assessment app to Azure"
git push origin main
```

---

**Ready? Start with STEP 1 above!** 🚀
