import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MonitorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    axios.get('http://localhost:5000/api/requests')
      .then((res) => setRequests(res.data))
      .catch((err) => console.error('Error fetching requests:', err));
  }, []);

  const exportToCSV = () => {
    const headers = ["Organ", "Blood Type", "Status"];
    const rows = requests.map(r => [r.organType, r.bloodType, r.status]);

    let csv = headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'organ_requests.csv';
    a.click();
  };

  const handleApprove = (id) => {
    alert(`✅ Approved request ID: ${id}`);
    // axios.put(...) to update status
  };

  const handleReject = (id) => {
    alert(`❌ Rejected request ID: ${id}`);
    // axios.put(...) to update status
  };

  const paginatedRequests = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(requests.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Monitor Organ Requests</h2>
        <button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
          Export to CSV
        </button>
      </div>

      <ul className="grid gap-4">
        {paginatedRequests.map((r) => (
          <li key={r._id} className="bg-white p-5 shadow rounded-lg hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Organ:</strong> {r.organType}</p>
                <p><strong>Blood Type:</strong> {r.bloodType}</p>
                <p><strong>Status:</strong> <span className="text-blue-600 font-semibold">{r.status}</span></p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleApprove(r._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Approve</button>
                <button onClick={() => handleReject(r._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                <button onClick={() => setSelectedRequest(r)} className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded">View</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h3 className="text-lg font-bold mb-4">Request Details</h3>
            <p><strong>Organ:</strong> {selectedRequest.organType}</p>
            <p><strong>Blood Type:</strong> {selectedRequest.bloodType}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Requested By:</strong> {selectedRequest.requesterName || "N/A"}</p>
            <p><strong>Date:</strong> {selectedRequest.date || "N/A"}</p>
            <button onClick={() => setSelectedRequest(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitorRequests;
