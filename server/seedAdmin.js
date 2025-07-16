const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seedAdmin() {
  const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

  // CHANGE THESE VALUES as needed
  const name = 'Admin User';
  const email = 'admin@example.com';
  const password = 'admin123';

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin user already exists:', email);
      process.exit(0);
    }

    const admin = new User({
      name,
      email,
      password,
      role: 'admin',
    });
    await admin.save();
    console.log('Admin user created:', email);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin user:', err);
    process.exit(1);
  }
}

seedAdmin(); 