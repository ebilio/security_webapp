// Security WebApp Server - Updated 2025-12-21 18:22
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { errorHandler } from './middleware/error-handler';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minuti
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
});

app.use('/api', limiter);

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('scan:start', async () => {
    try {
      // Emetti eventi di progresso durante la scansione
      socket.emit('scan:progress', {
        stage: 'system-info',
        progress: 25,
        message: 'Raccolta informazioni di sistema...'
      });

      // Simula progresso (in una versione completa, questi sarebbero eventi reali)
      setTimeout(() => {
        socket.emit('scan:progress', {
          stage: 'security-assessment',
          progress: 50,
          message: 'Valutazione sicurezza...'
        });
      }, 1000);

      setTimeout(() => {
        socket.emit('scan:progress', {
          stage: 'rating-calculation',
          progress: 75,
          message: 'Calcolo rating...'
        });
      }, 2000);

      setTimeout(() => {
        socket.emit('scan:progress', {
          stage: 'complete',
          progress: 100,
          message: 'Scansione completata!'
        });
        socket.emit('scan:complete', {});
      }, 3000);
    } catch (error) {
      console.error('Scan error:', error);
      socket.emit('scan:error', { message: 'Errore durante la scansione' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`
🚀 Security Assessment Server running!
📡 HTTP: http://localhost:${PORT}
🔌 WebSocket: ws://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});
