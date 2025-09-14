import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';
import { db } from '../db.js';

const router = Router();

router.get('/', requireAuth, (req: AuthRequest, res) => {
  const servers = db.getServersByUser(req.userId!);
  res.json(servers);
});

const createSchema = z.object({
  name: z.string().min(2).max(32),
  game: z.string().default('minecraft'),
  ramMb: z.number().int().min(256).max(32768),
  cpuPct: z.number().int().min(10).max(400)
});

router.post('/', requireAuth, (req: AuthRequest, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'INVALID_INPUT', details: parse.error.flatten() });
  const { name, game, ramMb, cpuPct } = parse.data;
  const server = db.createServer(req.userId!, name, game, ramMb, cpuPct);
  res.json(server);
});

router.post('/:id/start', requireAuth, (req: AuthRequest, res) => {
  const s = db.updateServerStatus(req.userId!, req.params.id, 'starting');
  if (!s) return res.status(404).json({ error: 'NOT_FOUND' });
  // TODO: signal agent to start container; here we just simulate
  const started = db.updateServerStatus(req.userId!, req.params.id, 'running');
  res.json(started);
});

router.post('/:id/stop', requireAuth, (req: AuthRequest, res) => {
  const s = db.updateServerStatus(req.userId!, req.params.id, 'stopping');
  if (!s) return res.status(404).json({ error: 'NOT_FOUND' });
  const stopped = db.updateServerStatus(req.userId!, req.params.id, 'stopped');
  res.json(stopped);
});

router.post('/:id/restart', requireAuth, (req: AuthRequest, res) => {
  const s = db.updateServerStatus(req.userId!, req.params.id, 'restarting');
  if (!s) return res.status(404).json({ error: 'NOT_FOUND' });
  const running = db.updateServerStatus(req.userId!, req.params.id, 'running');
  res.json(running);
});

export default router;
