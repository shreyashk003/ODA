const AdminDashboard = ({ user }) => {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Welcome, {user.fullName}</h1>
        <p>This is the Admin Dashboard</p>
      </div>
    );
  };
  
  export default AdminDashboard;
  