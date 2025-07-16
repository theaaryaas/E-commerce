import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ProductForm from '../../components/admin/ProductForm';
import axios from 'axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Trash2, Pencil } from 'lucide-react';

// Import categories from ProductForm for consistency
import { categories } from '../../components/admin/ProductForm';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // For admin, fetch all products (active and inactive)
      const res = await axios.get('/api/products?limit=100&admin=true');
      setProducts(res.data.data);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(productId);
    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  // Filtered products based on search, category, and active status
  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    const matchesActive = filterActive === 'all' ? true : 
                         filterActive === 'active' ? product.isActive : 
                         !product.isActive;
    return matchesName && matchesCategory && matchesActive;
  });

  return (
    <>
      <Helmet>
        <title>Admin Products - E-Store</title>
        <meta name="description" content="Manage products in the e-commerce store." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Products</h1>
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
          <ProductForm onSuccess={fetchProducts} />
        </div>
        <h2 className="text-xl font-semibold mb-4">Product List</h2>
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input w-full sm:w-1/3"
          />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="input w-full sm:w-1/4"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterActive}
            onChange={e => setFilterActive(e.target.value)}
            className="input w-full sm:w-1/4"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-gray-600">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Image</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Price</th>
                  <th className="px-4 py-2 border-b">Stock</th>
                  <th className="px-4 py-2 border-b">Category</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-4 py-2 border-b">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="h-12 w-12 object-contain rounded" />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border-b font-medium">{product.name}</td>
                    <td className="px-4 py-2 border-b">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-2 border-b">{product.stock}</td>
                    <td className="px-4 py-2 border-b">{product.category}</td>
                    <td className="px-4 py-2 border-b">
                      <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1"
                        onClick={() => handleEdit(product)}
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-1"
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        title="Delete"
                      >
                        {deletingId === product._id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowEditModal(false);
                setEditingProduct(null);
              }}
              title="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <ProductForm
              product={editingProduct}
              onSuccess={handleEditSuccess}
              isEdit
              onCancel={() => {
                setShowEditModal(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProducts; 