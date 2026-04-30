# Add GitHub Secret - Complete Visual Guide

## ✅ Correct Path (Repository-Level Secret)

**DO NOT use Environment secrets. Follow this path:**

### Step-by-Step:

1. **Go to your GitHub repository:**
   ```
   https://github.com/froand/AVD-assessment-app
   ```

2. **Click SETTINGS** (top right of repo page)
   - You'll see tabs at the top: Code, Issues, Pull requests, Actions, **Settings**

3. **Left Sidebar → Find "Security" section**
   - Scroll down on the left sidebar
   - Click: **Secrets and variables**
   - Then click: **Actions**
   
   (NOT "Environments" - that's for environment-level secrets)

4. **Click "New repository secret"** button (green button on right)
   - NOT "New environment secret"
   - NOT "Add environment variable"

5. **Fill in the form:**
   ```
   Name: AZURE_STATIC_WEB_APPS_API_TOKEN
   Value: b2474751051afb32c5ed168d7d46e528b00840bebf6382946518a3c56ea22e7b07-3a69d27d-e90e-4631-b381-ed0ce9731c3600303120f81a5a03
   ```

6. **Click "Add secret"** button

---

## ❌ What NOT to Do

- ❌ Don't click "Environments" 
- ❌ Don't look for "Environment name" field
- ❌ Don't use Environment-level secrets
- ❌ Don't change the secret **Name** - keep it exactly as: `AZURE_STATIC_WEB_APPS_API_TOKEN`

---

## ✅ After Adding Secret

Once the secret is added, GitHub Actions will:
1. Automatically detect the new secret
2. Trigger your deployment workflow
3. Build and deploy your app within 2-3 minutes

Check your repo's **Actions** tab to see the deployment in progress!

---

## 📍 Direct Link (If Available)

Try going directly to your repo's secrets page:
```
https://github.com/froand/AVD-assessment-app/settings/secrets/actions
```

Then click **New repository secret** and add the token.

---

## The Secret You Need

**Copy and paste this exactly:**

**Name:** 
```
AZURE_STATIC_WEB_APPS_API_TOKEN
```

**Value:**
```
b2474751051afb32c5ed168d7d46e528b00840bebf6382946518a3c56ea22e7b07-3a69d27d-e90e-4631-b381-ed0ce9731c3600303120f81a5a03
```

---

## ✨ Then Your App Goes Live!

Once added, your app will deploy to:
```
https://gray-glacier-0f81a5a03.7.azurestaticapps.net
```
