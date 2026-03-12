# 📋 MERN Task Dashboard

A full-stack, production-ready Task Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js).

![Task Dashboard](https://img.shields.io/badge/MERN-Stack-amber?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

---

## 🚀 Features

- **JWT Authentication** — Secure register/login with bcrypt password hashing
- **Full CRUD** — Create, Read, Update, Delete tasks
- **Kanban Board** — Drag and drop tasks between Todo, In Progress, Completed columns
- **Search & Filter** — Live search by title/description, filter by status and priority
- **Sort Tasks** — Sort by newest, oldest, due date, or priority
- **Stats Dashboard** — Real-time task counts by status
- **Email Notifications** — Welcome email, task created, task completed emails via Gmail
- **Protected Routes** — JWT-based route guards on both frontend and backend
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Industrial UI** — Custom Tailwind CSS design with amber accents

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Nodemailer | Email notifications |
| dotenv | Environment variables |
| nodemon | Development auto-restart |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool |
| Redux Toolkit | State management |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS v3 | Styling |
| @hello-pangea/dnd | Drag and drop |

---

## 📁 Project Structure

```
mern-task-dashboard/
│
├── server/                          # Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register, Login logic
│   │   └── taskController.js        # CRUD for tasks
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── errorMiddleware.js       # Global error handler
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Task.js                  # Task schema
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── taskRoutes.js            # Task endpoints
│   ├── utils/
│   │   └── emailService.js          # Nodemailer email functions
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── server.js                    # Entry point
│
└── client/                          # Frontend
    ├── src/
    │   ├── app/
    │   │   └── store.js             # Redux store
    │   ├── components/
    │   │   ├── layout/
    │   │   │   └── Navbar.jsx
    │   │   ├── tasks/
    │   │   │   ├── TaskCard.jsx
    │   │   │   ├── TaskForm.jsx
    │   │   │   └── TaskList.jsx
    │   │   └── ui/
    │   │       ├── Modal.jsx
    │   │       └── Spinner.jsx
    │   ├── features/
    │   │   ├── auth/
    │   │   │   └── authSlice.js
    │   │   └── tasks/
    │   │       └── taskSlice.js
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   └── api.js               # Axios instance
    │   └── utils/
    │       └── PrivateRoute.jsx
    ├── .env
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org) v20+ or v22+
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) v7+
- [Git](https://git-scm.com)
- A Gmail account with App Password enabled

---

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mern-task-dashboard.git
cd mern-task-dashboard
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Project

You need **3 terminals** open simultaneously:

### Terminal 1 — Start MongoDB

```bash
mongod --dbpath "C:\data\db"
```

### Terminal 2 — Start Backend

```bash
cd server
npm run dev
```

Expected output:
```
🚀 Server running in development mode on port 5000
✅ MongoDB Connected: localhost
```

### Terminal 3 — Start Frontend

```bash
cd client
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Open in browser

```
http://localhost:5173
```

---

## 📡 API Reference

### Auth Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create new account |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | Private | Get current user |

### Task Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/tasks` | Private | Get all tasks |
| POST | `/api/tasks` | Private | Create a task |
| PUT | `/api/tasks/:id` | Private | Update a task |
| DELETE | `/api/tasks/:id` | Private | Delete a task |
| GET | `/api/tasks/stats` | Private | Get task statistics |

### Query Parameters

```
GET /api/tasks?status=todo&priority=high
```

| Parameter | Values |
|---|---|
| `status` | `todo`, `in-progress`, `completed` |
| `priority` | `low`, `medium`, `high` |

---

## 📧 Email Notifications Setup

### Step 1 — Enable 2-Step Verification
Go to: https://myaccount.google.com/security

### Step 2 — Generate App Password
Go to: https://myaccount.google.com/apppasswords

1. Type app name: `TaskBoard`
2. Click **Create**
3. Copy the 16-character password

### Step 3 — Add to `.env`

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

### Email triggers

| Event | Email |
|---|---|
| User registers | 👋 Welcome to TaskBoard! |
| Task created | ✅ New Task Created |
| Task completed | 🎉 Task Completed! |

---

## 🌐 Deployment

### Backend — Render

1. Push your code to GitHub
2. Go to [https://render.com](https://render.com) and create a new account or log in
3. Click **New → Web Service**
4. Connect your GitHub repository and select the repo
5. Configure the service:
   - **Name:** `mern-task-dashboard-api` (or any name)
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Click **Create Web Service**

Set environment variables in the Render dashboard under **Environment**:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
```

Your backend will be live at: `https://your-app-name.onrender.com`

### Frontend — Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel
```

Set `VITE_API_URL` to your Railway backend URL.

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens expire after **7 days**
- All task routes protected with **JWT middleware**
- Users can only access **their own tasks**
- CORS configured for specific origins
- Environment variables for all secrets

---

## 🧪 Testing the App

| Action | Expected Result |
|---|---|
| Register new account | Redirected to dashboard + welcome email |
| Login with wrong password | Error message shown |
| Create a task | Task appears in list + email received |
| Drag task to different column | Status updates automatically |
| Mark task complete | Stats update + email received |
| Logout and visit /dashboard | Redirected to login |
| Search for a task | Filters results in real time |

---

## 📱 Screenshots

### Login Page
- Dark industrial design with amber accents
- DM Mono + Syne typography

### Dashboard
- Stats cards showing task counts
- Kanban board with drag and drop
- Search, filter, and sort controls

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Aditya Yenare**
- GitHub: [@yenareditya321](https://github.com/yenareditya321)
- Email: yenareditya321@gmail.com

---

## 🙏 Acknowledgments

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [Railway](https://railway.app) for backend deployment
- [Vercel](https://vercel.com) for frontend deployment
- [Nodemailer](https://nodemailer.com) for email service
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag and drop

---

*Built with ❤️ using the MERN Stack*
