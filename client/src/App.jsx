import React, { useState, useEffect } from 'react';
import UploadForm from './UploadForm';
import ImageGallery from './ImageGallery';
import StatusBanner from './StatusBanner';
import AuthForm from './AuthForm';
import CookieBanner from './CookieBanner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 

  useEffect(() => {
    fetch('https://backend-dot-tokyo-mind-458722-t5.uw.r.appspot.com/api/auth/check', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setIsAuthenticated(data.authenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    await fetch('https://backend-dot-tokyo-mind-458722-t5.uw.r.appspot.com/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) return <p>Loading...</p>;

  if (!isAuthenticated) return <AuthForm onAuth={() => setIsAuthenticated(true)} />;

  return (
    <section className="app">
      <StatusBanner />
      <h1 >WildDex</h1>
      <aside className="logout">
        <button
          onClick={handleLogout}
          
        >
          Logout
        </button>
      </aside>
      <UploadForm />
      <article className="gallery" aria-label="Image gallery section">
        <ImageGallery />
      </article>
      <CookieBanner />
    </section>
  );
}

export default App;
