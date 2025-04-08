import React, { useState } from 'react';
import './App.css';
import Login from './Components/Login';
import AdminDashboard from './Components/AdminDashboard';
import DonarDashboard from './Components/DonarDashboard'; // ✅ Import added
import RecipientDashboard from './Components/RecipientDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  const getDashboardComponent = (role) => {
    const normalizedRole = role?.toLowerCase().trim();

    switch (normalizedRole) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'donar':
        return <DonarDashboard user={user} setUser={setUser} />;
      case 'recipient':
        return <RecipientDashboard user={user} setUser={setUser} />;
      default:
        return <p className="text-red-600 font-semibold">Unknown role: {role}</p>;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-100">
      {!user ? (
        <Login
          setUser={(userData) => {
            const normalizedUser = {
              ...userData,
              role: userData.role?.toLowerCase().trim() || '',
            };
            console.log('✅ Logged in user:', normalizedUser);
            setUser(normalizedUser);
          }}
          handleLoginSuccess={(userData) => {
            const normalizedUser = {
              ...userData,
              role: userData.role?.toLowerCase().trim() || '',
            };
            console.log('✅ Login Success:', normalizedUser);
            setUser(normalizedUser);
          }}
        />
      ) : (
        <div>
          <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, <span className="text-blue-600">{user.fullName || 'User'}</span>
              </h1>
              <p className="text-gray-600">Role: {user.role}</p>
            </div>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </header>

          <main className="p-4">{getDashboardComponent(user.role)}</main>
        </div>
      )}
    </div>
  );
}

export default App;
