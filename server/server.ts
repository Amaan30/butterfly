import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
//import signup from '../src/pages/auth/signup';

//import { fileURLToPath } from 'node:url';
//import { dirname } from 'node:path';
import path from 'node:path';

import cors from 'cors';

// Fix __dirname for ESM
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

//import cookie-parser
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
dotenv.config();

const __dirname = process.cwd();

console.log(__dirname);

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: [
    'http://localhost:5173',                        // Development
    'https://amaan30.github.io',              // GitHub Pages
    'https://amaan30.github.io/butterfly'     // With repository name
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(cookieParser());

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1); // Exit if missing critical config
}

const MONGO_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use('/api/users', userRoutes);


app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the server!');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

app.get('/api/data', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});