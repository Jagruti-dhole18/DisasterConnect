import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import reliefCampRoutes from './routes/reliefCampRoutes.js';
import missingPersonRoutes from './routes/missingPersonRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import disasterAlertRoutes from './routes/disasterAlertRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });
connectDB();

const app = express();
app.set('trust proxy', true);
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL].filter(Boolean),
  credentials: true,
}));
app.use(hpp());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DisasterConnect API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/relief-camps', reliefCampRoutes);
app.use('/api/missing-persons', missingPersonRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/alerts', disasterAlertRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Socket.io
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('join', (userId) => {
    socket.join(userId);
  });
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`DisasterConnect server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

export { io };
