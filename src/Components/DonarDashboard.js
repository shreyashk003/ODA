import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Bell, Heart, FileText, Calendar, Settings, LogOut, MessageCircle } from 'lucide-react';

const DonorDashboard = ({ user }) => {
  const [organs, setOrgans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [donorData, setDonorData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: '',
    phone: '',
    bloodType: '',
    organType: '',
    medicalHistory: '',
    allergies: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const organTypes = [
    'Kidney',
    'Liver',
    'Heart',
    'Lung',
    'Pancreas',
    'Cornea',
    'Bone Marrow',
    'Blood',
    'Plasma',
    'Platelets'
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchOrgans();
    fetchDonorData();
    fetchMessages();
  }, []);

  const fetchOrgans = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/organs');
      setOrgans(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching organs:', error);
      setErrorMessage('Failed to load organ donation data');
      setIsLoading(false);
    }
  };

  const fetchDonorData = async () => {
    try {
      // Using the donor endpoint from your backend
      const response = await axios.get(`http://localhost:5000/api/donor/${user.userId}`);
      setDonorData(response.data.donor);
      
      // Pre-fill form with donor data if available
      if (response.data.donor.email) {
        setFormData(prevData => ({
          ...prevData,
          email: response.data.donor.email
        }));
      }
    } catch (error) {
      console.error('Error fetching donor data:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      // Fetch messages where this donor is the recipient
      const response = await axios.get(`http://localhost:5000/api/messages?recipientId=${user.userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Since your backend doesn't have a specific donation endpoint,
      // we'll use the organs collection directly
      const payload = {
        donorId: user.userId,
        type: formData.organType,
        bloodType: formData.bloodType,
        donorName: formData.fullName,
        donorEmail: formData.email,
        donorPhone: formData.phone,
        medicalHistory: formData.medicalHistory,
        allergies: formData.allergies,
        address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        status: "Processing", // Default status for new donations
        urgencyLevel: "Medium", // Default urgency level
        dateAdded: new Date().toISOString()
      };
      
      // This endpoint would need to be added to your backend
      await axios.post('http://localhost:5000/api/organs', payload);
      setSuccessMessage('Organ donation registered successfully!');
      
      // Reset form fields except user info
      setFormData({
        ...formData,
        bloodType: '',
        organType: '',
        medicalHistory: '',
        allergies: '',
        address: '',
        city: '',
        postalCode: ''
      });
      
      // Refresh the organs list
      fetchOrgans();
      fetchDonorData();
    } catch (error) {
      console.error('Error submitting donation:', error);
      setErrorMessage('Failed to register donation. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">LifeGift Donor</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li className="p-2 bg-blue-50 rounded-md text-blue-600 font-medium">
              <a href="#" className="flex items-center gap-3">
                <User size={18} />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="p-2 text-gray-600 hover:bg-blue-50 rounded-md transition-colors">
              <a href="#" className="flex items-center gap-3">
                <Heart size={18} />
                <span>My Donations</span>
              </a>
            </li>
            <li className="p-2 text-gray-600 hover:bg-blue-50 rounded-md transition-colors">
              <a href="#" className="flex items-center gap-3">
                <MessageCircle size={18} />
                <span>Messages</span>
                {messages.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {messages.length}
                  </span>
                )}
              </a>
            </li>
            <li className="p-2 text-gray-600 hover:bg-blue-50 rounded-md transition-colors">
              <a href="#" className="flex items-center gap-3">
                <Calendar size={18} />
                <span>Appointments</span>
              </a>
            </li>
            <li className="p-2 text-gray-600 hover:bg-blue-50 rounded-md transition-colors">
              <a href="#" className="flex items-center gap-3">
                <FileText size={18} />
                <span>Medical Records</span>
              </a>
            </li>
            <li className="p-2 text-gray-600 hover:bg-blue-50 rounded-md transition-colors">
              <a href="#" className="flex items-center gap-3">
                <Bell size={18} />
                <span>Notifications</span>
              </a>
            </li>
            <li className="p-2 text-gray-600 hover:bg-blue-50 rounded-md transition-colors">
              <a href="#" className="flex items-center gap-3">
                <Settings size={18} />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <LogOut size={18} /> 
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.fullName}</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Bell size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  {user.fullName.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">My Donations</h3>
              <p className="text-3xl font-bold text-gray-800">{donorData?.organs?.length || 0}</p>
              <div className="mt-2 text-green-600 text-sm">Thank you for your generosity!</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Messages</h3>
              <p className="text-3xl font-bold text-gray-800">{messages.length}</p>
              <div className="mt-2 text-blue-600 text-sm">From recipients</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Organs Available</h3>
              <p className="text-3xl font-bold text-gray-800">{organs.length}</p>
              <div className="mt-2 text-yellow-600 text-sm">In the database</div>
            </div>
          </div>

          {/* Donation Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Register New Organ Donation</h2>

            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Blood Type</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organ to Donate</label>
                  <select
                    name="organType"
                    value={formData.organType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Organ Type</option>
                    {organTypes.map((organ) => (
                      <option key={organ} value={organ}>
                        {organ}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please share any relevant medical history..."
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    rows="2"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="List any allergies..."
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Register Donation
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Organs List */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Available Organs for Donation</h2>
            
            {isLoading ? (
              <div className="text-center py-6">
                <p className="text-gray-500">Loading organ donation data...</p>
              </div>
            ) : organs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organ Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blood Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {organs.map((organ) => (
                      <tr key={organ._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {organ.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {organ.bloodType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              organ.status === 'Available' ? 'bg-green-100 text-green-800' : 
                              organ.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {organ.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {organ.donorName || "Anonymous"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No organ donation data available.</p>
              </div>
            )}
          </div>

          {/* Messages Section */}
          {messages.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Messages</h2>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message._id} className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-blue-800">Message about donation</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(message.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{message.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;