import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecipientDashboard = () => {
  const user = { id: 'REC-001' }; // Simulated user ID

  const [organsList, setOrgansList] = useState([]);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    const fetchOrgans = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/organs');
        const availableOrgans = response.data.filter(org => org.status === 'Available');
        setOrgansList(availableOrgans);
      } catch (error) {
        console.error('Error fetching organs:', error);
        setToastMessage('Failed to load organs. Please refresh.');
        setToastVisible(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages?recipientId=${user.id}`);
        setMessageHistory(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchOrgans();
    fetchMessages();
  }, [user.id]);

  const handleSendThankYouMessage = async () => {
    if (!thankYouMessage.trim() || !selectedOrgan) return;

    setLoading(true);
    const payload = {
      recipientId: user.id,
      donorId: selectedOrgan.donorId || 'UNKNOWN', // Default if not available
      organId: selectedOrgan._id,
      content: thankYouMessage,
      date: new Date().toISOString(),
    };

    try {
      await axios.post('http://localhost:5000/api/messages', payload);
      setToastMessage('Thank you message sent successfully!');
      setToastVisible(true);
      setThankYouMessage('');
      setSelectedOrgan(null);
      setShowConfirmation(false);

      // Refresh messages
      const response = await axios.get(`http://localhost:5000/api/messages?recipientId=${user.id}`);
      setMessageHistory(response.data);
    } catch (error) {
      console.error('Failed to send message:', error);
      setToastMessage('Failed to send message. Please try again.');
      setToastVisible(true);
    } finally {
      setLoading(false);
      setTimeout(() => setToastVisible(false), 3000);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 text-gray-800 font-sans">
      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed top-4 right-4 bg-white shadow-xl rounded-lg px-4 py-3 z-50 max-w-md flex items-center border-l-4 border-green-500 animate-fade-in">
          <div className="mr-3 text-green-500 text-xl">✓</div>
          <p className="font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-green-500 text-white p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">LifeConnect</h1>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-200 text-gray-700 font-medium rounded-full py-1 px-4 text-sm">
                Recipient ID: {user.id}
              </div>
              <button className="ml-4 bg-white p-2 rounded-full text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('available')}
              className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'available' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Available Organs
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'messages' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Message History
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Organs List */}
          {activeTab === 'available' && (
            <>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Available Organs</h2>
                    <p className="text-sm text-gray-500 mt-1">Select an organ to send a thank you message</p>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {organsList.length === 0 ? (
                        <li className="px-6 py-8 text-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="mt-4">No available organs at this time.</p>
                          <p className="mt-2 text-sm">Please check back later.</p>
                        </li>
                      ) : (
                        organsList.map((organ) => (
                          <li key={organ._id} className={`px-6 py-4 hover:bg-green-50 transition-colors duration-150 ${selectedOrgan?._id === organ._id ? 'bg-green-50' : ''}`}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="bg-green-100 rounded-lg p-3 mr-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{organ.name}</p>
                                  <div className="flex items-center mt-1">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Available</span>
                                    <span className="text-sm text-gray-500 ml-2">Match Score: {organ.matchCount || 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                className={`${
                                  selectedOrgan?._id === organ._id 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
                                } px-4 py-2 rounded-lg font-medium transition-colors duration-150`}
                                onClick={() => setSelectedOrgan(organ)}
                              >
                                {selectedOrgan?._id === organ._id ? 'Selected' : 'Select'}
                              </button>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              </div>
              
              {/* Thank You Message Form */}
              <div className="lg:col-span-1">
                <div className={`bg-white rounded-xl shadow-md overflow-hidden ${!selectedOrgan ? 'opacity-75' : ''}`}>
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Send Thank You</h2>
                    <p className="text-sm text-gray-500 mt-1">Express your gratitude</p>
                  </div>
                  
                  <div className="p-6">
                    {!selectedOrgan ? (
                      <div className="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p className="mt-4 text-gray-500">Select an organ to compose your message</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 p-4 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Selected Organ</p>
                          <p className="text-lg font-bold text-gray-900 mt-1">{selectedOrgan.name}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-500">ID: {selectedOrgan._id}</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                          <textarea
                            id="message"
                            className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-green-500 focus:border-green-500 transition-colors duration-150"
                            placeholder="Write your thank you message here..."
                            value={thankYouMessage}
                            onChange={(e) => setThankYouMessage(e.target.value)}
                          ></textarea>
                        </div>
                        
                        <button
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-3 rounded-lg transition-colors duration-150"
                          onClick={() => setShowConfirmation(true)}
                          disabled={loading || !thankYouMessage.trim()}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </span>
                          ) : (
                            'Send Thank You Message'
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Message History */}
          {activeTab === 'messages' && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Message History</h2>
                  <p className="text-sm text-gray-500 mt-1">Your sent thank you messages</p>
                </div>
                
                <div className="p-6">
                  {messageHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-4 text-gray-600 font-medium">No messages sent yet</p>
                      <p className="mt-2 text-gray-500">Your sent messages will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messageHistory.map((msg) => (
                        <div key={msg._id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(msg.date)}
                            </div>
                            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                              Sent
                            </div>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1">
                              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Organ ID</p>
                              <p className="text-sm font-mono">{msg.organId}</p>
                            </div>
                            
                            <div className="md:col-span-1">
                              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Donor ID</p>
                              <p className="text-sm font-mono">{msg.donorId}</p>
                            </div>
                            
                            <div className="md:col-span-2">
                              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Message</p>
                              <p className="text-sm italic">"{msg.content}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            LifeConnect Recipient Portal © {new Date().getFullYear()} • For assistance, contact support@lifeconnect.org
          </p>
        </div>
      </footer>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md animate-fade-in-up">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-center mb-2">Confirm Message</h4>
            <p className="text-gray-600 text-center mb-6">Are you sure you want to send this thank you message?</p>
            
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <p className="italic text-gray-700">"{thankYouMessage}"</p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 px-4 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition-colors duration-150"
                onClick={handleSendThankYouMessage}
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientDashboard;