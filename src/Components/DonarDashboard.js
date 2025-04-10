import React, { useState } from 'react';
import { Heart, FileText, MessageCircle, Settings, LogOut, User } from 'lucide-react';
import MyRequests from './MyRequests';
import RegisterOrgan from './RegisterOrgan';
import Messages from './Messages';
import DonorProfile from './DonorProfile';

const DonorDashboard = ({ user }) => {
  const [activeView, setActiveView] = useState('dashboard');

  const donorActions = [
    { key: 'myRequests', label: 'My Requests', icon: <FileText size={20} />, color: 'bg-yellow-100 text-yellow-700' },
    { key: 'registerOrgan', label: 'Register Organ', icon: <Heart size={20} />, color: 'bg-red-100 text-red-700' },
    { key: 'messages', label: 'Messages', icon: <MessageCircle size={20} />, color: 'bg-blue-100 text-blue-700' },
    { key: 'profile', label: 'Profile', icon: <User size={20} />, color: 'bg-green-100 text-green-700' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'myRequests':
        return <MyRequests />;
      case 'registerOrgan':
        return <RegisterOrgan />;
      case 'messages':
        return <Messages />;
      case 'profile':
        return <DonorProfile />;
      default:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Donor Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {donorActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => setActiveView(action.key)}
                  className={`p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer ${action.color} flex items-center gap-4`}
                >
                  <div className="text-xl">{action.icon}</div>
                  <div>
                    <p className="text-lg font-semibold">{action.label}</p>
                    <p className="text-sm text-gray-600">Click to proceed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-red-600">LifeGift Donor</h2>
        </div>
        <nav className="p-4 space-y-2">
          <div
            className="p-2 bg-red-50 rounded-md text-red-600 font-medium flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveView('dashboard')}
          >
            <User size={18} />
            Dashboard
          </div>
          {donorActions.map((action, i) => (
            <div
              key={i}
              className="p-2 text-gray-600 hover:bg-red-50 rounded-md flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveView(action.key)}
            >
              {action.icon}
              {action.label}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.fullName}</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <MessageCircle size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
              {user.fullName.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DonorDashboard;
