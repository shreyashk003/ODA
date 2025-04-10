import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const AvailableOrgans = () => {
  const [organs, setOrgans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgans = async () => {
      try {
        const response = await axios.get("http://localhost:5000/organs");
        setOrgans(response.data);
      } catch (error) {
        console.error("Error fetching organs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgans();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-700 mt-10">Loading organs...</div>;
  }

  if (organs.length === 0) {
    return <div className="text-center text-gray-700 mt-10">No organs available currently.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Organs</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organs.map((organ) => (
          <div key={organ._id} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <h3 className="text-xl font-semibold text-blue-600">{organ.organType}</h3>
            <p><span className="font-semibold">Blood Group:</span> {organ.bloodGroup}</p>
            <p><span className="font-semibold">City:</span> {organ.city}</p>
            <p><span className="font-semibold">Hospital:</span> {organ.hospital}</p>
            <p><span className="font-semibold">Notes:</span> {organ.notes || "—"}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`inline-block px-2 py-1 rounded text-sm ${
                  organ.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : organ.status === "approved"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {organ.status}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-semibold">Added:</span>{" "}
              {moment(organ.timestamp).format("MMMM Do YYYY, h:mm A")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableOrgans;
