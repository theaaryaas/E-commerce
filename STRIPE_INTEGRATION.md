# Stripe Integration Guide

This document outlines the Stripe payment integration implemented in the e-commerce application.

## Overview

The application uses Stripe's modern Payment Intents API for secure, PCI-compliant payment processing. This approach is more secure and flexible than the legacy Charges API.

## Architecture

### Backend (Node.js/Express)
- **Payment Routes**: `/server/routes/payments.js`
- **Stripe SDK**: `stripe@^14.7.0`
- **Payment Flow**: Payment Intents → Confirmation → Webhook handling

### Frontend (React)
- **Stripe Elements**: `@stripe/react-stripe-js@^2.4.0`
- **Stripe JS**: `@stripe/stripe-js@^2.4.0`
- **Payment Flow**: Card Element → Payment Intent → Confirmation

## Key Features

### ✅ Modern Payment Processing
- Uses Stripe Payment Intents API (recommended)
- Secure client-side card collection
- Server-side payment confirmation
- Webhook support for real-time updates

### ✅ User Experience
- Two-step checkout process (Shipping → Payment)
- Real-time validation and error handling
- Progress indicators
- Responsive design
- Toast notifications for feedback

### ✅ Security
- PCI-compliant card handling
- Server-side payment intent creation
- Customer management in Stripe
- Webhook signature verification

### ✅ Development Tools
- Test card numbers for different scenarios
- Development mode test card display
- Comprehensive error handling
- Debug logging

## Environment Variables

### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_...          # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...        # Webhook endpoint secret
```

### Frontend (.env)
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Stripe publishable key
```

## Payment Flow

### 1. Order Creation
```javascript
// Create order in database
const order = await Order.create({
  user: req.user.id,
  orderItems: items,
  shippingAddress: shipping,
  totalPrice: total
});
```

### 2. Payment Intent Creation
```javascript
// Create payment intent on server
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(order.totalPrice * 100),
  currency: 'usd',
  customer: stripeCustomerId,
  metadata: { orderId: order._id.toString() }
});
```

### 3. Client-Side Payment
```javascript
// Confirm payment on client
const { paymentIntent, error } = await stripe.confirmCardPayment(
  clientSecret,
  {
    payment_method: {
      card: cardElement,
      billing_details: { name, email, address }
    }
  }
);
```

### 4. Payment Confirmation
```javascript
// Confirm payment on server
if (paymentIntent.status === 'succeeded') {
  await order.markAsPaid(paymentResult);
}
```

## API Endpoints

### Payment Routes (`/api/payments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-payment-intent` | Create payment intent for order |
| POST | `/confirm` | Confirm payment completion |
| GET | `/methods` | Get user's saved payment methods |
| POST | `/create-customer` | Create Stripe customer |
| POST | `/webhook` | Handle Stripe webhooks |
| GET | `/status/:paymentIntentId` | Get payment status |

## Webhook Events

The application handles these Stripe webhook events:

- `payment_intent.succeeded` - Mark order as paid
- `payment_intent.payment_failed` - Mark order as failed
- `customer.created` - Log customer creation
- `customer.updated` - Log customer updates

## Test Cards

For development and testing, use these Stripe test card numbers:

| Card Type | Number | Description |
|-----------|--------|-------------|
| Visa (Success) | `4242424242424242` | Standard successful payment |
| Visa (Declined) | `4000000000000002` | Card declined |
| Visa (Insufficient) | `4000000000009995` | Insufficient funds |
| Visa (Expired) | `4000000000000069` | Expired card |
| Visa (Wrong CVC) | `4000000000000127` | Incorrect CVC |
| Visa (Processing Error) | `4000000000000119` | Processing error |

## Error Handling

### Client-Side Errors
- Card validation errors
- Network errors
- Payment confirmation failures
- User-friendly error messages with toast notifications

### Server-Side Errors
- Invalid order ID
- Unauthorized access
- Stripe API errors
- Database errors
- Webhook signature verification failures

## Security Best Practices

### ✅ Implemented
- Server-side payment intent creation
- Client-side card element (PCI compliant)
- Webhook signature verification
- Customer authentication
- Input validation and sanitization

### 🔒 Additional Recommendations
- Rate limiting on payment endpoints
- Request logging and monitoring
- Regular security audits
- PCI DSS compliance (if handling real payments)

## Development Setup

### 1. Install Dependencies
```bash
# Backend
cd server
npm install stripe

# Frontend
cd client
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Configure Environment
```bash
# Backend .env
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend .env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 3. Set Up Webhooks
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to environment variables

### 4. Test Payment Flow
1. Add items to cart
2. Proceed to checkout
3. Fill shipping information
4. Use test card numbers for payment
5. Verify order confirmation

## Production Considerations

### Environment Variables
- Use production Stripe keys
- Set up production webhook endpoints
- Configure proper CORS settings

### Monitoring
- Set up Stripe Dashboard monitoring
- Implement payment failure alerts
- Monitor webhook delivery

### Compliance
- Ensure PCI DSS compliance
- Implement proper data retention policies
- Regular security updates

## Troubleshooting

### Common Issues

1. **Payment Intent Creation Fails**
   - Check Stripe secret key
   - Verify order exists and belongs to user
   - Check amount format (must be in cents)

2. **Webhook Not Receiving Events**
   - Verify webhook endpoint URL
   - Check webhook secret
   - Ensure endpoint is publicly accessible

3. **Card Payment Fails**
   - Use correct test card numbers
   - Check card expiry and CVC
   - Verify billing address format

4. **Client Secret Issues**
   - Ensure client secret is fresh
   - Check payment intent status
   - Verify amount matches order

### Debug Tools
- Stripe Dashboard logs
- Browser developer tools
- Server console logs
- Webhook event logs

## Migration from Legacy API

If migrating from the legacy Charges API:

1. **Update Dependencies**
   - Remove `react-stripe-checkout`
   - Install `@stripe/react-stripe-js`

2. **Update Payment Flow**
   - Replace token-based payments with Payment Intents
   - Update client-side payment confirmation
   - Modify webhook handling

3. **Test Thoroughly**
   - Test all payment scenarios
   - Verify webhook events
   - Check order status updates

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://community.stripe.com)

For application-specific issues:
- Check server logs
- Review browser console
- Verify environment configuration 