import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const DonorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error('Error fetching profile:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-red-500">Unable to load profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-[#fef9f8] to-[#fde2e2] rounded-3xl shadow-xl border border-pink-200">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Avatar */}
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`}
          alt="Donor Avatar"
          className="w-32 h-32 rounded-full border-4 border-pink-300 shadow-md"
        />

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-pink-700 mb-2 tracking-tight">
            {profile.name}
          </h2>
          <p className="text-sm bg-green-100 text-green-800 inline-block px-3 py-1 rounded-full mb-4">
            Role: {profile.role}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
            <div>
              <span className="font-semibold">Username:</span>
              <p className="truncate">{profile.username}</p>
            </div>
            <div>
              <span className="font-semibold">Email:</span>
              <p className="truncate">{profile.email}</p>
            </div>
            <div>
              <span className="font-semibold">Phone:</span>
              <p>{profile.phone}</p>
            </div>
            <div>
              <span className="font-semibold">Blood Group:</span>
              <p>{profile.bloodGroup}</p>
            </div>
            <div>
              <span className="font-semibold">City:</span>
              <p>{profile.city}</p>
            </div>
            <div>
              <span className="font-semibold">Date of Birth:</span>
              <p>{moment(profile.dob, 'DD-MM-YYYY').format('LL')}</p>
            </div>
            <div>
              <span className="font-semibold">User ID:</span>
              <p className="text-xs text-gray-500">{profile._id}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button className="px-5 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition">
              Edit Profile
            </button>
            <button className="px-5 py-2 bg-white border border-pink-500 text-pink-600 rounded-full hover:bg-pink-50 transition">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
