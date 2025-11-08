import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth'; 

const router: express.Router = express.Router();
const prisma = new PrismaClient();


router.get('/transactions', verifyToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const transactions = await prisma.transactions.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
  });

  res.json(transactions);
});


router.get('/transactions/:id', verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = (req as any).user.id;

  const transaction = await prisma.transactions.findUnique({
    where: { id },
  });

  if (!transaction || transaction.user_id !== userId)
    return res.status(403).json({ error: 'Forbidden' });

  res.json(transaction);
});


router.post('/transactions', verifyToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { amount, note, type } = req.body;

  if (!amount || !type)
    return res.status(400).json({ error: 'amount and type are required' });

  const newTransaction = await prisma.transactions.create({
    data: {
      amount,
      note,
      type,
      user_id: userId,
    },
  });

  res.status(201).json(newTransaction);
});


router.patch('/transactions/:id', verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { amount, note, type } = req.body;
  const userId = (req as any).user.id;

  const transaction = await prisma.transactions.findUnique({ where: { id } });
  if (!transaction || transaction.user_id !== userId)
    return res.status(403).json({ error: 'Forbidden' });

  const updated = await prisma.transactions.update({
    where: { id },
    data: { amount, note, type },
  });

  res.json(updated);
});


router.delete('/transactions/:id', verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = (req as any).user.id;

  const transaction = await prisma.transactions.findUnique({ where: { id } });
  if (!transaction || transaction.user_id !== userId)
    return res.status(403).json({ error: 'Forbidden' });

  await prisma.transactions.delete({ where: { id } });
  res.status(204).send();
});

export default router;
