# 🚀 AVD Assessment App - Azure Deployment Setup Wizard

**No Azure/GitHub experience needed.** Follow this step-by-step and I'll handle everything.

---

## ⏱️ Estimated Time: 10 minutes

---

## 📝 STEP 1: Collect Your Information

You need to gather **3 pieces of information**. I've marked where to find each one.

### Information 1️⃣: GitHub Username
**What it is:** Your GitHub login name

**Where to find it:**
1. Go to https://github.com/
2. Look at the top-right corner - click your profile icon
3. Click "Profile" 
4. Look at the URL: `https://github.com/YOUR_USERNAME_HERE` ← Copy this part

**Example:** If your GitHub profile URL is `https://github.com/john-doe`, then your username is `john-doe`

**Your GitHub username:** `________________________`

---

### Information 2️⃣: GitHub Repository Name
**What it is:** The name of your GitHub repository containing this code

**Where to find it:**
1. Go to your GitHub repository
2. Look at the top of the page - it shows the repo name
3. Also visible in the URL: `https://github.com/username/REPO_NAME_HERE`

**Example:** If your repo URL is `https://github.com/john-doe/AVD-assessment-app`, then your repo name is `AVD-assessment-app`

**Your GitHub repo name:** `________________________`

---

### Information 3️⃣: Azure Subscription ID
**What it is:** A unique code that identifies your Azure subscription

**Where to find it:**
1. Go to https://portal.azure.com
2. Search for "Subscriptions" (use the search bar at top)
3. Click on your subscription name
4. On the right side, you'll see "Subscription ID"
5. Click the copy icon next to it

**Example:** `12345678-1234-1234-1234-123456789012`

**Format:** It looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

**Your Azure Subscription ID:** `________________________`

---

## 🔐 STEP 2: Create GitHub Personal Access Token (PAT)

This is a security token that lets Azure deploy your app.

### How to Create It:

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Fill in:
   - **Token name:** `azure-deployment` (just a label)
   - **Expiration:** 90 days (default is fine)
4. **CHECK these boxes ONLY:**
   - ✅ `repo` (under Full control of private and public repositories)
   - ✅ `workflow` (under Actions)
5. Scroll down and click **Generate token**
6. **IMPORTANT: Copy the token immediately** (you'll see it only once!)
7. Paste it here: `________________________`

**Keep this token safe - you'll use it in the next step.**

---

## 📋 STEP 3: Fill in the Configuration File

I've prepared a file for you at: `.azure/infrastructure/main.bicepparam`

**Replace these placeholders with your information:**

```bicep
param appName = 'avd-assessment-app'
param repositoryUrl = 'https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME'
param branch = 'main'
param repositoryToken = 'YOUR_GITHUB_PAT_TOKEN'
```

### Example (filled in):
```bicep
param appName = 'avd-assessment-app'
param repositoryUrl = 'https://github.com/john-doe/AVD-assessment-app'
param branch = 'main'
param repositoryToken = 'github_pat_11XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
```

### Your Values to Use:
- `YOUR_GITHUB_USERNAME` → Replace with: `________________________`
- `YOUR_REPO_NAME` → Replace with: `________________________`
- `YOUR_GITHUB_PAT_TOKEN` → Replace with: `________________________`

---

## 🔧 STEP 4: Update the Configuration File

**Option A: I'll do it for you (if you provide values)**
Just send me the 3 pieces of information, and I'll update the file automatically.

**Option B: Do it yourself**
1. Open this file in VS Code: `.azure/infrastructure/main.bicepparam`
2. Replace the placeholders with your values
3. Save (Ctrl+S)

---

## ☁️ STEP 5: Deploy to Azure

Once the configuration file is updated, open a terminal and run:

```bash
# Step 1: Create Azure resource group
az group create --name rg-avd-assessment-app --location eastus

# Step 2: Deploy infrastructure
az deployment group create `
  --name avd-assessment-deployment `
  --resource-group rg-avd-assessment-app `
  --template-file .azure/infrastructure/main.bicep `
  --parameters .azure/infrastructure/main.bicepparam
```

**Wait for it to complete** (should take 2-3 minutes).

---

## 🔑 STEP 6: Get Deployment Token

After Step 5 completes successfully, run:

```bash
$DEPLOYMENT_TOKEN = az staticwebapp secrets list `
  --name avd-assessment-app `
  --resource-group rg-avd-assessment-app `
  --query "properties.apiKey" `
  --output tsv

Write-Host $DEPLOYMENT_TOKEN
```

**Copy the output** (long token starting with `_`)

---

## 🐙 STEP 7: Add GitHub Secret

1. Go to your GitHub repository
2. Click **Settings** (at the top)
3. Left sidebar: Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`
6. **Value:** Paste the token from Step 6
7. Click **Add secret**

---

## 🚀 STEP 8: Deploy!

```bash
git add .
git commit -m "Deploy AVD assessment app to Azure"
git push origin main
```

**That's it!** 

Your app will be deployed automatically. Check GitHub **Actions** tab to watch the deployment.

---

## ✅ STEP 9: Verify It Works

After ~2-3 minutes, your app will be live at:

```
https://avd-assessment-app.azurestaticapps.net
```

**To find your exact URL:**
```bash
az staticwebapp show `
  --name avd-assessment-app `
  --resource-group rg-avd-assessment-app `
  --query properties.defaultHostname `
  --output tsv
```

Open the URL in your browser and test the app!

---

## 🆘 Need Help?

**Check the troubleshooting guide:**
- File: `DEPLOYMENT_CHECKLIST.md` — Step-by-step checklist
- File: `AZURE_DEPLOYMENT_READY.md` — Complete overview
- File: `.github/DEPLOYMENT.md` — Detailed technical guide

---

## 📝 Quick Reference Card

Keep this handy:

| What | Where |
|------|-------|
| GitHub Username | Your GitHub profile URL |
| GitHub Repo Name | Your repository page |
| Azure Subscription ID | Azure Portal → Subscriptions |
| GitHub PAT | https://github.com/settings/tokens |
| Config File | `.azure/infrastructure/main.bicepparam` |
| Deploy Commands | STEP 5 above |
| Final URL | `https://avd-assessment-app.azurestaticapps.net` |

---

**Ready? Provide your 3 pieces of information and I'll update everything for you!** ✨
