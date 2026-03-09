import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Global Middleware ──────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://mern-task-dashboard.vercel.app',
    'https://mern-task-dashboard-git-main-adityayanare24s-projects.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());       // Parse incoming JSON bodies
app.use(express.urlencoded({ extended: true }));

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', environment: process.env.NODE_ENV });
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
});

// ── Global Error Handler (must be last!) ───────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});