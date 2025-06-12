import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (useCamera) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('Camera access denied:', err);
          setMessage('Could not access the camera');
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [useCamera]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationError('');
      },
      (err) => {
        setLocationError('Could not get location: ' + err.message);
      }
    );
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) {
        const imageFile = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setFile(imageFile);
        setMessage('Image captured!');
      }
    }, 'image/jpeg');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select or capture an image.');

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      if (location) {
        formData.append('latitude', location.latitude);
        formData.append('longitude', location.longitude);
      }

      setMessage('Uploading image...');
      await axios.post(
        'https://backend-dot-tokyo-mind-458722-t5.uw.r.appspot.com/api/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      setMessage('Upload and classification successful!');
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Wildlife Image</h2>
      <label>
        <input
          type="checkbox"
          checked={useCamera}
          onChange={() => setUseCamera(prev => !prev)}
        /> Use Camera
      </label>
      <button type="button" onClick={getLocation}>Get Location</button>
      {location && (
        <p>Location: Lat {location.latitude.toFixed(5)}, Lng {location.longitude.toFixed(5)}</p>
      )}
      {locationError && <p style={{color: 'red'}}>{locationError}</p>}

      {useCamera ? (
        <div>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 400 }} />
          <button type="button" onClick={handleTakePhoto}>Take Photo</button>
        </div>
      ) : (
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadForm;
