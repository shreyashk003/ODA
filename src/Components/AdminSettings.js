import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({ theme: 'light', notifications: true });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const updateSettings = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/settings', settings);
      setMessage(res.data.message);
      setError(false);
    } catch (err) {
      setMessage('Failed to update settings');
      setError(true);
    }

    setTimeout(() => {
      setMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Admin Settings</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium">Theme</label>
          <select
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium">Enable Notifications</label>
          <input
            type="checkbox"
            className="w-5 h-5 accent-green-600"
            checked={settings.notifications}
            onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
          />
        </div>

        <button
          onClick={updateSettings}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md"
        >
          Save Settings
        </button>

        {message && (
          <div className={`mt-4 flex items-center p-4 rounded-lg ${
            error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {error ? <AlertCircle className="mr-2" /> : <CheckCircle2 className="mr-2" />}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
