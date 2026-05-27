# cPanel Git Deployment Guide - Ratimutsa Farm

This guide explains how to deploy your Next.js application using **cPanel Git Version Control**. This is the highest level of automation for your production environment.

## The Strategy: "Standalone Push"
Next.js applications (especially with Prisma) are too resource-heavy to build directly on most shared hosting (RAM limits). 

**Solution:** Build locally -> Push artifacts to a `deploy` branch -> cPanel pulls and runs.

---

## 1. Local Preparation

### Run the Git Preparation Script
This script builds your app and prepares the `.next/standalone` folder with all necessary assets (public, static, prisma, and server logic).

```bash
npm run deploy:prepare
```

This will create a self-contained production environment inside `.next/standalone/`.

---

## 2. Git Workflow (Local)

To keep your source repo clean, it is recommended to push the *contents* of `.next/standalone/` to a dedicated `deploy` or `production` branch.

### Option A: Manual Git Push (Simple)
1. Ensure your `.next/standalone` folder is ready.
2. If you are using a dedicated deployment repository:
   ```bash
   cd .next/standalone
   git init
   git remote add origin YOUR_CPANEL_GIT_URL
   git add .
   git commit -m "Deploy: $(date)"
   git push origin main -f
   ```

---

## 3. cPanel Configuration

### 1. Link Git Repository
1. In cPanel, go to **Git™ Version Control**.
2. Click **Create**.
3. Toggle **Clone a Repository**.
4. **Repository Path:** `/home/ratimuts/farmland` (or your preferred path).
5. **Repository Name:** `ratimutsa-prod`.
6. Click **Create**.

### 2. Post-Deployment (Automated)
The provided `.cpanel.yml` in the root of your repo will automatically:
- Copy the pulled files to your production directory.
- Preserve your `.env` file.
- Ensure the directory permissions are correct.

### 3. Setup Node.js App
1. In cPanel, go to **Setup Node.js App**.
2. **Application root:** `/home/ratimuts/farmland` (matching your Git path).
3. **Application startup file:** `server.js`.
4. **Application mode:** `production`.
5. Click **Run NPM Install** (only once if `package.json` changed, but standalone usually handles this).
6. **Restart** the app.

---

## 4. Environment Variables (.env)
Since Git should **never** track your `.env` file, you must create it manually in the production folder:
1. Open cPanel **File Manager**.
2. Go to `/home/ratimuts/farmland`.
3. Create a `.env` file.
4. Add your `DATABASE_URL`, `SESSION_SECRET`, etc. (See `.env.example`).

---

## 5. Summary of Optimized Files
- **`server.js`**: The production entry point that bootstraps the Next.js standalone server.
- **`.cpanel.yml`**: Deployment instructions for cPanel's Git tool.
- **`next.config.js`**: Configured with `output: 'standalone'` for peak performance.
- **`create-deploy-zip.js`**: Now supports `--no-zip` for Git-based preparation.

---
*Optimized by Antigravity for Ratimutsa Farm*
