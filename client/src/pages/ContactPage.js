import React from 'react';
import { Helmet } from 'react-helmet-async';

const ContactPage = () => (
  <>
    <Helmet>
      <title>Contact Us - E-Store</title>
    </Helmet>
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-700">
        Have questions? Reach out to us at <a href="mailto:info@estore.com" className="text-blue-600 underline">info@estore.com</a> or call +1 (555) 123-4567.
      </p>
    </div>
  </>
);

export default ContactPage; 