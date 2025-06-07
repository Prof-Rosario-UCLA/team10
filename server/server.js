import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import classifyRoute from './routes/classify.js';


dotenv.config();

import uploadRoute from './routes/upload.js';

const app = express();
app.use(cors({
  origin: 'http://34.19.31.71:5173',
}));
app.use(helmet());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.get('/', (req, res) => res.send('WildDex backend running'));

app.listen(5000, '0.0.0.0', () => {
  console.log('Server listening on port 5000');
});

app.use('/api/upload', uploadRoute);

const __dirname = path.resolve(); 
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path, stat) => {
    res.set('Access-Control-Allow-Origin', 'http://34.19.31.71:5173');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.use('/api/classify', classifyRoute);