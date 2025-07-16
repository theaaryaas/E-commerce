import React from 'react';
import { Helmet } from 'react-helmet-async';

const ProfilePage = () => {
  return (
    <>
      <Helmet>
        <title>Profile - E-Store</title>
        <meta name="description" content="Manage your profile and account settings." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        <p className="text-gray-600">Profile management coming soon...</p>
      </div>
    </>
  );
};

export default ProfilePage; 