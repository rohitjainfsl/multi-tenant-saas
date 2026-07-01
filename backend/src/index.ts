import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import mlRoutes from './routes/ml.routes.js';

const app = express();
const PORT = process.env.PORT ?? 5000;



// Support multiple allowed origins via a comma-separated env var.
// Azure deployments commonly use *.azurestaticapps.net and *.azurewebsites.net hosts.
const configuredOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173,https://thankful-bush-02341a000.azurestaticapps.net')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return true;

  if (configuredOrigins.includes(origin)) return true;

  return /https:\/\/.*\.azurestaticapps\.net$/i.test(origin) || /https:\/\/.*\.azurewebsites\.net$/i.test(origin);
};

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true, // Required for cookies to be sent cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  })
);

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/ml', mlRoutes);
app.use('/api/ml', mlRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Start Server ────────────────────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Accepting requests from: ${configuredOrigins.join(', ')}`);
  });
};

startServer();
