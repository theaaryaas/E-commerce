import React from 'react';
import { Helmet } from 'react-helmet-async';

const Users = () => {
  return (
    <>
      <Helmet>
        <title>Admin Users - E-Store</title>
        <meta name="description" content="Manage users in the e-commerce store." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Users</h1>
        <p className="text-gray-600">User management functionality coming soon...</p>
      </div>
    </>
  );
};

export default Users; 