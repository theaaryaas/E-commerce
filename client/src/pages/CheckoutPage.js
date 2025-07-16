import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { removeFromCart, fetchCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PaymentTestCard from '../components/ui/PaymentTestCard';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, loading: cartLoading } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth?.user);

  const [shipping, setShipping] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [step, setStep] = useState(1); // 1: shipping, 2: payment
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const orderIdRef = useRef(null);
  const [clientSecret, setClientSecret] = useState('');

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate('/cart');
    }
  }, [cartLoading, items.length, navigate]);

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    const required = ['street', 'city', 'state', 'zipCode', 'country'];
    const missing = required.filter(field => !shipping[field].trim());
    if (missing.length > 0) {
      toast.error(`Please fill in all required fields: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    if (!validateShipping()) return;
    setSubmitting(true);
    setError(null);
    try {
      await dispatch(fetchCart());
      // Create order in backend
      const res = await api.post('/api/orders', {
        orderItems: items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images?.[0],
          price: item.product.price,
          quantity: item.quantity,
        })),
        shippingAddress: shipping,
        paymentMethod: 'stripe',
        totalPrice: total,
      });
      orderIdRef.current = res.data.data._id;
      localStorage.setItem('currentOrderId', res.data.data._id);
      // Create payment intent
      const paymentRes = await api.post('/api/payments/create-payment-intent', {
        orderId: res.data.data._id
      });
      setClientSecret(paymentRes.data.clientSecret);
      setStep(2);
      toast.success('Order created successfully! Please complete payment.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create order.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error('Stripe is not loaded. Please refresh the page.');
      return;
    }
    setPaymentProcessing(true);
    setError(null);
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.name || '',
            email: user?.email || '',
            address: {
              line1: shipping.street,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.zipCode,
              country: shipping.country,
            },
          },
        },
      });
      if (stripeError) throw new Error(stripeError.message);

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment in backend
        let currentOrderId = orderIdRef.current || localStorage.getItem('currentOrderId');
        console.log('CheckoutPage: currentOrderId before redirect:', currentOrderId);
        if (!currentOrderId) {
          // Clear cart and localStorage
          items.forEach(item => {
            dispatch(removeFromCart(item.product._id));
          });
          localStorage.removeItem('currentOrderId');
          // Always redirect to order detail page, even if orderId is missing
          navigate('/orders/unknown?success=1');
          return;
        }
        await api.post('/api/payments/confirm', {
          orderId: currentOrderId,
          paymentIntentId: paymentIntent.id,
        });
        // Clear cart after successful payment
        items.forEach(item => {
          dispatch(removeFromCart(item.product._id));
        });
        toast.success('Payment successful! Redirecting to order confirmation...');
        setTimeout(() => {
          navigate(`/orders/${currentOrderId}?success=1`);
          // Remove orderId from localStorage after redirect
          setTimeout(() => {
            localStorage.removeItem('currentOrderId');
            console.log('CheckoutPage: currentOrderId removed from localStorage after redirect');
          }, 1000);
        }, 500);
      } else {
        throw new Error('Payment was not successful. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleBackToShipping = () => {
    setStep(1);
    setError(null);
  };

  if (cartLoading) {
    return <LoadingSpinner />;
  }

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <p>Add some items to your cart before checkout.</p>
        <Link to="/shop">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <input name="street" value={shipping.street} onChange={handleShippingChange} placeholder="Street" required className="input mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="city" value={shipping.city} onChange={handleShippingChange} placeholder="City" required className="input mb-4" />
                  <input name="state" value={shipping.state} onChange={handleShippingChange} placeholder="State" required className="input mb-4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="zipCode" value={shipping.zipCode} onChange={handleShippingChange} placeholder="Zip Code" required className="input mb-4" />
                  <select
                    name="country"
                    value={shipping.country}
                    onChange={handleShippingChange}
                    required
                    className="input mb-4"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="EG">Egypt</option>
                    <option value="SG">Singapore</option>
                    <option value="BR">Brazil</option>
                    <option value="ZA">South Africa</option>
                    <option value="JP">Japan</option>
                    <option value="CN">China</option>
                    <option value="RU">Russia</option>
                    <option value="MX">Mexico</option>
                    {/* Add more as needed */}
                  </select>
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full">Continue to Payment</button>
                {error && <div className="text-red-600 bg-red-50 p-3 rounded mt-2">{error}</div>}
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handlePayment} className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-4">Payment</h2>
                <CardElement options={CARD_ELEMENT_OPTIONS} className="mb-4" />
                <PaymentTestCard />
                <button type="submit" disabled={paymentProcessing || !stripe || !clientSecret} className="btn-primary w-full mb-2">
                  {paymentProcessing ? 'Processing...' : 'Pay Now'}
                </button>
                <button type="button" onClick={handleBackToShipping} disabled={paymentProcessing} className="btn-secondary w-full">Back</button>
                {error && <div className="text-red-600 bg-red-50 p-3 rounded mt-2">{error}</div>}
              </form>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <ul className="mb-4">
                {items.map(item => (
                  <li key={item.product._id} className="mb-2">
                    {item.product.name} x {item.quantity} = <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="text-lg font-bold">Total: ${total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
