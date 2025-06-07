import { Router } from 'express';
import multer, { diskStorage } from 'multer';
import Image from '../models/Image.js';
import vision from '@google-cloud/vision';
import path from 'path';
const router = Router();

const client = new vision.ImageAnnotatorClient({
  keyFilename: '/home/haseeb/wilddex/server/config/tokyo-mind-458722-t5-2845b8961614.json',
});

const storage = diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = path.join(process.cwd(), 'uploads', file.filename);
    const [result] = await client.labelDetection(filePath);

    const labels = result.labelAnnotations.map(label => ({
      description: label.description,
      score: label.score,
    }));
    
    console.log("Detected labels:", labels);
    
    const imageDoc = new Image({
      filename: file.filename,
      filepath: file.path,
      mimetype: file.mimetype,
      size: file.size,
      labels: labels,
    });
    
    await imageDoc.save();
    res.status(201).json({ message: 'File uploaded successfully', data: imageDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images); 
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

export default router;
