import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const statusOptions = [
  'all',
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusUpdateError, setStatusUpdateError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/orders/admin/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOrders(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setStatusUpdateError(null);
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchOrders();
    } catch (err) {
      setStatusUpdateError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtering and search (client-side)
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      !search ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Order #', 'User', 'Email', 'Date', 'Total', 'Status', 'Items'];
    const rows = filteredOrders.map(order => [
      order._id,
      order.user?.name || '',
      order.user?.email || '',
      new Date(order.createdAt).toLocaleDateString(),
      order.totalPrice?.toFixed(2) || '0.00',
      order.status,
      order.items.map(item => `${item.name} x${item.quantity}`).join('; '),
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Admin Orders - E-Store</title>
        <meta name="description" content="Manage orders in the e-commerce store." />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Orders</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="input w-full sm:w-48"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input w-full sm:w-64"
          />
          <button onClick={handleExportCSV} className="btn-secondary whitespace-nowrap">Export CSV</button>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-gray-600">No orders found.</div>
        ) : (
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left">Order #</th>
                  <th className="px-2 py-2 text-left">User</th>
                  <th className="px-2 py-2 text-left">Date</th>
                  <th className="px-2 py-2 text-left">Total</th>
                  <th className="px-2 py-2 text-left">Status</th>
                  <th className="px-2 py-2 text-left">Items</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td className="py-2 font-mono">{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-2">{order.user?.name} <br /><span className="text-xs text-gray-500">{order.user?.email}</span></td>
                    <td className="py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-2">${order.totalPrice?.toFixed(2) || '0.00'}</td>
                    <td className="py-2">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className="input"
                      >
                        {statusOptions.filter(s => s !== 'all').map(status => (
                          <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                      </select>
                      {updatingId === order._id && <span className="ml-2 text-xs text-gray-500">Updating...</span>}
                    </td>
                    <td className="py-2">
                      <ul className="text-xs">
                        {order.items.map(item => (
                          <li key={item.product?._id || item.name}>
                            {item.name} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-2">
                      <a href={`/orders/${order._id}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {statusUpdateError && <div className="text-red-600 mt-2">{statusUpdateError}</div>}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders; 