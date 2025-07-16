import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { CheckCircle, XCircle, Clock, Package, Truck, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isSuccess = searchParams.get('success') === '1';
  const navigate = useNavigate();

  // Check for missing order ID and redirect to OrderNotFoundPage
  useEffect(() => {
    console.log('OrderDetailPage: orderId from URL:', orderId);
    if (!orderId || orderId === 'undefined' || orderId === 'null') {
      // Try to fetch the latest order for the user as a fallback
      fetchLatestOrder();
      return;
    }
  }, [orderId, navigate]);

  const fetchLatestOrder = async () => {
    try {
      const response = await api.get('/api/orders');
      const orders = response.data.data;
      if (orders && orders.length > 0) {
        const latestOrder = orders[0];
        setOrder(latestOrder);
        setLoading(false);
        toast.success('Showing your most recent order.');
      } else {
        setError('No orders found for your account.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch your recent orders.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log('OrderDetailPage: Fetching order with ID:', orderId);
        const response = await api.get(`/api/orders/${orderId}`);
        setOrder(response.data.data);
        
        if (isSuccess) {
          toast.success('Payment successful! Your order has been confirmed.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a valid orderId
    if (orderId && orderId !== 'undefined' && orderId !== 'null') {
      fetchOrder();
    }
  }, [orderId, isSuccess]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <CheckCircle className="w-5 h-5 text-green-500" />; // Show green check for processing
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <Package className="w-5 h-5 text-green-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-green-100 text-green-800'; // Show processing as green
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'processing':
        return 'Confirmed & Processing';
      case 'pending':
        return 'Pending';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  let content;

  if (loading) {
    content = <LoadingSpinner />;
  } else if (error) {
    content = (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/orders" className="btn-primary">
            View All Orders
          </Link>
        </div>
      </div>
    );
  } else if (!order) {
    content = null;
  } else {
    content = (
      <>
        <Helmet>
          <title>Order #{order._id.slice(-8)} - E-Store</title>
          <meta name="description" content="Order details and status." />
        </Helmet>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Success Message */}
          {isSuccess && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-8 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-green-800 mb-2">
                    🎉 Order Confirmed Successfully!
                  </h2>
                  <p className="text-green-700 mb-3">
                    Your payment has been processed and your order is now confirmed. 
                    We're preparing your items for shipment.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700 font-medium">Order Status:</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        Confirmed & Processing
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-green-700 font-medium">Payment Status:</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        ✅ Paid
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h1>
                <p className="text-gray-600 mt-1">Placed on {formatDate(order.createdAt)}</p>
                {isSuccess && (
                  <p className="text-green-600 mt-1 font-medium">
                    ✅ Payment completed on {formatDate(new Date())}
                  </p>
                )}
              </div>
              <div className="mt-4 sm:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{getStatusLabel(order.status)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                {isSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-green-700 text-sm font-medium">
                        All items confirmed and ready for processing
                      </span>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {(order.items || []).map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img 
                        src={item.image?.startsWith('http') ? item.image : `${process.env.REACT_APP_API_URL}${item.image}`}
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)} each</p>
                        {isSuccess && (
                          <div className="flex items-center mt-1">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-600 font-medium">Confirmed</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <div className="text-gray-600">
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Payment Information</h3>
                    <div className="text-gray-600">
                      <p>Payment Method: {order.paymentMethod}</p>
                      <p>Payment Status: {order.isPaid ? 'Paid' : 'Pending'}</p>
                      {order.paidAt && (
                        <p>Paid on: {formatDate(order.paidAt)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                {isSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-green-700 text-sm font-medium">
                        Order & Payment Confirmed
                      </span>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${(order.itemsTotal ?? order.itemsPrice ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">${(order.shippingPrice ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">${(order.taxPrice ?? 0).toFixed(2)}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${(order.totalPrice ?? 0).toFixed(2)}</span>
                  </div>
                  {isSuccess && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center">
                      <span className="text-green-700 text-sm font-medium">
                        ✅ Payment Completed
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Link to="/orders" className="w-full btn-secondary flex items-center justify-center">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Orders
                </Link>
                {order.status === 'delivered' && (
                  <button className="w-full btn-primary">
                    Leave Review
                  </button>
                )}
              </div>

              {/* Next Steps Section - Only show after successful payment */}
              {isSuccess && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-3">What's Next?</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>You'll receive an email confirmation shortly</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>We'll notify you when your order ships</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Track your order status in your account</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return content;
};

export default OrderDetailPage; 