// MyRequests.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests', {
        headers: {
          // Assuming you're using JWT stored in localStorage
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRequests(res.data);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests =
    filter === 'all' ? requests : requests.filter((req) => req.status === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <p className="text-center">Loading requests...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">My Organ Requests</h2>

      <div className="mb-4 flex gap-4">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            className={`px-4 py-1 rounded-full border ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border-blue-600'
            }`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredRequests.map((req, index) => (
            <li key={index} className="p-4 bg-blue-50 rounded-lg shadow-sm">
              <p className="text-lg font-semibold">Organ: {req.organType}</p>
              <p className="text-sm">Blood Group: {req.bloodGroup}</p>
              <p className="text-sm">City: {req.city}</p>
              <p className="text-sm">Hospital: {req.hospital}</p>
              <p className="text-sm">Notes: {req.notes}</p>
              <p className="text-sm">Date: {moment(req.timestamp).format('LLL')}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${getStatusClass(
                  req.status
                )}`}
              >
                Status: {req.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRequests;
