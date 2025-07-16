import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

// Export categories for use in admin pages
export const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Toys',
  'Automotive',
  'Health',
  'Food & Beverages',
  'Other',
];

// Accept product and isEdit props
const ProductForm = ({ onSuccess, product = null, isEdit = false, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [],
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Pre-fill form if editing
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
        images: product.images || [],
        isActive: typeof product.isActive === 'boolean' ? product.isActive : true,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/api/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setForm((prev) => ({ ...prev, images: [res.data.url] }));
    } catch (err) {
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
      };
      if (isEdit && product?._id) {
        // PUT request to update product
        await axios.put(`/api/products/${product._id}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // POST request to create product
        await axios.post('/api/products', productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (onSuccess) onSuccess();
      setForm({ name: '', description: '', price: '', stock: '', category: '', images: [], isActive: true });
    } catch (err) {
      setError(err.response?.data?.message || (isEdit ? 'Product update failed.' : 'Product creation failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="input mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className="input mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="input mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            className="input mt-1"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="input mt-1"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Active</label>
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          className="ml-2"
        />
        <span className="ml-2 text-sm text-gray-600">Product is active</span>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1"
        />
        {uploading && <LoadingSpinner size="sm" className="mt-2" />}
        {form.images.length > 0 && (
          <img
            src={form.images[0]}
            alt="Product Preview"
            className="mt-2 h-24 w-24 object-contain border rounded"
          />
        )}
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={submitting || uploading}
        className="btn-primary w-full"
      >
        {submitting ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save Changes' : 'Create Product'}
      </button>
      {isEdit && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary w-full mt-2"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default ProductForm; 