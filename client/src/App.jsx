import React from 'react';
import UploadForm from './UploadForm';
import ImageGallery from './ImageGallery';
import StatusBanner from './StatusBanner';

function App() {
  return (
    <div>
      <StatusBanner />
      <h1 className="text-2xl font-bold text-center mt-4">WildlifeDex</h1>
      <UploadForm />
      <ImageGallery />
    </div>
  );
}

export default App;
