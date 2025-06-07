import express from 'express';
import vision from '@google-cloud/vision';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const client = new vision.ImageAnnotatorClient({
  keyFilename: '/home/haseeb/wilddex/server/config/tokyo-mind-458722-t5-2845b8961614.json',
});

router.post('/', async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const filePath = path.join(process.cwd(), 'uploads', filename);

  try {
    const [result] = await client.labelDetection(filePath);

    const labels = result.labelAnnotations.map(label => ({
      description: label.description,
      score: label.score,
    }));

    res.json({ labels });
  } catch (err) {
    console.error('Error classifying image:', err);
    res.status(500).json({ error: 'Failed to classify image' });
  }
});

export default router;
