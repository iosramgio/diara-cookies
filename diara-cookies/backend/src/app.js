import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connection.js';
import { seedAdminUser } from './db/seed.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import bankReconRoutes from './routes/bankReconRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Seed admin user
seedAdminUser();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/recon', bankReconRoutes);
app.use('/api/admin', productRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Diara Cookies API' });
});

export default app;