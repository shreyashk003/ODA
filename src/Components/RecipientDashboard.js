import React, { useState } from "react";
import AvailableOrgans from "./AvailableOrgans";
import RecipientProfile from "./RecipientProfile";
import HealthStatus from "./HealthStatus";

const RecipientDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("availableOrgans");

  const renderComponent = () => {
    switch (activeComponent) {
      case "availableOrgans":
        return <AvailableOrgans />;
      case "healthStatus":
        return <HealthStatus />;
      case "profile":
        return <RecipientProfile />;
      default:
        return <AvailableOrgans />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Recipient Panel</h2>
        <nav className="flex flex-col gap-4">
          <button
            className={`text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeComponent === "availableOrgans" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveComponent("availableOrgans")}
          >
            Available Organs
          </button>
          <button
            className={`text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeComponent === "healthStatus" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveComponent("healthStatus")}
          >
            Health Status
          </button>
          <button
            className={`text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeComponent === "profile" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveComponent("profile")}
          >
            Profile
          </button>
          
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderComponent()}
      </div>
    </div>
  );
};

export default RecipientDashboard;