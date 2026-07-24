# 🏨 Hotel & Resort Booking Engine

A full-stack MERN application for managing hotel and resort reservations — room availability, promotional discounts, dining add-ons, and guest billing, with dedicated experiences for Guests, Managers, and Admins.

## 🔗 Live Links

- **Frontend (Live Site):**  https://hotel-booking-engine-app.vercel.app
- **Backend (API):** https://hotel-booking-engine-mj7j.onrender.com
- **GitHub Repository:** https://github.com/tejasri-rayudu/hotel-booking-engine

> Note: the backend is hosted on Render's free tier, which "sleeps" after inactivity. The first request after a period of idle time may take 30–60 seconds to respond while it wakes up.

## 🧪 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Guest | johnguest@example.com | password123 |
| Manager | testguest@example.com | password123 |
| Admin | tejasrirayudu01@gmail.com | (set at registration) |

## 📌 Problem Statement

- Manual and error-prone tracking of hotel room bookings and availability status.
- Difficulty managing guest preferences, room dining selections, and promotional add-on services.
- Inefficient check-in and check-out workflows causing long front-desk wait times.
- Lack of real-time occupancy statistics and revenue analytics dashboards.

## 🛠️ Tech Stack

**Frontend:** React (Vite), React Router, Axios, Chart.js
**Backend:** Node.js, Express.js, JWT Authentication, bcrypt, Multer, PDFKit
**Database:** MongoDB (Mongoose ODM), hosted on MongoDB Atlas
**Deployment:** Vercel (frontend), Render (backend)

## ✨ Features

### Authentication & Roles
- JWT-based authentication with bcrypt password hashing
- Three distinct roles — Guest, Manager, Admin — each with isolated dashboards and permissions
- Frontend and backend route protection based on role

### Guest
- Browse rooms with search & filter (price, capacity, category)
- Book rooms with real-time date-overlap prevention (no double-bookings)
- View dining & extras (spa, transport, laundry, dining add-ons)
- Manage bookings — view, cancel, and track status
- Download PDF invoices/receipts for any booking
- Manage profile & dining preferences

### Manager
- Room inventory management (create, edit, delete rooms)
- Upload room photos (Multer image upload)
- Star ratings per room
- Reception console — confirm bookings, check guests in/out
- Occupancy dashboard with live stats
- Revenue & booking reports with interactive charts (Chart.js — bar & doughnut)

### Admin
- Platform-wide earnings dashboard with revenue-over-time chart
- Branch management
- Activity logs (audit trail of key actions)
- Global settings (hotel name, tax rate)

### Core Engineering Highlights
- **Booking overlap prevention:** server-side date-range collision detection ensures a room can never be double-booked
- **Automatic invoice generation:** room charges + service charges + tax − discount calculated server-side
- **Real PDF generation:** PDFKit renders a downloadable receipt per booking
- **Image uploads:** Multer handles multi-file room photo uploads, served statically
- **Role-based access control:** enforced at both the API (Express middleware) and UI (protected routes) layers

## 🗄️ Database Collections

| Collection | Purpose |
|---|---|
| `Users` | Guests, Managers, Admins — auth + profile data |
| `Rooms` | Room inventory, pricing, features, images, ratings |
| `Bookings` | Reservations linking a Guest to a Room with dates/status |
| `Services` | Dining, spa, transport, and other add-ons |
| `Invoices` | Generated billing records tied to bookings |
| `Logs` | Activity/audit trail for admin diagnostics |

**Key relationships:** `User → Bookings` (one-to-many), `Room → Bookings` (one-to-many), `Booking → Invoice` (one-to-one), `Booking → Services` (many-to-many)

## 📂 Project Structure

hotel-booking-engine/
├── server/                 Express + MongoDB backend
│   ├── controllers/        Business logic (auth, rooms, bookings, services, invoices, logs)
│   ├── middleware/         JWT auth, role authorization, Multer upload config
│   ├── models/             Mongoose schemas
│   ├── routes/             Express route definitions
│   ├── utils/               PDF invoice generator
│   ├── uploads/              Room images & generated invoice PDFs
│   └── server.js
└── src/                    React frontend
    ├── pages/
    │   ├── public/           Home, Rooms, About, Login, Register
    │   ├── guest/             Dashboard, BookRoom, MyBookings, Dining, Profile
    │   ├── manager/           Dashboard, Inventory, Reception, Reports
    │   └── admin/             Dashboard, Branches, Logs, Settings
    ├── components/           Navbar, ProtectedRoute, StarRating
    ├── context/               AuthContext (JWT/session state)
    └── services/api.js        Axios instance with auto token attachment

## ⚙️ Running Locally

### Prerequisites
- Node.js installed
- A MongoDB Atlas connection string (or local MongoDB)

### 1. Clone the repository
git clone https://github.com/tejasri-rayudu/hotel-booking-engine.git
cd hotel-booking-engine

### 2. Backend setup
cd server
npm install

Create a `.env` file inside `server/`:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start the backend:
npm run dev

Runs on `http://localhost:5000`

### 3. Frontend setup
From the project root:
npm install

Create a `.env` file in the root:
VITE_API_URL=http://localhost:5000/api

Start the frontend:
npm run dev

Runs on `http://localhost:5173`

## 📡 API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new guest | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/rooms` | List/search rooms | Public |
| POST | `/api/rooms` | Create a room | Manager/Admin |
| POST | `/api/rooms/:id/images` | Upload room photos | Manager/Admin |
| POST | `/api/bookings` | Create a booking | Guest |
| GET | `/api/bookings/my` | Guest's own bookings | Guest |
| GET | `/api/bookings` | All bookings | Manager/Admin |
| PUT | `/api/bookings/:id/status` | Check-in/check-out | Manager/Admin |
| GET | `/api/services` | List dining/extras | Public |
| POST | `/api/invoices/:bookingId` | Generate invoice + PDF | Guest/Manager/Admin |
| GET | `/api/invoices/:id/download` | Download PDF invoice | Guest/Manager/Admin |
| GET | `/api/logs` | Activity logs | Admin |

Full request/response details are available in the Postman collection (see submission materials).

## 🚀 Bonus Features Implemented
- ✅ Interactive occupancy & revenue charts (Chart.js)
- ✅ PDF invoice/receipt generation (PDFKit)
- ✅ Room photo upload (Multer)
- ✅ Star rating system for rooms
- ✅ Animated, responsive UI with a custom design system

## 👤 Author
Tejasri Rayudu