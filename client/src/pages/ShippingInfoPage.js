import React from 'react';
import { Helmet } from 'react-helmet-async';

const ShippingInfoPage = () => (
  <>
    <Helmet>
      <title>Shipping Info - E-Store</title>
    </Helmet>
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Shipping Info</h1>
      <p className="text-gray-700 mb-2">
        We offer fast and reliable shipping on all orders. Free shipping is available for orders over $100. Orders are processed within 1-2 business days and delivered within 3-7 business days.
      </p>
      <p className="text-gray-700">
        For shipping questions, contact us at <a href="mailto:info@estore.com" className="text-blue-600 underline">info@estore.com</a>.
      </p>
    </div>
  </>
);

export default ShippingInfoPage; 