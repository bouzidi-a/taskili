const mongoose = require('mongoose');

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_APP_NAME } = process.env;

const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/?appName=${MONGO_APP_NAME}`;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('DB connected successfully');
  } catch (err) {
    console.error(`Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;