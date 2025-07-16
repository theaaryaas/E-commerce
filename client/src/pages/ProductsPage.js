import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Parse query params for search/category
  const params = new URLSearchParams(location.search);
  const search = params.get('search') || '';
  const category = params.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = '/api/products?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;
        const res = await api.get(url);
        setProducts(res.data.data);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category]);

  return (
    <>
      <Helmet>
        <title>Products - E-Store</title>
        <meta name="description" content="Browse our wide selection of products." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-gray-600">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                to={`/products/${product._id}`}
                key={product._id}
                className="card hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-contain h-40 w-full"
                    />
                  ) : (
                    <div className="text-gray-400 text-6xl">📦</div>
                  )}
                </div>
                <div className="card-body flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 truncate">{product.name}</h2>
                    <p className="text-primary-600 font-bold text-xl mb-1">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="mt-2">
                    <span className="badge badge-info">{product.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage; 