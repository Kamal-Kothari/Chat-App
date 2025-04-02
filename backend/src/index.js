import express from 'express';
import authRoutes from './routes/auth.route.js'; // .js needed for local imports
import messageRoutes from './routes/message.route.js'; // .js needed for local imports
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file 
import cookieParser from 'cookie-parser'; // Middleware to parse cookies

import { connectDB } from './lib/db.js'; // Import the connectDB function

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
// app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);

const port = process.env.PORT || 5001; // Use the port from environment variables or default to 5001
app.listen(port , () => {
  console.log('Server is running on port : '+ port);
  connectDB(); // Call the connectDB function to connect to MongoDB
});