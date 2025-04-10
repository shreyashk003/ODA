import React, { useState, useEffect } from "react";
import axios from "axios";

const HealthStatus = () => {
  const [healthData, setHealthData] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    condition: "",
    organNeeded: "",
    doctorRemarks: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch existing health data
    const fetchHealthData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/recipient");
        if (res.data) setHealthData(res.data);
      } catch (err) {
        console.error("Error fetching health data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  const handleChange = (e) => {
    setHealthData({ ...healthData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/update", healthData);
      setSuccessMessage("Health status updated successfully.");
      setEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating health data:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Health Status</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["name", "age", "bloodGroup", "condition", "organNeeded", "doctorRemarks"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              value={healthData[field]}
              onChange={handleChange}
              disabled={!editing}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6 space-x-4">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setSuccessMessage("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {successMessage && (
        <div className="mt-4 text-green-600 font-medium">{successMessage}</div>
      )}
    </div>
  );
};

export default HealthStatus;
