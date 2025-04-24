import React from 'react';
import Messages from '../components/Messages';

const MessagesPage = () => {
  // Replace with actual userId from auth context or state
  const userId = '67fc23c4f2d248d63d099a62'; // Example - replace with real userId

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat</h1>
      <Messages userId={userId} />
    </div>
  );
};

export default MessagesPage;