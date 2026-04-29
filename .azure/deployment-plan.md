# AVD Security Assessment App — Azure Deployment Plan

**Status:** Planning Phase  
**Mode:** MODIFY (existing React SPA)  
**Deployment Target:** Azure Static Web Apps  
**Region:** eastus  
**Resource Group:** rg-avd-assessment-app  
**App Name:** avd-assessment-app  

---

## Azure Context (USER TO PROVIDE)

- **Tenant ID:** `[USER TO PROVIDE]`  
- **Subscription ID:** `[USER TO PROVIDE]`  
- **GitHub Repository URL:** `[USER TO PROVIDE]` (e.g., `https://github.com/username/AVD-assessment-app`)  
- **GitHub Personal Access Token (PAT):** Required for Static Web Apps CI/CD  

---

## Phase 1: Planning

### Step 1: Analyze Workspace
- **Mode Determined:** MODIFY existing application  
- **Type:** React + TypeScript SPA  
- **Current Build:** `npm run build` produces static artifacts  
- **Current Dev Server:** `npm run dev` (local development)  

### Step 2: Gather Requirements
- **Classification:** Public assessment tool (no auth required initially)  
- **Scale:** Low-to-medium traffic (internal + user-facing)  
- **Budget:** Minimal (Static Web Apps has generous free tier; $0.02 per build + CDN costs)  
- **Hosting Preference:** Serverless static hosting (Static Web Apps)  

### Step 3: Technology Assessment
- **Frontend Framework:** React 18 + TypeScript ✓  
- **Build Output:** Static HTML/CSS/JS  
- **Hosting Model:** Azure Static Web Apps (ideal for SPAs)  
- **CI/CD:** GitHub Actions integration (automatic)  
- **Custom Domain:** Optional (can configure later)  

### Step 4: Select Recipe
- **Recipe:** Azure Static Web Apps + GitHub Actions  
- **IaC Format:** Bicep  
- **Services:**
  - Azure Static Web Apps (Free Tier)
  - GitHub Actions (free with GitHub repo)
  - Azure DevOps optional (alternative to GitHub)

### Step 5: Infrastructure Design
```
┌─────────────────────────────────────────┐
│      Azure Static Web Apps               │
│  avd-assessment-app.azurestaticapps.net │
├─────────────────────────────────────────┤
│  • React SPA (compiled dist/)            │
│  • Global CDN distribution               │
│  • HTTPS auto-enabled                    │
│  • Custom domain support                 │
│  • Free tier: 1 SWA per subscription     │
└─────────────────────────────────────────┘
         ↑
         │ GitHub Actions CI/CD
         │ (auto-trigger on push)
         │
    GitHub Repository
```

### Step 6: Implementation Decisions
- **Deployment Trigger:** GitHub Actions on push to `main` branch  
- **Build Command:** `npm run build`  
- **Output Directory:** `app/dist` (or equivalent per package.json config)  
- **Environment Variables:** None required initially  
- **Authentication:** Not required (public tool)  
- **CORS Policy:** Not applicable (static hosting)  
- **Monitoring:** Application Insights (optional, can add later)  

---

## Phase 2: Artifact Generation (COMPLETE ✓)

### Bicep Modules (Generated)
- [x] `infrastructure/main.bicep` — Static Web Apps resource + GitHub integration  
- [x] `infrastructure/main.bicepparam` — Parameters file (awaiting user values)  

### Configuration Files (Generated)
- [x] `app/staticwebapp.config.json` — SPA routing configuration  
- [x] `.github/workflows/deploy.yml` — GitHub Actions CI/CD workflow  

### Documentation (Generated)
- [x] `.github/DEPLOYMENT.md` — Complete deployment instructions  

---

## Phase 3: Validation & Deployment

### Validation Checklist
- [ ] Bicep syntax validated  
- [ ] Azure CLI access confirmed  
- [ ] GitHub repo integration verified  
- [ ] Build artifacts validated  
- [ ] Static Web Apps config validated  

### Deployment Steps (READY TO EXECUTE)
1. Create resource group: `az group create --name rg-avd-assessment-app --location eastus`
2. Generate GitHub PAT with `repo` and `workflow` scopes
3. Update `.azure/infrastructure/main.bicepparam` with your values
4. Deploy with: `az deployment group create --name avd-assessment-deployment --resource-group rg-avd-assessment-app --template-file .azure/infrastructure/main.bicep --parameters .azure/infrastructure/main.bicepparam`
5. Add GitHub secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
6. Push to `main` branch — GitHub Actions will auto-deploy!

---

## IMMEDIATE NEXT ACTIONS FOR USER

### ⚠️ Required Before Deployment

1. **Update** `.azure/infrastructure/main.bicepparam` with:
   - Your GitHub repository URL
   - Your GitHub Personal Access Token (PAT)
   - Subscription and region details

2. **Generate GitHub PAT:**
   - Visit: https://github.com/settings/tokens
   - Create token with `repo` and `workflow` scopes
   - Copy the token value

3. **Run deployment commands** from `.github/DEPLOYMENT.md`

### ✅ Files Ready for You
- `.azure/infrastructure/main.bicep` — Bicep template
- `.azure/infrastructure/main.bicepparam` — Parameters template (fill in your values)
- `app/staticwebapp.config.json` — SPA routing config
- `.github/workflows/deploy.yml` — GitHub Actions workflow
- `.github/DEPLOYMENT.md` — Step-by-step deployment guide
