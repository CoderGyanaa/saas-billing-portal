<div align="center">

# 🚀 BillingOS — The Future of SaaS Billing Infrastructure

<img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=28&duration=3000&color=8B5CF6&center=true&vCenter=true&width=900&lines=Next-Gen+SaaS+Billing+Platform;Enterprise-Grade+Subscription+Management;Role-Based+Access+Control+(RBAC);Modern+Analytics+Dashboard;Secure+JWT+Authentication;Production-Ready+MERN+Stack+Project" />

<br/>

<img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" />

</div>

---

## 🌌 Overview

BillingOS is a futuristic, production-grade SaaS Billing Platform built with the MERN stack, featuring intelligent subscription management, secure authentication, invoice automation, analytics dashboards, and enterprise-grade role-based access control.

⚡ Designed to simulate real-world SaaS infrastructure with scalable architecture and premium UI/UX.

---
## 📸 Project Preview

### Dashboard
<img width="1897" height="909" alt="image" src="https://github.com/user-attachments/assets/55b457ae-532d-4783-a989-42b49b379d26" />


### Pricing Plans
<img width="1917" height="898" alt="image" src="https://github.com/user-attachments/assets/d6f01d90-1b0f-4ee0-adea-a62f1f925174" />


### Admin Analytics
<img width="1911" height="921" alt="image" src="https://github.com/user-attachments/assets/a44e0ca3-bc98-4f86-8e8c-7a256289c95b" />


### Invoices
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/0d927020-98b1-4bd4-8566-0335a3a72cd7" />


---
## 🚀 Features

### User Roles
| Role | Access |
|---|---|
| `superadmin` | Full system access, user role assignment, plan deletion |
| `admin` | Dashboard analytics, user management, plan CRUD, all invoices |
| `billing_manager` | View subscriptions, manage invoices, mark paid |
| `user` | Dashboard, subscribe to plans, view own invoices, profile |

### Core Modules
- 🔐 **Auth** — Register, Login, JWT, Change Password, Profile Update
- 💳 **Plans** — Tiered pricing (Starter / Pro / Business), monthly & yearly billing toggle
- 📦 **Subscriptions** — Subscribe, Upgrade, Cancel, auto-generated invoices
- 🧾 **Invoices** — Detailed invoice with line items, tax (18%), status tracking
- 📊 **Admin Dashboard** — Revenue bar chart, subscription doughnut chart, stat cards
- 👥 **User Management** — Search, filter by role, activate/deactivate, role assignment
- 🎨 **Premium UI** — Dark theme, Sora font, smooth gradients, responsive layout

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router v6, Bootstrap 5, Chart.js, Axios, React Toastify  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs  
**Dev Tools:** Nodemon, dotenv

---

## 📁 Folder Structure

```
saas-billing-portal/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Business logic (auth, plans, subscriptions, invoices, admin)
│   ├── middleware/     # JWT protect + role authorize
│   ├── models/         # Mongoose schemas (User, Plan, Subscription, Invoice)
│   ├── routes/         # Express route definitions
│   ├── utils/          # Database seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── common/    # Sidebar
    │   ├── context/       # AuthContext (global state)
    │   ├── layouts/       # AppLayout (Sidebar + main content)
    │   ├── pages/
    │   │   ├── admin/     # AdminDashboard, AdminUsers, AdminPlans, AdminSubscriptions, AdminInvoices
    │   │   ├── Dashboard.js
    │   │   ├── Plans.js
    │   │   ├── Billing.js
    │   │   ├── Invoices.js
    │   │   ├── InvoiceDetail.js
    │   │   ├── Profile.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── NotFound.js
    │   ├── services/      # Axios instance
    │   ├── App.js
    │   ├── index.js
    │   └── index.css      # Global design tokens + component styles
    ├── .env.example
    └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- Git

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Frontend
cd ../frontend
cp .env.example .env
# Edit if your backend runs on a different port
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates demo users, plans, subscriptions, and invoices.

### 4. Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# Opens http://localhost:3000
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@billing.dev | Admin@1234 |
| Admin | admin@billing.dev | Admin@1234 |
| Billing Manager | billing@billing.dev | Admin@1234 |
| User (Pro plan) | gyana@example.com | User@1234 |
| User (Business plan) | priya@example.com | User@1234 |

> Use the **Quick Demo Login** buttons on the login page for one-click access!

---

## 📡 API Documentation

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login, get JWT |
| GET | `/api/auth/me` | Protected | Get current user |
| PUT | `/api/auth/profile` | Protected | Update profile |
| PUT | `/api/auth/change-password` | Protected | Change password |

### Plans
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/plans` | Public | List all active plans |
| POST | `/api/plans` | Admin | Create a plan |
| PUT | `/api/plans/:id` | Admin | Update a plan |
| DELETE | `/api/plans/:id` | Superadmin | Deactivate a plan |

### Subscriptions
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/subscriptions` | User | Subscribe to a plan |
| GET | `/api/subscriptions/my` | User | Get my subscription |
| PUT | `/api/subscriptions/upgrade` | User | Upgrade/change plan |
| PUT | `/api/subscriptions/cancel` | User | Cancel subscription |
| GET | `/api/subscriptions` | Admin/BM | All subscriptions |

### Invoices
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/invoices/my` | User | My invoices |
| GET | `/api/invoices/:id` | User/Admin | Invoice detail |
| GET | `/api/invoices` | Admin/BM | All invoices |
| PUT | `/api/invoices/:id/mark-paid` | Admin/BM | Mark as paid |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Dashboard analytics |
| GET | `/api/admin/users` | Admin | List users |
| PUT | `/api/admin/users/:id/role` | Superadmin | Change user role |
| PUT | `/api/admin/users/:id/toggle-active` | Admin | Activate/Deactivate |

---

## 🌐 Environment Variables

### Backend `.env`
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/saas_billing_portal
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...       # Optional for now
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎨 Design System

- **Font:** Sora (headings/body) + JetBrains Mono (numbers/code)
- **Theme:** Dark — `#0f0f1a` base, `#16162a` cards
- **Primary:** Indigo `#6366f1` → Violet `#8b5cf6`
- **Accent:** Pink `#ec4899`
- **Radius:** Cards 16px, Buttons 10px, Modals 20px

---

## 🏗️ Production Deployment

1. Build frontend: `cd frontend && npm run build`
2. Serve `build/` with Express or deploy to Vercel/Netlify
3. Deploy backend to Railway, Render, or AWS EC2
4. Set `NODE_ENV=production` and use MongoDB Atlas
5. Configure CORS `CLIENT_URL` to your production domain

---

## 👤 Author

**Gyana Ranjan Sahoo**  
GitHub: [@CoderGyanaa](https://github.com/CoderGyanaa)  
LinkedIn: [gyanaranjansahoo0033](https://linkedin.com/in/gyanaranjansahoo0033)

---

*Built with ❤️ as a resume-worthy, production-grade SaaS project.*
