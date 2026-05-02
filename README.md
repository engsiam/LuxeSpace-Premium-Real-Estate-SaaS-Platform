# 🏡 LuxeSpace - Premium Real Estate Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live-green)](https://luxespace.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Render-blue)](https://luxespace-api.onrender.com)

LuxeSpace is a full-stack real estate platform for Bangladesh, connecting property buyers with premium listings through an elegant, modern interface. Built with Next.js 16, Express.js, MongoDB, and integrated with bKash payments.

---

## ✨ Features

### For Users
- 🔍 Advanced property search with filters (city, type, price, BHK)
- 🏠 Interactive property details with image gallery
- 💳 Secure bKash payment integration
- ⭐ Review and rating system
- ❤️ Wishlist management
- 📱 Fully responsive design with dark mode

### For Agents
- 🏢 List and manage properties
- 📊 Dashboard with property analytics
- 💼 Profile management

### For Admins
- 👥 User and agent management
- 📈 Advanced analytics dashboard with charts
- 📝 Blog management system
- 📧 Contact message management
- 🤖 AI-powered property recommendations

---

## 🛠️ Tech Stack

### Backend (`/server`)
- **Runtime:** Node.js 20+
- **Framework:** Express.js with TypeScript
- **ORM:** Prisma
- **Database:** MongoDB (Atlas)
- **Auth:** JWT (access + refresh tokens)
- **Validation:** Zod
- **File Upload:** Multer + Cloudinary
- **Payment:** bKash PGW V2
- **AI:** OpenAI / Google Gemini SDK

### Frontend (`/client`)
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + CSS Variables
- **UI Library:** shadcn/ui
- **Animations:** GSAP + Framer Motion
- **Smooth Scroll:** Lenis
- **Forms:** React Hook Form + Zod
- **Auth:** NextAuth.js
- **HTTP:** Axios with interceptors
- **State:** Zustand + React Query
- **Charts:** shadcn/ui Charts (Recharts)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Cloudinary account
- bKash PGW credentials
- OpenAI API key (optional)

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma generate
npx prisma db push
npm run prisma:seed  # Creates demo users
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env.local
# Edit .env.local with API URL
npm run dev
```

Client runs on `http://localhost:3000`

---

## 👤 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@luxespace.com` | `Admin@123` |
| Agent | `agent1@luxespace.com` | `Agent@123` |
| User | `user1@luxespace.com` | `User@123` |

---

## 📁 Project Structure

```
luxespace/
├── client/         ← Next.js 16 Frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # Reusable components
│   │   ├── lib/             # Utilities
│   │   ├── hooks/           # Custom hooks
│   │   ├── store/           # Zustand stores
│   │   └── types/           # TypeScript types
│   └── public/
│
└── server/         ← Express + TypeScript Backend
    ├── src/
    │   ├── app/             # Express app setup
    │   │   ├── middlewares/
    │   │   ├── routes/
    │   │   └── utils/
    │   ├── config/          # Environment config
    │   └── modules/         # Feature modules
    │       ├── user/
    │       ├── property/
    │       ├── booking/
    │       ├── review/
    │       ├── blog/
    │       ├── contact/
    │       └── ai/
    └── prisma/              # Database schema
```

---

## 🌐 API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh-token` - Refresh JWT

### Properties
- `GET /api/v1/properties` - List + filter
- `POST /api/v1/properties` - Create (AGENT/ADMIN)
- `GET /api/v1/properties/:id` - Detail
- `PATCH /api/v1/properties/:id` - Update (AGENT/ADMIN)
- `DELETE /api/v1/properties/:id` - Delete (AGENT/ADMIN)

### Bookings
- `POST /api/v1/bookings/init` - Initiate bKash (USER)
- `POST /api/v1/bookings/execute` - Execute payment
- `GET /api/v1/bookings` - My bookings
- `GET /api/v1/bookings/all` - All bookings (ADMIN)

### Others
- `POST /api/v1/reviews` - Create review (USER)
- `GET /api/v1/blogs` - List blogs
- `POST /api/v1/blogs` - Create blog (ADMIN)
- `POST /api/v1/contact` - Submit contact
- `POST /api/v1/ai/chat` - AI property chat

---

## 🎨 Design System

### Brand Colors
- **Primary (Gold):** `#D4AF37`
- **Secondary (Deep Navy):** `#0F172A`
- **Background:** `#FFFFFF` (light) / `#0B0F19` (dark)

### Typography
- **Font:** Plus Jakarta Sans
- **H1:** `text-4xl md:text-5xl font-bold`
- **H2:** `text-3xl font-bold`
- **Body:** `text-base text-[var(--color-text-muted)]`

---

## 📦 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Railway)
1. Push code to GitHub
2. Create new web service
3. Set environment variables
4. Deploy

---

## ✅ Compliance Checklist

- [x] No `any` types
- [x] No `console.log` in production
- [x] Real data from MongoDB (no dummy data)
- [x] Environment variables for all URLs
- [x] Responsive design (375px, 768px, 1280px)
- [x] Comprehensive error handling
- [x] Form validation (client + server)
- [x] Loading skeletons for all sections
- [x] Dark mode works everywhere
- [x] Role-based route protection
- [x] shadcn/ui components used exclusively
- [x] Lenis smooth scroll on public pages
- [x] shadcn charts with ChartContainer wrapper

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

**Built with ❤️ following the LuxeSpace Master AI Coding Agent Instructions**
