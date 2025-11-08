  import express from 'express';
  import cors from 'cors';
  import type { Request, Response } from 'express';
  import transactionsRouter from './transactions/transactions';
  import userRouter from './users/users';
  import authRouter from './auth/auth';
  import dotenv from 'dotenv';
  
  dotenv.config();
  
  const app = express();
  const port = process.env.PORT;

  
  app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
  }));
  app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('WizAllet Server is running');
});

app.get('/status', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/auth', authRouter);
app.use('/', transactionsRouter);
app.use('/', userRouter);


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});