import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/register', (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'INVALID_INPUT', details: parse.error.flatten() });
  const { email, password } = parse.data;
  const hash = bcrypt.hashSync(password, 10);
  try {
    const user = db.createUser(email, hash);
    res.json({ id: user.id, email: user.email, createdAt: user.createdAt });
  } catch (e: any) {
    if (e.message === 'EMAIL_IN_USE') return res.status(409).json({ error: 'EMAIL_IN_USE' });
    return res.status(500).json({ error: 'UNKNOWN' });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/login', (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'INVALID_INPUT', details: parse.error.flatten() });
  const { email, password } = parse.data;
  const user = db.findUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'change-me', { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email } });
});

export default router;
