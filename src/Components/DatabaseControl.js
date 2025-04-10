import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, DatabaseBackup, RefreshCcw, XCircle } from 'lucide-react';

const DatabaseControl = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await axios.get('http://localhost:5000/api/db/backup');
      setResult(`✅ ${res.data.message}`);
    } catch (err) {
      setResult('❌ Backup failed');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    setShowResetConfirm(false);
    setResult('');
    try {
      const res = await axios.post('http://localhost:5000/api/db/reset');
      setResult(`⚠️ ${res.data.message}`);
    } catch (err) {
      setResult('❌ Reset failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10 bg-white bg-opacity-60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 transition-all">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">
        Database Control Center
      </h2>

      <div className="flex justify-center space-x-6 mb-4">
        <button
          onClick={handleBackup}
          disabled={loading}
          className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-3 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
        >
          <DatabaseBackup className="mr-2" /> Backup DB
        </button>

        <button
          onClick={() => setShowResetConfirm(true)}
          disabled={loading}
          className="flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-3 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCcw className="mr-2" /> Reset DB
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center mt-6 text-blue-600 font-medium animate-pulse">
          <Loader2 className="animate-spin mr-2" /> Processing...
        </div>
      )}

      {result && (
        <p className={`mt-6 p-4 rounded-xl text-center text-lg font-semibold transition-all duration-300 ${
          result.includes('failed') ? 'bg-red-100 text-red-700' :
          result.includes('⚠️') ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-700'
        }`}>
          {result}
        </p>
      )}

      {/* Modal Confirm Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowResetConfirm(false)}
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-xl font-bold text-red-600 mb-4 text-center">Reset Confirmation</h3>
            <p className="text-gray-700 text-center mb-6">
              This will <span className="font-bold text-red-500">permanently</span> reset your database.
              Are you sure you want to proceed?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow-sm"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseControl;
