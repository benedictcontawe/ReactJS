import mongoose from 'mongoose';

/**
 * MongoDB connection configuration.
 * Connects to MongoDB Atlas using the connection string from environment variables.
 * 
 * Required environment variable:
 * - MONGODB_URI: MongoDB Atlas connection string (e.g., mongodb+srv://username:password@cluster.mongodb.net/dbname)
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('[MONGODB] ✗ MONGODB_URI environment variable is not set');
  console.error('[MONGODB] Please set MONGODB_URI in your .env file');
  throw new Error('MONGODB_URI is required');
}

/**
 * Connects to MongoDB Atlas.
 * This function should be called once when the server starts.
 * 
 * @returns Promise that resolves when connection is established
 */
export const connectMongoDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('[MONGODB] Already connected');
      return;
    }

    console.log('[MONGODB] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('[MONGODB] ✓ Successfully connected to MongoDB Atlas');
    
    // Log connection info
    console.log('[MONGODB] Database:', mongoose.connection.db?.databaseName);
    console.log('[MONGODB] Host:', mongoose.connection.host);
  } catch (error: any) {
    console.error('[MONGODB] ✗ Connection error:', error.message);
    console.error('[MONGODB] Make sure your MONGODB_URI is correct and your IP is whitelisted');
    throw error;
  }
};

/**
 * Disconnects from MongoDB.
 * Useful for graceful shutdown.
 */
export const disconnectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('[MONGODB] Disconnected from MongoDB');
  } catch (error: any) {
    console.error('[MONGODB] Error disconnecting:', error.message);
  }
};

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('[MONGODB] Connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('[MONGODB] Disconnected from MongoDB');
});

export default mongoose;