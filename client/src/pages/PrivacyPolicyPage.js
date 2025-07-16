import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyPage = () => (
  <>
    <Helmet>
      <title>Privacy Policy - E-Store</title>
    </Helmet>
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 mb-2">
        We value your privacy. Your personal information is kept secure and is never shared with third parties except as required to process your orders or by law.
      </p>
      <p className="text-gray-700">
        For more details, please contact us at <a href="mailto:info@estore.com" className="text-blue-600 underline">info@estore.com</a>.
      </p>
    </div>
  </>
);

export default PrivacyPolicyPage; 