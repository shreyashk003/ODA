import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const RecipientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recipient-profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error('Error fetching recipient profile:', err))
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
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8">
          {/* Avatar with letter "V" */}
          <div className="flex-shrink-0">
            <div className="w-36 h-36 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
              {profile.fullName.charAt(0)} {/* Display first letter of full name */}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold text-blue-800 mb-2 tracking-tight">
              {profile.fullName}
            </h2>
            <p className="text-sm bg-blue-100 text-blue-800 inline-block px-4 py-1 rounded-full mb-6 font-medium">
              {profile.role.toUpperCase()}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 text-base">
              <ProfileField label="Username" value={profile.username} />
              <ProfileField label="Email" value={profile.email} />
              <ProfileField label="Phone" value={profile.phone} />
              <ProfileField label="Blood Group" value={profile.bloodGroup} />
              <ProfileField label="City" value={profile.city} />
              <ProfileField label="Date of Birth" value={moment(profile.dob, 'DD-MM-YYYY').format('LL')} />
              <ProfileField label="User ID" value={profile._id} small />
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-sm">
                Edit Profile
              </button>
              <button className="px-6 py-2.5 bg-white border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-all shadow-sm">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, small }) => (
  <div>
    <span className={`block font-semibold text-gray-600 ${small ? 'text-xs' : ''}`}>{label}:</span>
    <p className={`${small ? 'text-xs text-gray-500' : 'truncate'}`}>{value}</p>
  </div>
);

export default RecipientProfile;
