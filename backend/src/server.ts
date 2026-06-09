import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import uploadRouter from './routes/upload';
import chatRouter from './routes/chat';
import analyzeRouter from './routes/analyze';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'backend' });
});

// Upload endpoint
app.use('/', uploadRouter);

// Chat endpoint
app.use('/', chatRouter);

// Analyze endpoint
app.use('/', analyzeRouter);

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
