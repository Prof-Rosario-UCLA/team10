import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file.');

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await axios.post('http://34.19.31.71:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', res.data);

      const uploadedFileName = res.data.data.filename
      setMessage('Upload successful!');
      const response = await axios.post('http://34.19.31.71:5000/api/classify', {
        filename: uploadedFileName
      });
      console.log('Classification:', response.data.labels);

      console.log(res.data);
    } catch (err) {
      setMessage(`Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-4 rounded mt-10">
      <h2 className="text-xl font-semibold mb-4">Upload Wildlife Image</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default UploadForm;
