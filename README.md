# DisasterConnect — Community Disaster Response Platform

A production-quality, full-stack web application that connects citizens, volunteers, NGOs, and administrators during disaster emergencies. Built with React (Vite) on the frontend and Node.js/Express/MongoDB on the backend.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20Express%20%2B%20MongoDB-red)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication & Security](#authentication--security)
- [Deployment Guide](#deployment-guide)
- [Demo Accounts](#demo-accounts)

---

## Overview

DisasterConnect is a community-driven disaster response platform designed to save lives during emergencies. It enables citizens to request help (SOS, food, water, medicine), volunteers to respond to those requests, NGOs to manage relief camps and resources, and administrators to oversee the entire operation with analytics and verification tools.

### User Roles

| Role | Capabilities |
|------|-------------|
| **Citizen** | Emergency SOS, request food/water/medicine, view relief camps, report missing persons, track requests, receive notifications |
| **Volunteer** | Accept emergency requests, navigate to citizens, toggle availability, earn reward points, view mission history |
| **NGO** | Manage relief camps, coordinate volunteers, track donations, manage food/medical distribution |
| **Admin** | Dashboard analytics, verify volunteers, approve NGOs, manage users, publish disaster alerts, view reports |

---

## Features

### Core Modules
- **Emergency SOS** — One-tap SOS with live geolocation broadcast to nearby volunteers
- **Interactive Maps** — Leaflet-powered maps showing relief camps, volunteers, and disaster zones
- **Real-Time Notifications** — Socket.io powered instant updates
- **Missing Person Portal** — Report and search for missing persons with photos and locations
- **Resource Requests** — Food, water, and medicine requests with priority levels
- **Volunteer Verification** — Admin-verified volunteer system with skill matching
- **Reward System** — Points and ranks for volunteers based on completed missions
- **Donation Tracking** — NGOs can record and track donations
- **Disaster Alerts** — Admin-published alerts with severity levels and affected areas
- **Dark Mode** — Full dark mode support across the entire application
- **Responsive Design** — Optimized for mobile, tablet, and desktop

### Frontend Highlights
- Framer Motion animations and micro-interactions
- Glassmorphism UI with professional color palette
- Loading skeletons, toast notifications, empty states
- Custom 404 page and error handling
- Role-based protected routes

### Backend Highlights
- RESTful API with controllers, routes, middleware, services
- JWT authentication with refresh tokens
- Helmet, CORS, rate limiting, XSS protection, HPP
- Input validation with express-validator
- Cloudinary image uploads via Multer
- Nodemailer for transactional emails
- Socket.io for real-time communication
- Pagination, filtering, and search on all list endpoints

---

## Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Tailwind CSS
- Framer Motion
- React Hook Form + Zod
- Leaflet Maps (react-leaflet)
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt (password hashing)
- Multer + Cloudinary (image uploads)
- Socket.io (real-time)
- Nodemailer (emails)
- Helmet, express-rate-limit, xss-clean, hpp (security)

---

## Folder Structure

```
disasterconnect/
├── client/                          # Frontend (this Vite project)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   └── ui/
│   │   │       ├── Badges.tsx
│   │   │       ├── Feedback.tsx
│   │   │       ├── MapView.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── RequestCard.tsx
│   │   │       └── SOSButton.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── data/
│   │   │   ├── seed.ts
│   │   │   └── store.ts
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── citizen/
│   │   │   ├── volunteer/
│   │   │   ├── ngo/
│   │   │   ├── admin/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   ├── ReliefCampsPage.tsx
│   │   │   ├── MissingPersonsPage.tsx
│   │   │   ├── AlertsPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── server/                         # Backend (Express + MongoDB)
│   ├── config/
│   │   ├── db.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── requestController.js
│   │   ├── volunteerController.js
│   │   ├── reliefCampController.js
│   │   ├── missingPersonController.js
│   │   ├── donationController.js
│   │   ├── notificationController.js
│   │   ├── disasterAlertController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── error.js
│   │   ├── rateLimiter.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Request.js
│   │   ├── Volunteer.js
│   │   ├── ReliefCamp.js
│   │   ├── MissingPerson.js
│   │   ├── Donation.js
│   │   ├── Notification.js
│   │   ├── DisasterAlert.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── volunteerRoutes.js
│   │   ├── reliefCampRoutes.js
│   │   ├── missingPersonRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── disasterAlertRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── utils/
│   │   └── seed.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Installation Guide

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/disasterconnect.git
cd disasterconnect
```

### 2. Frontend Setup
```bash
cd client
npm install
```

### 3. Backend Setup
```bash
cd server
npm install
```

### 4. Configure Environment Variables
Copy the example env file and fill in your credentials:
```bash
cp server/.env.example server/.env
```

### 5. Seed the Database
```bash
cd server
npm run seed
```

### 6. Run the Application

**Backend** (from `server/`):
```bash
npm run dev
```
Server runs on `http://localhost:5000`

**Frontend** (from `client/`):
```bash
npm run dev
```
Client runs on `http://localhost:5173`

---

## Environment Variables

### Server (`server/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/disasterconnect` |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRE` | Token expiry | `7d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | — |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | — |
| `CLOUDINARY_API_KEY` | Cloudinary API key | — |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | — |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email account | — |
| `EMAIL_PASS` | Email app password | — |
| `EMAIL_FROM` | From address | — |

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/refresh-token` | Refresh access token | Public |
| POST | `/auth/forgot-password` | Send password reset email | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |
| POST | `/auth/verify-email` | Verify email with token | Public |
| GET | `/auth/me` | Get current user profile | Auth |
| PUT | `/auth/me` | Update profile | Auth |

### Requests
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/requests` | List requests (filter, search, paginate) | Auth |
| POST | `/requests` | Create a new request | Citizen |
| GET | `/requests/:id` | Get single request | Auth |
| PUT | `/requests/:id` | Update request status / assign | Auth |
| GET | `/requests/citizen/me` | Get citizen's own requests | Citizen |
| GET | `/requests/volunteer/me` | Get volunteer's missions | Volunteer |

**Query Parameters for GET `/requests`:**
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 20)
- `type` — Filter by type: `sos`, `food`, `water`, `medicine`
- `status` — Filter by status: `pending`, `accepted`, `in_progress`, `resolved`, `cancelled`
- `priority` — Filter by priority: `low`, `medium`, `high`, `critical`
- `search` — Search description text

### Volunteers
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/volunteers` | List volunteers | Auth |
| GET | `/volunteers/:id` | Get volunteer details | Auth |
| PUT | `/volunteers/me` | Update availability/skills | Volunteer |
| PUT | `/volunteers/:id/verify` | Verify a volunteer | Admin |

### Relief Camps
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/relief-camps` | List camps (public) | Public |
| GET | `/relief-camps/:id` | Get camp details | Public |
| POST | `/relief-camps` | Create camp | NGO/Admin |
| PUT | `/relief-camps/:id` | Update camp | NGO/Admin |
| DELETE | `/relief-camps/:id` | Delete camp | NGO/Admin |

### Missing Persons
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/missing-persons` | List missing persons | Public |
| GET | `/missing-persons/:id` | Get details | Public |
| POST | `/missing-persons` | Report missing person | Auth |
| PUT | `/missing-persons/:id` | Update status | Auth |

### Donations
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/donations` | List donations | Auth |
| POST | `/donations` | Create donation | Auth |

### Notifications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/notifications` | Get user notifications | Auth |
| PUT | `/notifications/:id/read` | Mark as read | Auth |
| PUT | `/notifications/mark-all-read` | Mark all as read | Auth |

### Disaster Alerts
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/alerts` | List alerts | Public |
| POST | `/alerts` | Create alert | Admin |
| PUT | `/alerts/:id` | Update alert | Admin |
| DELETE | `/alerts/:id` | Delete alert | Admin |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/admin/users` | List all users | Admin |
| DELETE | `/admin/users/:id` | Delete user | Admin |
| PUT | `/admin/ngos/:id/approve` | Approve NGO | Admin |
| GET | `/admin/pending-approvals` | Get pending approvals | Admin |
| GET | `/admin/analytics` | Get platform analytics | Admin |

---

## Database Models

### User
```
name, email, password (hashed), role, phone, avatar, location,
isVerified, emailVerified, emailVerificationToken, passwordResetToken,
volunteerProfile { skills, availability, rewardPoints, missionsCompleted, verified, rating },
ngoProfile { organizationName, registrationId, approved, description }
```

### Request (SOS, Food, Water, Medicine)
```
type, citizen (ref), citizenName, status, priority, description,
location { lat, lng, address }, peopleCount, assignedVolunteer (ref),
assignedVolunteerName, image, resolvedAt
```

### Volunteer
```
user (ref), name, skills[], availability, location, rewardPoints,
missionsCompleted, verified, rating
```

### ReliefCamp
```
name, ngo (ref), ngoName, location { lat, lng, address },
capacity, occupants, foodStock, waterStock, medicineStock,
medicalSupport, status
```

### MissingPerson
```
name, age, gender, lastSeenLocation, lastSeenDate, description,
photo, reportedBy (ref), reportedByName, status
```

### Donation
```
donor (ref), donorName, ngo (ref), ngoName, amount, purpose, status
```

### Notification
```
user (ref), title, message, type, read, link
```

### DisasterAlert
```
title, type, severity, location, description, affectedAreas[],
active, createdBy (ref)
```

### Message
```
sender (ref), senderName, recipient (ref), content, read
```

---

## Authentication & Security

- **JWT Authentication** — Access tokens (7d) + refresh tokens (30d)
- **Password Hashing** — bcrypt with 10-round salt
- **Helmet** — Secure HTTP headers
- **CORS** — Configured for client origin
- **Rate Limiting** — 100 req/15min general, 10 req/15min auth
- **XSS Protection** — xss-clean middleware
- **HTTP Parameter Pollution** — hpp middleware
- **Input Validation** — express-validator + Mongoose schema validation
- **Input Sanitization** — Mongoose built-in
- **Protected Routes** — Role-based access control middleware
- **Email Verification** — Token-based email verification on registration
- **Password Reset** — Token-based reset with expiry

---

## Deployment Guide

### Frontend (Vercel / Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist/` folder
3. Set environment variable `VITE_API_URL` to your backend URL

### Backend (Render / Railway / DigitalOcean)
1. Set all environment variables in your hosting dashboard
2. Ensure MongoDB is accessible (use MongoDB Atlas for production)
3. Start command: `npm start`
4. Health check endpoint: `GET /api/health`

### MongoDB (Atlas)
1. Create a free cluster at mongodb.com/atlas
2. Whitelist your server IP
3. Create a database user
4. Copy the connection string to `MONGO_URI`

### Docker (Optional)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---


## License

MIT License — Built for communities in crisis.
