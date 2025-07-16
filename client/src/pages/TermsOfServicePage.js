import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsOfServicePage = () => (
  <>
    <Helmet>
      <title>Terms of Service - E-Store</title>
    </Helmet>
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-700 mb-2">
        By using E-Store, you agree to our terms and conditions. All purchases are subject to our return and refund policies. Please use our services responsibly.
      </p>
      <p className="text-gray-700">
        For questions, contact us at <a href="mailto:info@estore.com" className="text-blue-600 underline">info@estore.com</a>.
      </p>
    </div>
  </>
);

export default TermsOfServicePage; 