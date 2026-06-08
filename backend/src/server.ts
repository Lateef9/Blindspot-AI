import express, { Request, Response } from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload';

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

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
