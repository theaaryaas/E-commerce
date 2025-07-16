import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Helmet>
        <title>Orders - E-Store</title>
        <meta name="description" content="View your order history." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-gray-600">You have no orders yet.</div>
        ) : (
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left">Order #</th>
                  <th className="px-2 py-2 text-left">Date</th>
                  <th className="px-2 py-2 text-left">Total</th>
                  <th className="px-2 py-2 text-left">Status</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td className="py-2 font-mono">{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-2">${order.totalPrice?.toFixed(2) || '0.00'}</td>
                    <td className="py-2">{order.isPaid ? <span className="text-green-700">Paid</span> : <span className="text-yellow-700">Pending</span>}</td>
                    <td className="py-2">
                      <Link to={`/orders/${order._id}`} className="btn-secondary">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage; 