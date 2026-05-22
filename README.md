# ⚡ BillingOS — Role-Based SaaS Billing Portal

A production-grade, full-stack SaaS Billing Portal built with the MERN stack. Features JWT authentication, role-based access control (RBAC), plan management, subscription lifecycle, invoice generation, and an admin analytics dashboard.

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
