import React from 'react';
import { useOnlineStatus } from './UseOnlineStatus';

export default function StatusBanner() {
  const isOnline = useOnlineStatus();

  return (
    <div style={{
      padding: '10px',
      textAlign: 'center',
      backgroundColor: isOnline ? '#4ade80' : '#f87171',
      color: 'white',
      fontWeight: 'bold',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
    }}>
      {isOnline ? 'You are online' : 'You are offline — data may be unavailable'}
    </div>
  );
}
