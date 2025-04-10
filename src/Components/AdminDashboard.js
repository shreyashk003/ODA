import React, { useState } from 'react';
import { User, FileText, Settings, Bell, LogOut, Users, Database } from 'lucide-react';
import ManageUsers from './ManageUsers';
import MonitorRequests from './MonitorRequests'; // ✅ Import
import DatabaseControl from './DatabaseControl'; // ✅ Import
import AdminSettings from './AdminSettings';
import Notifications from './Notifications'; // ✅ Import Notifications



const AdminDashboard = ({ user }) => {
  const [activeView, setActiveView] = useState('dashboard');

  const adminActions = [
    { key: 'manageUsers', label: 'Manage Users', icon: <Users size={20} />, color: 'bg-blue-100 text-blue-700' },
    { key: 'monitorRequests', label: 'Monitor Requests', icon: <FileText size={20} />, color: 'bg-yellow-100 text-yellow-700' },
    { key: 'databaseControl', label: 'Database Control', icon: <Database size={20} />, color: 'bg-green-100 text-green-700' },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={20} />, color: 'bg-red-100 text-red-700' },
    { key: 'adminSettings', label: 'Settings', icon: <Settings size={20} />, color: 'bg-purple-100 text-purple-700' } // ✅ FIXED key here
  ];
  

  const renderContent = () => {
    switch (activeView) {
      case 'manageUsers':
        return <ManageUsers />;
      case 'monitorRequests':
        return <MonitorRequests />;
      case 'databaseControl':
        return <DatabaseControl />;
      case 'adminSettings':
        return <AdminSettings />;
      case 'notifications':
        return <Notifications />; // ✅ Render Notifications
      default:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Administrative Tools</h2>
            <div className="grid grid-cols-3 gap-6">
              {adminActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => setActiveView(action.key)}
                  className={`p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer ${action.color} flex items-center gap-4`}
                >
                  <div className="text-xl">{action.icon}</div>
                  <div>
                    <p className="text-lg font-semibold">{action.label}</p>
                    <p className="text-sm text-gray-600">Click to manage</p>
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
          <h2 className="text-xl font-bold text-blue-600">LifeGift Admin</h2>
        </div>
        <nav className="p-4 space-y-2">
          <div
            className="p-2 bg-blue-50 rounded-md text-blue-600 font-medium flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveView('dashboard')}
          >
            <User size={18} />
            Dashboard
          </div>
          {adminActions.map((action, i) => (
            <div
              key={i}
              className="p-2 text-gray-600 hover:bg-blue-50 rounded-md flex items-center gap-3 cursor-pointer"
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
              <Bell size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {user.fullName.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
