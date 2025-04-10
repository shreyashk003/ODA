// Messages.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/messages')
      .then((res) => setMessages(res.data))
      .catch((err) => console.error('Error fetching messages:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Messages</h2>

      {loading ? (
        <p className="text-gray-600">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-600">No messages found.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((msg, i) => (
            <li key={i} className="p-4 bg-purple-50 rounded-lg shadow-sm">
              <p className="text-gray-800 text-base mb-1">📩 {msg.content}</p>
              <p className="text-sm text-gray-500">{new Date(msg.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
