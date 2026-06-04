# Database Setup Guide

## Quick Fix: The Error You're Seeing

The error `Environment variable not found: DATABASE_URL` means you need to set up a database. Here are your options:

---

## Option 1: Install MySQL Locally (Recommended for Development)

### Step 1: Download MySQL
1. Go to https://dev.mysql.com/downloads/installer/
2. Download "MySQL Installer for Windows"
3. Run the installer

### Step 2: Install MySQL
1. Choose "Developer Default" setup
2. Follow the installation wizard
3. Set root password (remember this!)
4. Complete the installation

### Step 3: Create Database
Open MySQL Workbench (installed with MySQL) or Command Prompt:

```sql
CREATE DATABASE ratimutsa_farm;
```

### Step 4: Update .env File
Update your `.env` file with:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/ratimutsa_farm"
```

Replace `YOUR_PASSWORD` with the password you set during MySQL installation.

### Step 5: Run Migrations
```bash
npx prisma migrate dev
npx prisma db seed
```

---

## Option 2: Use XAMPP (Easiest for Windows)

### Step 1: Download XAMPP
1. Go to https://www.apachefriends.org/
2. Download XAMPP for Windows
3. Install it

### Step 2: Start MySQL
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Click "Admin" to open phpMyAdmin

### Step 3: Create Database
In phpMyAdmin:
1. Click "New" in the left sidebar
2. Database name: `ratimutsa_farm`
3. Collation: `utf8mb4_general_ci`
4. Click "Create"

### Step 4: Update .env File
```env
DATABASE_URL="mysql://root@localhost:3306/ratimutsa_farm"
```

Note: XAMPP's default MySQL has no password for root user.

### Step 5: Run Migrations
```bash
npx prisma migrate dev
npx prisma db seed
```

---

## Option 3: Use Online MySQL Database (Quick Testing)

### Free MySQL Hosting Options:
1. **Railway** - https://railway.app/ (500 hours free)
2. **PlanetScale** - https://planetscale.com/ (Free tier available)
3. **Clever Cloud** - https://www.clever-cloud.com/ (Free tier)

### General Steps:
1. Sign up for the service
2. Create a MySQL database
3. Copy the connection string
4. Update `.env` with the connection string

---

## Option 4: Docker (For Advanced Users)

### Step 1: Install Docker Desktop
Download from https://www.docker.com/products/docker-desktop/

### Step 2: Run MySQL Container
```bash
docker run --name ratimutsa-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=ratimutsa_farm -p 3306:3306 -d mysql:8
```

### Step 3: Update .env File
```env
DATABASE_URL="mysql://root:password@localhost:3306/ratimutsa_farm"
```

### Step 4: Run Migrations
```bash
npx prisma migrate dev
npx prisma db seed
```

---

## After Database Setup

Once you have MySQL running and the `.env` file configured:

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Run Migrations (creates all tables)
```bash
npx prisma migrate dev --name init
```

### 3. Seed Database (adds sample data)
```bash
npx prisma db seed
```

Or run seed using ts-node:
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Verify Setup
1. Open http://localhost:3000
2. You should see the homepage with products
3. Go to http://localhost:3000/admin/login
4. Default admin credentials (check seed file):
   - Email: admin@ratimutsafarm.com
   - Password: admin123

---

## Troubleshooting

### Error: "Can't reach database server"
- Make sure MySQL is running
- Check if the port 3306 is correct
- Verify username and password

### Error: "Access denied for user"
- Check your password in the DATABASE_URL
- Make sure user has permissions

### Error: "Unknown database"
- Create the database first: `CREATE DATABASE ratimutsa_farm;`

### Error: "prisma command not found"
- Run: `npm install`
- Or use: `npx prisma`

### Hydration Warning (Grammarly/Browser Extensions)
- Already fixed with `suppressHydrationWarning` on body tag
- This warning is harmless and caused by browser extensions

---

## Current .env Configuration

Your current `.env` file is set to:
```env
DATABASE_URL="file:./dev.db"
```

This is for SQLite, but the project requires MySQL. Please update it to one of the MySQL connection strings above.

---

## Quick Start Command Summary

After setting up MySQL with any option above:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Create database tables
npx prisma migrate dev --name init

# 3. Seed with sample data
npm run seed

# 4. Start development server
npm run dev
```

---

## Production Database (cPanel)

When deploying to production on cPanel:

1. Create MySQL database in cPanel
2. Create MySQL user in cPanel
3. Assign user to database with all privileges
4. Get connection details from cPanel
5. Update production `.env`:

```env
DATABASE_URL="mysql://cpanel_user:password@localhost:3306/cpanel_dbname"
```

---

## Need Help?

If you're still having issues:

1. Check MySQL is running:
   - XAMPP: Check XAMPP Control Panel
   - Windows Service: Check Services app
   - Docker: `docker ps`

2. Test MySQL connection:
   - Open MySQL Workbench
   - Try to connect with your credentials

3. Check the error message carefully:
   - "Can't reach" = MySQL not running
   - "Access denied" = Wrong password
   - "Unknown database" = Database not created

---

**Recommendation**: For Windows development, use **XAMPP** (Option 2) - it's the easiest to set up and use.
