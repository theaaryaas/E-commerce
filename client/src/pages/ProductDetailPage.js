import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product._id) {
      dispatch(addToCart({ productId: product._id, quantity }));
    }
  };

  return (
    <>
      <Helmet>
        <title>{product ? `${product.name} - E-Store` : 'Product Details - E-Store'}</title>
        <meta name="description" content={product ? product.description : 'Product details and information.'} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : product ? (
          <div className="flex flex-col md:flex-row gap-8 bg-white rounded shadow p-6">
            <div className="flex-shrink-0 flex justify-center items-center md:w-1/2">
              <img
                src={product.images?.[0]?.startsWith('http') ? product.images[0] : `${process.env.REACT_APP_API_URL}${product.images?.[0]}` || '/placeholder.png'}
                alt={product.name}
                className="w-full max-w-xs h-72 object-contain rounded"
              />
            </div>
            <div className="flex-1 space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="text-lg text-primary-600 font-semibold">${product.price.toFixed(2)}</div>
              <div className="text-gray-700">{product.description}</div>
              <div className="text-sm text-gray-500">Category: {product.category}</div>
              <div className="text-sm text-gray-500">Stock: {product.stock > 0 ? product.stock : 'Out of stock'}</div>
              {product.stock > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                    className="w-20 border rounded px-2 py-1"
                  />
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary px-6 py-2"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ProductDetailPage; 