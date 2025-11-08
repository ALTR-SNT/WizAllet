import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth'; 

const prisma = new PrismaClient();
const router: express.Router = express.Router();


router.get('/users', verifyToken, async (req: Request, res: Response) => {
  const users = await prisma.users.findMany({
    select: { id: true, username: true, email: true, created_at: true, initial_balance: true },
  });
  res.json(users);
});


router.get('/users/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.users.findUnique({
    where: { id: Number(id) },
    select: { id: true, username: true, email: true, created_at: true, initial_balance: true},
  });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});


export default router;