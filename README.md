# 🛍️ Market

**Market** is a modern full-stack e-commerce app built with Node.js, React, PostgreSQL, and Tailwind CSS.

## 🚀 Features

### 🧑‍💼 Authentication
- JWT-based login/register
- Role-based access (`admin`, `user`)

### 🛒 Product Management
- Browse, search, and filter products
- Admin: create, edit, delete products (with image upload)

### 📊 Admin Dashboard
- Total users, products, fake orders
- Highlights newest product
- User management (edit/delete)

### 🛍️ Cart & Checkout
- Persistent cart with local storage
- Checkout form and summary

## 🧰 Tech Stack

| Frontend       | Backend        | Database   | DevOps        |
|----------------|----------------|------------|---------------|
| React + TS     | Node.js + Express | PostgreSQL | Docker + Prisma |
| Tailwind CSS   | JWT Auth       | Prisma ORM | Render + Vercel |

## 🧑‍💻 Local Setup

```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/me-commerce-app.git
cd market

# Backend
cd backend
cp .env.example .env
docker-compose up -d
npx prisma migrate dev --name init
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
