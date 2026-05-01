import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'budget_generator',
  password: process.env.DB_PASSWORD || 'mysecretpassword',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('📦 Connected to PostgreSQL database successfully.');
    client.release();
  } catch (error) {
    console.error('❌ Error connecting to PostgreSQL database:', error);
    process.exit(1); // Stop the application if DB connection fails
  }
};
