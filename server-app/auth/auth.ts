import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

const prisma = new PrismaClient();
const router: express.Router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await prisma.users.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: '2h' }
        );

        const { password: _, ...userWithoutPassword } = user;
        res.json({ ...userWithoutPassword, token }); 
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, email, password, initial_balance } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
                initial_balance: initial_balance ?? 0
            },
        });


        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET!,
            { expiresIn: '2h' }
        );

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ ...userWithoutPassword, token });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;