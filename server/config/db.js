import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the URI from environment variables.
 * Called once at server startup. Exits process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

export default connectDB;