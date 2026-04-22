const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_APP_NAME } = process.env;

const MONGO_URI = process.env.MONGO_URI || (
  MONGO_USERNAME && MONGO_PASSWORD && MONGO_CLUSTER
    ? `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/?appName=${MONGO_APP_NAME || 'Cluster0'}`
    : undefined
);

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MongoDB connection string is not configured');
    }

    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;