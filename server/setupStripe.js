const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const dotenv = require('dotenv');

dotenv.config();

async function setupStripe() {
  console.log('🔧 Setting up Stripe integration...\n');

  try {
    // Test Stripe connection
    console.log('1. Testing Stripe connection...');
    const account = await stripe.accounts.retrieve();
    console.log(`✅ Connected to Stripe account: ${account.business_profile?.name || account.id}\n`);

    // List existing webhooks
    console.log('2. Checking existing webhooks...');
    const webhooks = await stripe.webhookEndpoints.list();
    
    if (webhooks.data.length === 0) {
      console.log('❌ No webhooks found. You need to create webhooks manually.');
      console.log('   Go to: https://dashboard.stripe.com/webhooks');
      console.log('   Add endpoint: https://your-domain.com/api/payments/webhook');
      console.log('   Select events: payment_intent.succeeded, payment_intent.payment_failed\n');
    } else {
      console.log('✅ Found webhooks:');
      webhooks.data.forEach(webhook => {
        console.log(`   - ${webhook.url} (${webhook.status})`);
        console.log(`     Events: ${webhook.enabled_events.join(', ')}`);
      });
      console.log();
    }

    // Test payment intent creation
    console.log('3. Testing payment intent creation...');
    const testPaymentIntent = await stripe.paymentIntents.create({
      amount: 2000, // $20.00
      currency: 'usd',
      description: 'Test payment intent',
      metadata: {
        test: 'true'
      }
    });
    console.log(`✅ Created test payment intent: ${testPaymentIntent.id}`);
    console.log(`   Client secret: ${testPaymentIntent.client_secret.substring(0, 20)}...\n`);

    // Clean up test payment intent
    await stripe.paymentIntents.cancel(testPaymentIntent.id);
    console.log('✅ Cancelled test payment intent\n');

    // Check environment variables
    console.log('4. Checking environment variables...');
    const requiredVars = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
      console.log('✅ All required environment variables are set');
    } else {
      console.log('❌ Missing environment variables:');
      missingVars.forEach(varName => {
        console.log(`   - ${varName}`);
      });
    }
    console.log();

    // Display test card information
    console.log('5. Test Card Information:');
    console.log('   Use these test cards for development:');
    console.log('   - Success: 4242424242424242');
    console.log('   - Decline: 4000000000000002');
    console.log('   - Insufficient: 4000000000009995');
    console.log('   - Expired: 4000000000000069');
    console.log('   - Wrong CVC: 4000000000000127');
    console.log('   - Processing Error: 4000000000000119\n');

    console.log('🎉 Stripe setup check completed!');
    console.log('\nNext steps:');
    console.log('1. Set up webhooks in Stripe Dashboard');
    console.log('2. Add webhook secret to .env file');
    console.log('3. Test payment flow with test cards');
    console.log('4. Monitor webhook events in Stripe Dashboard');

  } catch (error) {
    console.error('❌ Error during Stripe setup:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n💡 Make sure your STRIPE_SECRET_KEY is correct');
    } else if (error.type === 'StripePermissionError') {
      console.log('\n💡 Check your Stripe account permissions');
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupStripe();
}

module.exports = setupStripe; 