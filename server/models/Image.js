import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    filename: String,
    filepath: String,
    mimetype: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now },
    location: {
        lat: Number,
        long: Number
    },
    labels: [
    {
      description: String,
      score: Number,
    },
  ],
});

const Image = mongoose.model('Image', ImageSchema);

export default Image;