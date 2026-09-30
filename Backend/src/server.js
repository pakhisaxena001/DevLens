import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const PORT = config.port || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
