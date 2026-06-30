# The Three Loom

A full-stack e-commerce platform for a clothing brand, offering curated collections for men, women, and children. Built with a React frontend and a Node.js/Express/MongoDB backend.

**Live Demo:** [Watch the walkthrough](https://drive.google.com/drive/folders/1HFYg1FnaM3t7d3IDZ58rvMlv70jCed7O?usp=drive_link)
**Repository:** [github.com/kashan-X/The_Three_Loom](https://github.com/kashan-X/The_Three_Loom.git)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Overview](#api-overview)
- [Admin Panel](#admin-panel)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)

---

## Overview

The Three Loom is a complete online clothing storefront, covering both the customer-facing shopping experience and an admin panel for store management. Customers can browse by category and season, add items to a cart, check out as a guest or with an optional account, track favorites, and manage their orders — including self-service cancellation within a 24-hour window. Admins can manage the product catalog, view and update orders, run category-wide sales, and monitor store performance through a dashboard.

---

## Features

### Customer-Facing

- Browse products by category (Men, Women, Children) and season (Summer, Winter, Spring, Autumn)
- Product detail pages with image galleries, size selection, stock-aware ordering, and a size chart modal
- Shopping cart with persistent storage (survives page refresh), quantity adjustment, and item removal
- Guest checkout — no account required to place an order
- Optional customer accounts: sign up, log in, manage profile, view order history, change password
- Order cancellation within 24 hours at no charge; cancellations after 24 hours incur a 20% fee (calculated automatically, payment handled manually since orders are Cash on Delivery)
- Favorites/wishlist system with persistent storage
- Category-wide sales — discounted pricing displays automatically when an admin runs a promotion on a category
- Contact form (messages saved and viewable by admin)
- FAQ page, shipping/returns/privacy/terms policy pages
- Auto-rotating homepage hero slideshow, drag-and-swipe collections carousel, and customer testimonials carousel

### Admin Panel

- Secure admin login with email-based password reset (via Gmail SMTP)
- Dashboard with sales statistics, monthly revenue chart, and city-wise sales breakdown
- Product management — create, edit, delete, and view all products
- Order management — view all orders, update status (Pending, Processing, Shipped, Delivered, Cancelled)
- Customer summary view, segmented by order frequency
- Category-wide discount management

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Recharts (admin dashboard charts)
- Lucide React (icons)

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- JWT-based authentication (separate flows for admin and customer)
- bcrypt (password hashing)
- Nodemailer (transactional email, password reset)

**Database**
- MongoDB (local via MongoDB Compass, or any MongoDB Atlas/cloud instance)

---

## Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Purpose | Link |
|---|---|---|
| Node.js (v18+) | Runs both frontend and backend | [nodejs.org](https://nodejs.org/) |
| npm | Comes bundled with Node.js | — |
| MongoDB Community Server | Local database | [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) |
| MongoDB Compass | GUI for browsing/editing the database (optional but recommended) | [mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass) |
| Git | Cloning the repository | [git-scm.com](https://git-scm.com/) |
| A Gmail account with an App Password | Required for password-reset emails | See [Environment Variables](#environment-variables) |

---

## Project Structure

```
The_Three_Loom/
├── Backend/
│   ├── config/          # Database connection
│   ├── controllers/      # Route logic
│   ├── middlewares/       # Auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── utils/              # Email utility, etc.
│   ├── app.js
│   ├── package.json
│   └── .env               # Not committed — see Environment Variables
│
└── Frontend/
    ├── public/             # Static assets, product images
    ├── src/
    │   ├── components/ui/   # Reusable UI components (Header, Footer, ProductGrid, Admin/...)
    │   ├── context/           # CartContext, FavoritesContext
    │   ├── pages/              # Route-level pages, including adminPages/
    │   ├── utils/               # Frontend auth helpers
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/kashan-X/The_Three_Loom.git
cd The_Three_Loom
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../Frontend
npm install
```

---

## Environment Variables

Inside the `Backend/` folder, create a `.env` file with the following values:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/the_three_loom

JWT_SECRET=your_jwt_secret_here
ADMIN_REGISTRATION_CODE=your_chosen_admin_signup_code

EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your_16_character_app_password

FRONTEND_URL=http://localhost:5173
```

**Notes:**
- `MONGO_URI` — if you're using a local MongoDB install, the default above works as-is. For MongoDB Atlas, replace with your connection string.
- `JWT_SECRET` — any long, random string works; used to sign authentication tokens.
- `ADMIN_REGISTRATION_CODE` — a secret code required to register a new admin account; choose your own value.
- `EMAIL_USER` / `EMAIL_PASS` — required for the "forgot password" email feature. `EMAIL_PASS` must be a Gmail **App Password**, not your regular Gmail password. Generate one from your Google Account → Security → 2-Step Verification (must be enabled first) → App Passwords.
- `FRONTEND_URL` — used to build the password-reset link sent in emails; defaults to the local Vite dev server address.

---

## Running the Project

### Start MongoDB

If running locally, make sure your MongoDB service is running:

```bash
net start MongoDB
```
*(Windows — adjust for your OS if different. Alternatively, open MongoDB Compass and connect to `mongodb://127.0.0.1:27017` to confirm the server is reachable.)*

### Start the backend

```bash
cd Backend
node app.js
```

You should see:
```
MongoDB connected successfully
Server running on port 8000
```

### Start the frontend

In a separate terminal:

```bash
cd Frontend
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## API Overview

The backend exposes REST endpoints under the following base routes:

| Base Route | Purpose |
|---|---|
| `/auth` | Admin registration, login, and password reset |
| `/customer` | Customer registration, login, profile, password change |
| `/product` | Product catalog (list, single, by category, create/update/delete) |
| `/order` | Order placement, order history, cancellation, admin order management |
| `/admin` | Admin dashboard statistics |
| `/contact` | Contact form submission and admin message management |
| `/category-discounts` | Category-wide sale management |

Most write operations (create/update/delete) require a valid JWT passed as `Authorization: Bearer <token>`.

---

## Admin Panel

1. Navigate to `http://localhost:5173/admin`
2. Register an admin account via the API directly (registration requires the `ADMIN_REGISTRATION_CODE` from your `.env`) — there is currently no public admin sign-up UI by design
3. Log in, and you'll be redirected to the dashboard at `/admin/dashboard`

From the dashboard, you can manage products, orders, customer summaries, and category discounts via the sidebar.

---

## Known Limitations

- Orders are linked to customer accounts by matching email address rather than a direct foreign key, since checkout does not require login. A guest order and a later account using a different email will not be linked.
- The cancellation penalty (20% after 24 hours) is calculated and displayed automatically, but actual payment collection is manual, since the store currently operates on a Cash on Delivery basis with no online payment gateway integrated.
- Notifications are derived from order status changes rather than stored as a separate notification log.
- Product images are served as static files from the frontend's `public/` folder rather than uploaded through an admin interface or cloud storage.

---

## Roadmap

- Online payment gateway integration
- Cloud-based image upload for product management
- SMS notifications alongside email
- Customer reviews and ratings per product

---

## License

This project is privately developed for The Three Loom. All rights reserved.
