import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'express';
import authRouter from './routes/auth.js';
import serversRouter from './routes/servers.js';

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'orbix-backend' });
});

app.use('/auth', authRouter);
app.use('/servers', serversRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
