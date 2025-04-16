import React, { useState } from 'react';
import axios from 'axios';
import { Heart, PlusCircle } from 'lucide-react';

const RegisterOrgan = ({ user }) => {
  const [formData, setFormData] = useState({
    organType: '',
    bloodGroup: '',
    city: '',
    hospital: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const organOptions = ['Heart', 'Kidney', 'Liver', 'Lungs', 'Pancreas', 'Eyes'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:5000/api/register-organ', {
        donorId: user?._id,
        fullName: user?.fullName,
        ...formData,
        status: 'pending',
        timestamp: new Date().toISOString(),
      });
      setMessage('Organ registration successful!');
      setFormData({
        organType: '',
        bloodGroup: '',
        city: '',
        hospital: '',
        notes: '',
      });
    } catch (error) {
      setMessage('Failed to register organ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Heart className="text-red-500" />
        Organ Donation Registration 2025
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Organ Type</label>
            <select
              name="organType"
              required
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              value={formData.organType}
              onChange={handleChange}
            >
              <option value="">-- Select Organ --</option>
              {organOptions.map((organ) => (
                <option key={organ} value={organ}>{organ}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Group</label>
            <select
              name="bloodGroup"
              required
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option value="">-- Select Blood Group --</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter city name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hospital</label>
            <input
              type="text"
              name="hospital"
              required
              value={formData.hospital}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter hospital name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Notes (optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
            placeholder="Any extra info you want to provide"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition-all"
          >
            <PlusCircle size={18} />
            {loading ? 'Submitting...' : 'Register Organ'}
          </button>
        </div>

        {message && (
          <div className="text-center text-sm font-medium text-green-600 mt-4">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterOrgan;
