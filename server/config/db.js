const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI);  // Add this debug line
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
