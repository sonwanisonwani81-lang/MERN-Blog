# 📝 MERN Blog Management System

A full-stack blog platform built with **MongoDB, Express.js, React.js, and Node.js** featuring a complete blog approval workflow. Users can create blogs, admin can approve or reject them, and everyone can read and comment on approved content.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Setup](#-project-setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Test Credentials](#-test-credentials)
- [Security](#-security)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router 7, Axios, Tailwind CSS 4 |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB, Mongoose 9 |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **Development** | Vite, Nodemon |

---

## ✨ Features

- ✅ **User Authentication** — Register and login with JWT tokens
- ✅ **Blog CRUD** — Create, read, update, and delete blogs
- ✅ **Admin Approval System** — Pending → Approved/Rejected workflow
- ✅ **Comments** — Logged-in users can comment on approved blogs
- ✅ **Search & Pagination** — Search blogs by title with paginated results
- ✅ **Role-Based Access** — Regular users vs admin permissions
- ✅ **Responsive Design** — Mobile-first UI with Tailwind CSS
- ✅ **Skeleton Loading** — Smooth loading states with animated skeletons
- ✅ **Error Handling** — Global error handler with proper HTTP status codes
- ✅ **Input Validation** — Email format, password length, and field validation

---

## 🔧 Project Setup

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/en/download))
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mern-blog.git
cd mern-blog

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🌍 Environment Variables

Create a `.env` file in the `backend/` folder by copying the example:

```bash
cd backend
copy .env.example .env   # Windows
cp .env.example .env      # Mac/Linux
```

### Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/mern-blog` |
| `JWT_SECRET` | Secret key for JWT token signing | *(must be changed in production)* |
| `PORT` | Backend server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

**Example `.env` file:**

```env
MONGO_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=your_secure_random_secret_key_here
PORT=5000
```

---

## 🚀 Running the Application

### 1. Seed the Database (Optional — Creates Sample Data)

```bash
cd backend
node seed.js
```

This creates 4 users, 6 blogs with different statuses, and 16 comments for testing.

### 2. Start the Backend Server (Terminal 1)

```bash
cd backend
npm run dev
```

Server starts at **http://localhost:5000**

### 3. Start the Frontend Server (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend starts at **http://localhost:5173**

### 4. Open in Browser

Navigate to **http://localhost:5173** to see the application.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth | Request Body |
|--------|----------|-------------|------|-------------|
| `POST` | `/api/auth/register` | Register a new user | ❌ | `{ name, email, password }` |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ | `{ email, password }` |

### Blog Management (User — Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/blog/create` | Create a new blog (status: pending) |
| `GET` | `/api/blog/myblogs` | Get all blogs by the logged-in user |
| `PUT` | `/api/blog/update/:id` | Update own blog |
| `DELETE` | `/api/blog/delete/:id` | Delete own blog |

### Public Blog Routes

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|-----------------|
| `GET` | `/api/blog/public` | Get approved blogs | `?search=&page=1&limit=6` |
| `GET` | `/api/blog/:id` | Get single blog with comments | — |

### Admin Routes (Requires Admin Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/pending` | Get all pending blogs |
| `PUT` | `/api/admin/approve/:id` | Approve a blog |
| `PUT` | `/api/admin/reject/:id` | Reject a blog |

### Comments (Requires JWT for POST)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/blog/:id/comment` | Add a comment to a blog | ✅ |

---

### 📌 Example API Requests

#### Register a User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a1b2c3d4e5f6...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Create a Blog (Authenticated)
```bash
POST /api/blog/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog",
  "content": "This is the content of my blog post..."
}
```

#### Get Approved Blogs (Public)
```bash
GET /api/blog/public?search=react&page=1&limit=6
```

#### Approve a Blog (Admin Only)
```bash
PUT /api/admin/approve/64a1b2c3d4e5f6...
Authorization: Bearer <admin_token>
```

#### Add a Comment (Authenticated)
```bash
POST /api/blog/64a1b2c3d4e5f6.../comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great article! Very helpful."
}
```

---

## 📁 Project Structure

```
mern-blog/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Register & login logic
│   │   └── blogController.js       # Blog CRUD + comments + admin actions
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification & admin role check
│   ├── models/
│   │   ├── User.js                 # User schema with bcrypt hashing
│   │   └── Blog.js                 # Blog schema with embedded comments + indexes
│   ├── routes/
│   │   ├── authRoutes.js           # POST /api/auth/register, /login
│   │   ├── blogRoutesV2.js         # Blog & comment API routes
│   │   └── adminRoutes.js          # Admin approval routes
│   ├── .env                        # Environment variables (not committed)
│   ├── .env.example                # Environment variable template
│   ├── server.js                   # Express app entry point
│   └── seed.js                     # Database seeder with sample data
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation with glassmorphism
│   │   │   ├── BlogCard.jsx        # Blog card with hover effects
│   │   │   ├── ProtectedRoute.jsx  # Auth guard component
│   │   │   ├── PageTransition.jsx  # Smooth page transitions
│   │   │   ├── SkeletonCard.jsx    # Loading skeleton component
│   │   │   └── ScrollToTop.jsx     # Scroll-to-top button
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Blog listing with search & pagination
│   │   │   ├── Login.jsx           # Login form
│   │   │   ├── Register.jsx        # Registration form
│   │   │   ├── Dashboard.jsx       # User's blog dashboard
│   │   │   ├── CreateBlog.jsx      # Blog creation form
│   │   │   ├── EditBlog.jsx        # Blog edit form
│   │   │   ├── BlogDetail.jsx      # Full blog view + comments
│   │   │   └── AdminPanel.jsx      # Admin approval panel
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   ├── services/
│   │   │   ├── authService.js      # Auth API service
│   │   │   └── blogService.js      # Blog API service
│   │   ├── utils/
│   │   │   └── axios.js            # Axios instance with interceptors
│   │   ├── App.jsx                 # Route definitions
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles + animations
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docs/
│   ├── api.md                      # Detailed API documentation
│   ├── credentials.md              # Test credentials
│   ├── data.md                     # Complete demo data
│   └── setup.md                    # Detailed setup guide
│
└── README.md
```

---

## 🔄 How It Works

```
1. User visits site      → Sees approved blogs on Home page
2. User registers        → Account created with hashed password
3. User logs in          → JWT token saved in localStorage
4. User creates blog     → Blog saved with status "pending"
5. Admin reviews         → Sees pending blogs in Admin Panel
6. Admin approves        → Blog status changed to "approved"
     OR rejects          → Blog status changed to "rejected"
7. Approved blog         → Visible on Home page for everyone
8. Users can comment     → On any approved blog (must be logged in)
```

### Blog Status Lifecycle

```
Created → Pending (⏳) → Approved (✅) → Visible Publicly
                       → Rejected (❌) → Private
```
---

## 🔒 Security

- **Password Hashing** — All passwords hashed with bcrypt (salt rounds: 10)
- **JWT Authentication** — Stateless tokens with 1-day expiration
- **Role-Based Access** — Admin routes protected with role middleware
- **Input Validation** — Email format, password length, and required fields validated
- **Global Error Handler** — Centralized error handling with proper HTTP status codes
- **401 Auto-Redirect** — Expired tokens trigger automatic logout and redirect
- **Axios Interceptors** — Token automatically attached to every request

---

## 📄 License

This project is for educational purposes as part of a MERN Stack evaluation.

---

<p align="center">Built with ❤️ using the MERN Stack</p>
