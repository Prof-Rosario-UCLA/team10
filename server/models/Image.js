import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    filename: String,
    filepath: String,
    mimetype: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    labels: [
      {
        description: String,
        score: Number,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], 
        index: '2dsphere',
      },
  },
});

ImageSchema.index({ location: '2dsphere' });
const Image = mongoose.model('Image', ImageSchema);

export default Image;