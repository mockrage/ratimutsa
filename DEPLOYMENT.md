# cPanel Deployment Guide - Ratimutsa Farm

Complete instructions for hosting your Next.js application on a cPanel-based shared hosting environment using the **Setup Node.js App** tool.

## Prerequisites

- cPanel hosting with "Setup Node.js App" tool.
- Node.js 18+ support on the hosting.
- MySQL database (standard in cPanel).

---

## Phase 1: Local Preparation

Before uploading, prepare your application on your local computer.

### 1. Build and Package
Run the automated deployment script:
```bash
npm run zip-deploy
```
This script will:
- Clean old build data
- Run `next build` with **standalone** optimization
- Copy static assets and prisma files into the standalone bundle
- Package everything into a **Zero-Install** `DEPLOY_READY.zip`

**Note:** This ZIP includes all necessary Node.js modules pre-bundled. You will NOT need to run `npm install` on the server.

---

## Phase 2: Database Setup (MySQL)

### 1. Create Database and Grant Permissions
1. In cPanel, go to **MySQL Databases** (or **MySQL Database Wizard**).
2. **Create New Database:** Enter a name (e.g., `appdb`). cPanel will prefix it (e.g., `yourusername_appdb`).
3. **Create New User:** Enter a username and generate a strong password. **Write the password down immediately.**
4. **Grant Permissions:** Add the user to the database with **ALL PRIVILEGES**.

### 2. Build your Database URL
Format: `mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME`

Example:
```env
DATABASE_URL="mysql://ratimuts_dbuser:MyStrongPass123!@localhost:3306/ratimuts_appdb"
```

---

## Phase 3: Upload and Configure

### 1. Upload via cPanel File Manager
1. Open **File Manager** in cPanel.
2. Navigate to your domain's folder (e.g., `public_html` or a subdirectory).
3. Click **Upload** and select `DEPLOY_READY.zip`.
4. Right-click the uploaded file and select **Extract**.

### 2. Create the `.env` File
The ZIP does NOT include a `.env` file (for security). You must create one manually:
1. In File Manager, navigate to your application root (where `server.js` is).
2. Click **+ File**, name it `.env`.
3. Open it and paste the following, filling in your real values:

```env
# Database - MySQL (cPanel)
DATABASE_URL="mysql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:3306/YOUR_DB_NAME"

# Session Secret (generate a unique string)
SESSION_SECRET="YOUR_GENERATED_SECRET_HERE"

# App URL
NEXT_PUBLIC_APP_URL="https://www.ratimutsa.co.zw"

# Contact Information
NEXT_PUBLIC_EMAIL="sales@ratimutsa.co.zw"
NEXT_PUBLIC_ADDRESS="Musami, Murehwa District Zimbabwe"

# WhatsApp Business Number (with country code, no + or spaces)
NEXT_PUBLIC_WHATSAPP_NUMBER="263779527507"

# Phone Numbers
NEXT_PUBLIC_PHONE_NUMBER="+263 779 527 507"
NEXT_PUBLIC_PHONE_NUMBER_SECONDARY="+263 779 527 503"
NEXT_PUBLIC_PHONE_NUMBER_TERTIARY="+263 779 527 560"
NEXT_PUBLIC_PHONE_NUMBER_QUATERNARY="+263 779 527 553"

# Social Media
NEXT_PUBLIC_INSTAGRAM="ratimutsa_farms"
NEXT_PUBLIC_FACEBOOK="Ratimutsa Farms"
```

### 3. Configure the Node.js App
1. In cPanel, search for **Setup Node.js App**.
2. Click **Create Application**.
3. **Node.js version:** Select 18 or higher.
4. **Application mode:** Set to `production`.
5. **Application root:** Enter the path to your extracted folder.
6. **Application URL:** Select your domain from the dropdown.
7. **Application startup file:** Type `server.js`.
8. Click **Create**.
9. **DO NOT click "Run NPM Install"** -- all modules are pre-packaged in the ZIP.

---

## Phase 4: Initialize the Database

Using the cPanel **Terminal** (or the "Run JS Script" option in the Node.js App panel), run:

```bash
npx prisma db push
```

This creates all tables in your MySQL database based on the Prisma schema.

To seed the database with sample data (optional, recommended for first setup):
```bash
npx prisma generate
npx tsx prisma/seed.ts
```

**Important:** After seeding, immediately change the default admin password by logging into the admin panel at `/admin/login` with:
- Email: `admin@farmland.com` / Password: `admin123`
- Email: `senior@farmland.com` / Password: `admin123`

---

## Phase 5: Launch

1. Go back to **Setup Node.js App** in cPanel.
2. Click **Restart** at the top of your application.
3. Visit your domain to verify the site is running.

---

## Troubleshooting

- **502 Bad Gateway:** Check that Node.js version is 18+ and `server.js` exists in the application root. Check the error log in cPanel for details.
- **Images not loading:** Ensure the `public/` folder was extracted correctly and has 755 permissions. In File Manager, right-click `public` > Change Permissions > set to 755.
- **Database errors:** Double-check your `.env` `DATABASE_URL` string and ensure you ran `npx prisma db push`.
- **Module not found errors:** Ensure you extracted the ZIP correctly and all files from `.next/standalone/` are present.

---
*Last Updated: March 2026*
