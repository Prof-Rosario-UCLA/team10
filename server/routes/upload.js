import { Router } from 'express';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import redisClient from '../redisClient.js';
import Image from '../models/Image.js';
import vision from '@google-cloud/vision';
import authenticate from '../middleware/auth.js';
import path from 'path';
import stream from 'stream';

const router = Router();

const storage = new Storage();
const bucketName = 'wilddex-uploads';
const bucket = storage.bucket(bucketName);

const visionClient = new vision.ImageAnnotatorClient();

const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Invalid file type'));
  },
});

router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const gcsFileName = `${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(gcsFileName);

    const passthroughStream = new stream.PassThrough();
    passthroughStream.end(file.buffer);

    passthroughStream
      .pipe(
        fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        })
      )
      .on('error', (err) => {
        console.error('GCS upload error:', err);
        res.status(500).json({ error: 'Failed to upload to storage' });
      })
      .on('finish', async () => {
        try {
          const gcsUri = `gs://${bucketName}/${gcsFileName}`;
          console.log('Uploaded to GCS:', gcsUri);

          const [result] = await visionClient.labelDetection(gcsUri);
          console.log('Vision API result:', result);

          const labels = result.labelAnnotations?.map((label) => ({
            description: label.description,
            score: label.score,
          })) || [];

          console.log('Extracted labels:', labels);

          const imageDoc = new Image({
            filename: gcsFileName,
            filepath: gcsUri,
            mimetype: file.mimetype,
            size: file.size,
            labels,
            userId: req.userId,
          });

          await imageDoc.save();
          console.log('Image saved to DB:', imageDoc);

          await redisClient.del(`images:${req.userId}`);

          res.status(201).json({ message: 'File uploaded successfully', data: imageDoc });
        } catch (err) {
          console.error('Upload handler error:', err);
          res.status(500).json({ error: 'Upload failed during processing' });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/images', authenticate, async (req, res) => {
  const cacheKey = `images:${req.userId}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log('Serving data from Redis cache');
      return res.json(JSON.parse(cached));
    }

    const imageDocs = await Image.find({ userId: req.userId }).sort({ uploadedAt: -1 });

    const imagesWithUrls = await Promise.all(
      imageDocs.map(async (doc) => {
        const file = bucket.file(doc.filename);
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 5 * 60 * 1000,
        });

        return {
          ...doc.toObject(),
          url,
        };
      })
    );

    await redisClient.set(cacheKey, JSON.stringify(imagesWithUrls), { EX: 60 });
    console.log('Serving data from MongoDB');
    res.json(imagesWithUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

export default router;