// Security WebApp Server - Updated 2025-12-22
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/api';
import { errorHandler } from './middleware/error-handler';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configurazione CORS dinamica
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

// In production, accetta richieste dalla stessa origine
if (process.env.NODE_ENV === 'production') {
  corsOrigins.push('https://security-webapp-s6o9.onrender.com');
}

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:", "http:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}));

app.use(cors({
  origin: corsOrigins,
  credentials: true
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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../../frontend/dist');

  // Serve static assets
  app.use(express.static(frontendDistPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

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
