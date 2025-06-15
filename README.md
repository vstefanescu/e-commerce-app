🛍️ Market
Market is a full-stack e-commerce application built with modern technologies like Node.js, Express, PostgreSQL, Prisma, React, and Tailwind CSS. It includes authentication, admin management tools, product uploads, and a shopping cart experience.

🚀 Features

🧑‍💼 Authentication
JWT-based login/register system

Role-based access (admin & user)

Profile view for logged-in users

🛒 Products
Browse paginated & searchable products

Admin can create, edit, and delete products via modal interface

Image upload with drag-and-drop

Product images are stored locally (in uploads/)

📊 Admin Dashboard
Overview of total users, products, and orders (mocked)

Highlights newest product

User management (edit/delete users)

Product management with live feedback

🛍️ Cart & Checkout
Add and remove products from cart

Cart persists in local storage

Simple checkout screen

🧰 Tech Stack
Frontend
React + TypeScript

Tailwind CSS

React Router

Redux Toolkit (optional for future scaling)

Backend
Node.js + Express

PostgreSQL + Prisma ORM

JWT authentication

File upload with multer

DevOps
Docker support for backend and database

Frontend deployed on Vercel

Backend deployed on Render

🧑‍💻 Local Development
1. Clone & install
bash
Copy
Edit
git clone https://github.com/your-username/market.git
cd market
2. Backend
bash
Copy
Edit
cd backend
cp .env.example .env # Fill in your DATABASE_URL
docker-compose up -d
npx prisma generate
npx prisma migrate dev --name init
npm run dev
3. Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev
📁 Project Structure
arduino
Copy
Edit
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   ├── uploads/ ← image uploads saved here
│   └── prisma/
├── frontend/
│   ├── pages/
│   ├── components/
│   └── lib/
🧪 Future Improvements
Real orders system with Stripe or PayPal

Product reviews

Pagination in admin panel

Better error handling & validation

📜 License
This project is open-source and free to use under the MIT License.
