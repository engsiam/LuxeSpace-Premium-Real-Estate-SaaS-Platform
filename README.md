# 🏡 LuxeSpace - Premium Real Estate Platform

# Live Demo
[![Live Demo](https://img.shields.io/badge/Demo-Live-green)](https://luxspace-beta.vercel.app)

# Backend API 
[![Backend API](https://img.shields.io/badge/API-Render-blue)](https://luxspace-backend.onrender.com/api/v1)

# Project Screenshot
![Alt Text](https://i.ibb.co.com/d4Kp0ysx/Chat-GPT-Image-May-3-2026-07-21-51-PM.png)

A full-stack premium real estate platform for Bangladesh, connecting property buyers with exclusive listings through an elegant, modern interface.

---

## 📱 Project Overview

**Project Name:** LuxeSpace  
**Type:** Real Estate Web Application  
**Target Users:** Property buyers, agents, and administrators in Bangladesh  
**Core Functionality:** Property listings, advanced search, booking system with bKash payments, AI recommendations

### Key Screenshots

| Page | Description |
|------|-------------|
| Home | 9 sections: Hero, Featured, Categories, How It Works, Stats, Testimonials, Blog, FAQ, CTA, Newsletter |
| Explore | Filterable property grid with search, pagination |
| Property Details | Image gallery, specifications, reviews, booking modal |
| Dashboard | Role-based (User/Agent/Admin) with analytics |
| Profile | Edit identity, upload avatar |

---

## ✨ Features

### 🔑 Core Features
- **Property Search** - Advanced filters (city, type, price range, BHK, bedrooms)
- **Property Listings** - Grid view with cards (image, title, price, location)
- **Property Details** - Image gallery slider, specifications, reviews, related properties
- **Booking System** - bKash payment integration
- **User Dashboard** - My bookings, wishlist, transactions
- **Agent Dashboard** - Add/edit properties, analytics
- **Admin Dashboard** - User management, property moderation, blogs, messages
- **Contact Form** - Stores to database
- **AI Chat** - Property recommendations

### 🛡️ Security Features
- JWT authentication (access + refresh tokens)
- Role-based route protection
- Password hashing with bcrypt
- Input validation (client + server)
- CORS configuration

### 🎨 UI/UX Features
- Dark/Light mode toggle
- Fully responsive (mobile, tablet, desktop)
- Smooth animations (GSAP, Framer Motion)
- Lenis smooth scrolling
- Skeleton loaders
- Toast notifications

---

## 🛠️ Tech Stack

### Frontend (`/client`)

| Technology | Purpose |
|------------|---------|
| Next.js 16 | App Router framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui | Components library |
| GSAP + Framer Motion | Animations |
| Lenis | Smooth scroll |
| React Hook Form + Zod | Forms |
| NextAuth.js | Authentication |
| Zustand + React Query | State management |
| Recharts | Charts |
| Axios | HTTP client |

### Backend (`/server`)

| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime |
| Express.js | API framework |
| TypeScript | Type safety |
| Prisma | ORM |
| MongoDB (Atlas) | Database |
| JWT | Authentication |
| Zod | Validation |
| Multer + Cloudinary | Image upload |
| bKash PGW V2 | Payments |
| OpenAI/Gemini | AI recommendations |

---

## 📁 Project Structure

```
luxespace/                    # Root directory
│
├── client/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── (auth)/       # Auth pages (login, register)
│   │   │   ├── (public)/     # Public pages (home, explore, about, contact, blog)
│   │   │   ├── dashboard/   # Private dashboards
│   │   │   ├── payment/     # Payment status pages
│   │   │   └── api/         # API routes
│   │   │
│   │   ├── components/       # Reusable components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── home/       # Home page sections
│   │   │   ├── property/   # Property components
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   └── shared/    # Shared components
│   │   │
│   │   ├── lib/            # Utilities
│   │   │   ├── axiosInstance.ts
│   │   │   ├── auth.config.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── store/           # Zustand stores
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── public/         # Static assets
│   │
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.ts
│
└── server/                   # Express Backend
    ├── src/
    │   ├── app/
    │   │   ├── modules/    # Feature modules
    │   │   │   ├── user/       # User auth & profile
    │   │   │   ├── property/   # Property CRUD
    │   │   │   ├── booking/    # Booking & payments
    │   │   │   ├── review/    # Property reviews
    │   │   │   ├── blog/     # Blog CMS
    │   │   │   ├── contact/  # Contact forms
    │   │   │   ├── ai/      # AI chat
    │   │   │   └── stats/   # Dashboard stats
    │   │   │
    │   │   ├── middlewares/  # Express middleware
    │   │   └── utils/      # Utilities
    │   │
    │   ├── config/         # Environment config
    │   └── prisma/        # Database client
    │
    ├── prisma/
    │   ├── schema.prisma  # Database schema
    │   └── seed.ts      # Demo data seeder
    │
    ├── .env.example
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Installation Guide

### Prerequisites

Install these on your PC:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| Git | Latest | [git-scm.com](https://git-scm.com) |
| MongoDB | Atlas | [mongodb.com](https://mongodb.com) (cloud) |

### Step 1: Clone the Project

```bash
git clone https://github.com/engsiam/luxspace.git
cd luxespace
```

### Step 2: Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Required
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/luxespace"
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=5000

# Cloudinary (for image upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# bKash Payment (optional)
BKASH_USERNAME=your-username
BKASH_PASSWORD=your-password
BKASH_APP_KEY=your-app-key
BKASH_APP_SECRET=your-app-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# OpenAI (optional)
OPENAI_API_KEY=your-openai-key
```

Generate Prisma client and sync database:

```bash
npx prisma generate
npx prisma db push
npm run prisma:seed    # Creates demo users
```

Start the backend:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### Step 3: Frontend Setup

Open a new terminal:

```bash
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Client runs on: `http://localhost:3000`

### Step 4: Access the App

| URL | Page |
|-----|------|
| http://localhost:3000 | Home |
| http://localhost:3000/explore | Properties |
| http://localhost:3000/login | Login |
| http://localhost:3000/dashboard | User Dashboard |
| http://localhost:3000/dashboard/admin | Admin Dashboard |

---

## 👤 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@luxespace.com | Admin@123 |
| Agent | agent1@luxespace.com | Agent@123 |
| User | user1@luxespace.com | User@123 |

---

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh-token` - Refresh JWT
- `POST /api/v1/auth/google` - Google OAuth

### Properties
- `GET /api/v1/properties` - List with filters
- `POST /api/v1/properties` - Create (AGENT/ADMIN)
- `GET /api/v1/properties/:id` - Details
- `PATCH /api/v1/properties/:id` - Update
- `DELETE /api/v1/properties/:id` - Delete

### Bookings
- `POST /api/v1/bookings/init` - Initiate payment
- `POST /api/v1/bookings/execute` - Execute payment
- `GET /api/v1/bookings` - My bookings

### Users
- `GET /api/v1/users/me` - My profile
- `PATCH /api/v1/users/me` - Update profile
- `POST /api/v1/users/avatar` - Upload avatar
- `GET /api/v1/users` - All users (ADMIN)

### Others
- `POST /api/v1/reviews` - Add review
- `GET /api/v1/blogs` - List blogs
- `POST /api/v1/contact` - Submit contact
- `POST /api/v1/ai/chat` - AI chat

---

## 🎨 Design System

### Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Gold) | #D4AF37 | Buttons, accents |
| Secondary (Navy) | #0F172A | Text, backgrounds |
| Background | #FFFFFF / #0B0F19 | Light/Dark mode |

### Typography
- **Font:** Plus Jakarta Sans
- **Headings:** Bold, tracking-tight
- **Body:** Base, muted

### Components
- Rounded corners: `rounded-xl`
- Shadows: Multi-layer with gold tint
- Cards: Border with glow effect

---

## 📦 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Deploy

### Backend (Render/Railway)

1. Push to GitHub
2. Create web service
3. Add environment variables
4. Set build command: `npm run build`
5. Set start command: `node dist/server.js`

---

## ✅ Checklist

- [x] No console.log in production
- [x] Real MongoDB data (no dummy content)
- [x] Environment variables for all URLs
- [x] Responsive (375px, 768px, 1280px)
- [x] Form validation (client + server)
- [x] Loading skeletons
- [x] Dark mode everywhere
- [x] Role-based protection
- [x] shadcn/ui components
- [x] Smooth scroll (Lenis)

---

## 📄 License

MIT License - Free for learning and commercial use.

---

**Built with ❤️ following LuxeSpace Master AI Coding Agent**