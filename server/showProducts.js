const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const showProducts = async () => {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Fetch all products
    const products = await Product.find({}).populate('createdBy', 'name email');
    
    console.log(`📦 Found ${products.length} products in database:\n`);
    
    if (products.length === 0) {
      console.log('No products found in the database.');
      console.log('Run "node seedData.js" to populate with sample products.');
    } else {
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   ID: ${product._id}`);
        console.log(`   Price: $${product.price}`);
        console.log(`   Stock: ${product.stock}`);
        console.log(`   Category: ${product.category}`);
        console.log(`   Status: ${product.isActive ? '✅ Active' : '❌ Inactive'}`);
        console.log(`   Created by: ${product.createdBy ? product.createdBy.name : 'Unknown'}`);
        console.log(`   Created: ${product.createdAt.toLocaleDateString()}`);
        if (product.images && product.images.length > 0) {
          console.log(`   Images: ${product.images.length} image(s)`);
        }
        console.log(`   Description: ${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}`);
        console.log('   ──────────────────────────────────────────────────────────────');
      });
    }

    // Show summary
    const activeProducts = products.filter(p => p.isActive).length;
    const inactiveProducts = products.filter(p => !p.isActive).length;
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total Products: ${products.length}`);
    console.log(`   Active Products: ${activeProducts}`);
    console.log(`   Inactive Products: ${inactiveProducts}`);

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }
};

// Run the function
showProducts(); 