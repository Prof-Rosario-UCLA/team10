import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ImageGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get('http://34.19.31.71:5000/api/upload/images')
      .then(res => setImages(res.data))
      .catch(err => console.error('Failed to fetch images:', err));
  }, []);

  return (
    <div style={galleryStyle}>
      {images.map((img, idx) => (
        <div key={idx} style={cardStyle}>
          <img
            src={`http://34.19.31.71:5000/uploads/${img.filename}`}
            alt={`Image ${idx}`}
            style={imageStyle}
          />
          <div style={infoStyle}>
            <strong>Species:</strong> {img.labels?.[0]?.description || 'Unknown'}
            <br />
            <strong>Confidence:</strong> {(img.labels?.[0]?.score * 100).toFixed(1) || '?'}%
          </div>
        </div>
      ))}
    </div>
  );
}

const galleryStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  padding: '20px',
  width: '100%',
  boxSizing: 'border-box',
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const imageStyle = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
};

const infoStyle = {
  padding: '10px',
  fontSize: '0.9rem',
  color: '#333',
};
