import express from 'express';
import authRoutes from './routes/auth.route.js'; // .js needed for local imports
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file 

import { connectDB } from './lib/db.js'; // Import the connectDB function

const app = express();

app.use('/api/auth',authRoutes)

const port = process.env.PORT || 5001; // Use the port from environment variables or default to 5001
app.listen(port , () => {
  console.log('Server is running on port : '+ port);
  connectDB(); // Call the connectDB function to connect to MongoDB
});