import React, { useState } from 'react';
import axios from 'axios';

export default function AuthForm({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

  try {
    const res = await axios.post(`https://backend-dot-tokyo-mind-458722-t5.uw.r.appspot.com${endpoint}`, 
      { email, password },
      { withCredentials: true }
    );

    localStorage.removeItem('cookie_consent');

    setMessage('Success!');
    onAuth?.(); 
  } catch (err) {
    setMessage(err.response?.data?.error || 'Authentication failed');
  }
};

  return (
    <section>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Create an account' : 'Already have an account? Log in'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
