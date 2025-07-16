import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutPage = () => (
  <>
    <Helmet>
      <title>About Us - E-Store</title>
    </Helmet>
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-gray-700">
        Welcome to E-Store! We are dedicated to providing quality products and excellent customer service.
      </p>
    </div>
  </>
);

export default AboutPage; 