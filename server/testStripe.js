const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const testStripe = async () => {
  try {
    console.log('🔍 Testing Stripe integration...\n');
    
    // Test 1: Check if Stripe key is loaded
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('❌ STRIPE_SECRET_KEY not found in environment variables');
      return;
    }
    
    console.log('✅ Stripe secret key found');
    console.log('Key starts with:', process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...\n');
    
    // Test 2: Test Stripe connection by creating a test payment intent
    console.log('🧪 Testing payment intent creation...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
      metadata: {
        test: 'true'
      }
    });
    
    console.log('✅ Payment intent created successfully!');
    console.log('Payment Intent ID:', paymentIntent.id);
    console.log('Status:', paymentIntent.status);
    console.log('Amount:', paymentIntent.amount / 100, 'USD');
    console.log('Currency:', paymentIntent.currency);
    
    // Test 3: Test customer creation
    console.log('\n🧪 Testing customer creation...');
    const customer = await stripe.customers.create({
      email: 'test@example.com',
      name: 'Test Customer',
      metadata: {
        test: 'true'
      }
    });
    
    console.log('✅ Customer created successfully!');
    console.log('Customer ID:', customer.id);
    console.log('Email:', customer.email);
    console.log('Name:', customer.name);
    
    // Test 4: Test webhook endpoint (if webhook secret is set)
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('\n✅ Stripe webhook secret found');
    } else {
      console.log('\n⚠️  STRIPE_WEBHOOK_SECRET not set (webhooks won\'t work)');
    }
    
    console.log('\n🎉 All Stripe tests passed! Your Stripe integration is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Stripe test failed:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('💡 This usually means your STRIPE_SECRET_KEY is invalid');
    } else if (error.type === 'StripeInvalidRequestError') {
      console.log('💡 This usually means there\'s an issue with the request parameters');
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your STRIPE_SECRET_KEY in the .env file');
    console.log('2. Make sure you\'re using test keys (sk_test_...) for development');
    console.log('3. Verify your Stripe account is active');
  }
};

// Run the test
testStripe(); 