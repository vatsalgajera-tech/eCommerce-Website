const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // Check for unfilled placeholder URIs
  const isPlaceholder = !uri
    || uri.includes('<password>')
    || uri.includes('your_password')
    || (uri.includes('cluster0.xxxxx'));

  if (isPlaceholder) {
    console.log('\n⚠️  MongoDB URI not configured. Server running without database.\n');
    console.log('📋 Options to connect:');
    console.log('   LOCAL  → MONGO_URI=mongodb://localhost:27017/shreevastra');
    console.log('   ATLAS  → MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/shreevastra\n');
    return;
  }

  try {
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime error:', err.message);
    });

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });

    console.log(`\n✅ MongoDB Connected: ${conn.connection.host}\n`);
  } catch (err) {
    console.error(`\n❌ MongoDB Connection Failed: ${err.message}`);
    if (uri.includes('localhost')) {
      console.log('💡 Make sure MongoDB is running locally:');
      console.log('   → Open MongoDB Compass and connect to mongodb://localhost:27017');
      console.log('   → Or run: mongod --dbpath C:\\data\\db\n');
    } else {
      console.log('💡 Check your Atlas Network Access — allow IP 0.0.0.0/0\n');
    }
  }
};

module.exports = connectDB;
