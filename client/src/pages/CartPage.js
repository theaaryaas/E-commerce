import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ productId, quantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>Shopping Cart - E-Store</title>
        <meta name="description" content="Your shopping cart items." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">Your cart is empty. <Link to="/products" className="text-blue-600 underline">Shop now</Link></div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded shadow p-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-2 text-left">Image</th>
                    <th className="px-2 py-2 text-left">Product</th>
                    <th className="px-2 py-2 text-left">Price</th>
                    <th className="px-2 py-2 text-left">Quantity</th>
                    <th className="px-2 py-2 text-left">Subtotal</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.product._id}>
                      <td className="py-2">
                        <img src={item.product.images?.[0]} alt={item.product.name} className="h-12 w-12 object-contain rounded" />
                      </td>
                      <td className="py-2 font-medium">
                        <Link to={`/products/${item.product._id}`} className="text-blue-700 hover:underline">{item.product.name}</Link>
                      </td>
                      <td className="py-2">${item.product.price.toFixed(2)}</td>
                      <td className="py-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleQuantityChange(item.product._id, parseInt(e.target.value, 10))}
                          className="w-16 border rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-2">${(item.product.price * item.quantity).toFixed(2)}</td>
                      <td className="py-2">
                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="text-red-600 hover:text-red-800 px-2"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center bg-gray-50 rounded p-4">
              <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>
              <button
                onClick={handleCheckout}
                className="btn-primary px-6 py-2"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage; 