import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section className="cookiebanner">
      <article>
        <p>
          WildDex use cookies to improve your experience. By using this site, you agree to our cookie policy.
        </p>
        <button
          onClick={acceptCookies}
        >
          Accept
        </button>
      </article>
    </section>
  );
};

export default CookieBanner;
