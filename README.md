# 🌾 Farmland Market - Agricultural Product Marketing Platform

A production-ready farm product marketing and ordering web application built with Next.js, React, TypeScript, TailwindCSS, PostgreSQL, and Prisma.

## 🎯 Features

### Public Website
- **Hero Section** with call-to-action buttons
- **Product Marketplace** with category filtering
- **Product Details** with image gallery and availability
- **Shopping Cart** with quantity management
- **Order Request System** (no online payment)
- **WhatsApp Integration** for order communication
- **Announcement System** (banner + popup alerts)
- **Testimonials Section**
- **Harvest Calendar** display
- **Mobile-First Design** with responsive layouts
- **Floating Contact Buttons** (WhatsApp & Phone)

### Admin Dashboard
- **Secure Authentication** (email + password with bcrypt)
- **Role-Based Access** (Admin & Staff)
- **Dashboard Overview** with key metrics
- **Product Management** (CRUD operations)
- **Category Management**
- **Inventory Control** with low stock alerts
- **Order Request Management** with status tracking
- **Announcement Manager** (banner/popup toggle)
- **Testimonial Manager**
- **Harvest Calendar Manager**
- **User Management** (Admin only)

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: iron-session with bcrypt
- **Image Storage**: Local filesystem (/public/uploads)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd farmland-market
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/farmland_db?schema=public"

# Session Secret (generate with: openssl rand -base64 32)
SESSION_SECRET="your-secret-key-here-change-in-production"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# WhatsApp Business Number (with country code, no + or spaces)
NEXT_PUBLIC_WHATSAPP_NUMBER="1234567890"

# Phone Number for calls
NEXT_PUBLIC_PHONE_NUMBER="+1234567890"
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npm run seed
```

### 5. Create Uploads Directory

```bash
mkdir -p public/uploads
```

### 6. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔐 Default Admin Credentials

```
Email: admin@farmland.com
Password: admin123
```

**⚠️ IMPORTANT**: Change these credentials immediately in production!

## 📁 Project Structure

```
farmland-market/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx              # Homepage
│   │   ├── products/             # Product listing & details
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout page
│   │   ├── about/                # About page
│   │   └── contact/              # Contact page
│   ├── admin/                    # Admin dashboard
│   │   ├── page.tsx              # Dashboard
│   │   ├── products/             # Product management
│   │   ├── categories/           # Category management
│   │   ├── orders/               # Order management
│   │   ├── announcements/        # Announcement management
│   │   ├── testimonials/         # Testimonial management
│   │   └── harvest/              # Harvest calendar
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication
│   │   ├── orders/               # Order endpoints
│   │   └── admin/                # Admin endpoints
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AnnouncementBanner.tsx
│   ├── AnnouncementPopup.tsx
│   └── FloatingButtons.tsx
├── lib/                          # Utility libraries
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # Authentication utilities
│   └── cart.ts                   # Cart management
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeder
├── public/
│   └── uploads/                  # Product images
├── .env.example                  # Environment template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

### Models
- **User**: Admin and staff accounts
- **Category**: Product categories
- **Product**: Farm products with inventory
- **Announcement**: Banner and popup announcements
- **Testimonial**: Customer testimonials
- **HarvestCalendar**: Harvest period tracking
- **OrderRequest**: Customer order requests
- **OrderItem**: Individual items in orders

## 🎨 Design System

### Colors
- **Primary Green**: `#7fba00` (farm-green)
- **Dark Green**: `#5a8500` (farm-darkgreen)
- **Cream**: `#fef9f3` (farm-cream)

### Components
- `btn-primary`: Primary action button
- `btn-secondary`: Secondary action button
- `card`: Card container with shadow
- `input-field`: Form input styling

## 📱 Mobile Optimization

- Responsive grid layouts
- Touch-friendly buttons (min 44x44px)
- Sticky header navigation
- Floating action buttons
- Optimized images with lazy loading
- Mobile-first CSS approach

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- Session-based authentication with iron-session
- Protected admin routes
- Input validation with Zod
- SQL injection protection via Prisma
- CSRF protection via Next.js

## 🚢 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure all environment variables are set:
- Use a strong `SESSION_SECRET` (32+ characters)
- Set `NODE_ENV=production`
- Configure production database URL
- Update `NEXT_PUBLIC_APP_URL` to production domain

### Database Migration

```bash
npx prisma migrate deploy
```

### Recommended Hosting

- **Vercel**: Seamless Next.js deployment
- **Railway**: PostgreSQL + Next.js hosting
- **DigitalOcean**: VPS with Docker
- **AWS**: EC2 + RDS

## 📊 Admin Features

### Dashboard
- Total products count
- Low stock alerts
- Active announcements
- Order statistics
- Recent orders table

### Product Management
- Add/Edit/Delete products
- Upload product images
- Set pricing and inventory
- Category assignment
- Seasonal product tagging
- Availability toggle
- Low stock threshold configuration

### Order Management
- View all order requests
- Update order status (pending/confirmed/completed/cancelled)
- Customer contact information
- Order item details
- WhatsApp quick contact

### Announcement System
- Create announcements
- Toggle banner/popup display
- Set expiration dates
- Activate/deactivate announcements

## 🛒 Order Flow

1. Customer browses products
2. Adds items to cart
3. Proceeds to checkout
4. Fills contact information
5. Submits order request OR sends via WhatsApp
6. Admin receives order notification
7. Admin contacts customer to confirm
8. Admin updates order status

## 🔧 Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Database
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Create migration
npx prisma migrate deploy  # Deploy migration
npm run seed               # Seed database

# Linting
npm run lint
```

## 📝 API Endpoints

### Public
- `POST /api/orders` - Create order request

### Admin (Authentication Required)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `PATCH /api/admin/orders/[id]` - Update order status
- `PATCH /api/admin/announcements/[id]` - Toggle announcement
- `PATCH /api/admin/testimonials/[id]` - Toggle testimonial

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env
# Ensure database exists
```

### Prisma Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Support

For support, email: support@farmland.com

---

Built with ❤️ for sustainable farming
