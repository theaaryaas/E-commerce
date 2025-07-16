import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ShoppingCart, Package, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderNotFoundPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [recentOrderId, setRecentOrderId] = useState(null);
  
  // Check if this is a redirect from payment success
  const isSuccess = searchParams.get('success') === '1';

  useEffect(() => {
    // Check localStorage for recent order ID
    const storedOrderId = localStorage.getItem('currentOrderId');
    if (storedOrderId) {
      setRecentOrderId(storedOrderId);
    }

    // If this is a success redirect, show success message
    if (isSuccess) {
      toast.success('Payment successful! We\'re processing your order.');
    }
  }, [isSuccess]);

  const handleRetryOrder = () => {
    if (recentOrderId) {
      navigate(`/orders/${recentOrderId}?success=1`);
    } else {
      toast.error('No recent order found. Please try checking out again.');
      navigate('/cart');
    }
  };

  const handleContactSupport = () => {
    // You can implement this to open a contact form or redirect to support
    toast('Please contact support with your payment confirmation details.');
  };

  return (
    <>
      <Helmet>
        <title>Order Not Found - E-Store</title>
        <meta name="description" content="Order details could not be found." />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-yellow-100 mb-6">
            <AlertTriangle className="h-12 w-12 text-yellow-600" />
          </div>

          {/* Main Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isSuccess ? 'Payment Successful!' : 'Order Not Found'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {isSuccess 
              ? 'Your payment was processed successfully, but we couldn\'t locate your order details.'
              : 'We couldn\'t find the order you\'re looking for.'
            }
          </p>

          {/* Success Message */}
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center">
                <Package className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-800 font-medium">
                  Your payment has been confirmed and your order is being processed.
                </span>
              </div>
            </div>
          )}

          {/* Recent Order Retry */}
          {recentOrderId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center mb-2">
                <Package className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-blue-800 font-medium">Recent Order Found</span>
              </div>
              <p className="text-blue-700 text-sm mb-3">
                We found a recent order in your session. Would you like to view it?
              </p>
              <button
                onClick={handleRetryOrder}
                className="btn-primary w-full"
              >
                View Recent Order
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!recentOrderId && (
              <button
                onClick={handleContactSupport}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Contact Support
              </button>
            )}
            
            <Link 
              to="/orders" 
              className="w-full btn-primary flex items-center justify-center"
            >
              <Package className="w-4 h-4 mr-2" />
              View All Orders
            </Link>
            
            <Link 
              to="/cart" 
              className="w-full btn-secondary flex items-center justify-center"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Return to Cart
            </Link>
            
            <Link 
              to="/products" 
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Need Help?</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Check your email for order confirmation</p>
              <p>• Look in your order history</p>
              <p>• Contact our support team with your payment details</p>
              <p>• Check your bank statement for the transaction</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderNotFoundPage; 