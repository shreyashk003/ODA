// --- Admin/Notifications.js ---
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, Filter, RefreshCcw } from 'lucide-react';
import moment from 'moment';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all | read | unread
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      setNotifications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, status: 'read', readAt: new Date() } : n))
      );
    } catch (err) {
      console.error('Failed to update notification status');
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'read') return n.status === 'read';
    if (filter === 'unread') return n.status === 'unread';
    return true;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <Bell size={24} /> System Notifications
        </h2>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${filter === 'unread' ? 'bg-yellow-400 text-white' : 'bg-gray-100'}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${filter === 'read' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setFilter('read')}
          >
            Read
          </button>
          <button
            onClick={fetchNotifications}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            title="Refresh"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading notifications...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 italic">No notifications found.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map(n => (
            <li
              key={n._id}
              className={`p-4 rounded-lg border-l-4 relative ${
                n.status === 'unread'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-gray-50 border-green-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{n.title}</p>
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {moment(n.createdAt).fromNow()}
                  </p>
                </div>
                {n.status === 'unread' && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
                {n.status === 'read' && (
                  <CheckCircle className="text-green-500" size={20} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
