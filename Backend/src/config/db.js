import pkg from 'pg';
import { config } from './env.js';

const { Pool } = pkg;

export const pool = new Pool({
  user: config.dbUser,
  password: config.dbPassword,
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await pool.end();
    console.log('PostgreSQL disconnected');
  } catch (error) {
    console.error('Database disconnection error:', error);
    throw error;
  }
};

export const query = (text, params) => {
  return pool.query(text, params);
};

export const getClient = () => {
  return pool.connect();
};

