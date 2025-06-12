import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ImageGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = () => {
      axios.get('https://backend-dot-tokyo-mind-458722-t5.uw.r.appspot.com/api/upload/images', {
        withCredentials: true,
      })
        .then(res => setImages(res.data))
        .catch(err => console.error('Failed to fetch images:', err));
    };

    fetchImages(); 

    const interval = setInterval(fetchImages, 5000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <section style={galleryStyle}>
      {images.map((img, idx) => (
        <article key={idx} style={cardStyle} aria-label={`Image of ${img.labels?.[0]?.description || 'Unknown'}`}>
          <img
            src={img.url}
            alt={`Image ${idx}`}
            style={imageStyle}
          />
          <div style={infoStyle}>
            <strong>Classification:</strong> {img.labels?.[0]?.description || 'Unknown'}<br />
            {Array.isArray(img.location?.coordinates) && img.location.coordinates.length === 2 && (
              <>
                <strong>Lat:</strong> {img.location.coordinates[1]?.toFixed(5)}<br />
                <strong>Lng:</strong> {img.location.coordinates[0]?.toFixed(5)}
              </>
            )}
          </div>
        </article>
      ))}
    </section>
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
  height: '150px',
  objectFit: 'cover',
};

const infoStyle = {
  padding: '10px',
  fontSize: '0.9rem',
  color: '#333',
};
