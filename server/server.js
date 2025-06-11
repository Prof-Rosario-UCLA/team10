import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

dotenv.config();

import uploadRoute from './routes/upload.js';
import authRoute from './routes/auth.js';

const app = express();
app.use(cors({
  origin: 'https://frontend-dot-tokyo-mind-458722-t5.uw.r.appspot.com',
  credentials: true,
}));
app.use(helmet());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.get('/', (req, res) => res.send('WildDex backend running'));

app.use('/api/upload', uploadRoute);
app.use('/api/auth', authRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server listening on port 5000');
});

