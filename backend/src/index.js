import express from 'express';
import authRoutes from './routes/auth.route.js'; // .js needed for local imports
import messageRoutes from './routes/message.route.js'; // .js needed for local imports
import dotenv from 'dotenv';
import cors from 'cors'; // Middleware to enable CORS (Cross-Origin Resource Sharing)
dotenv.config(); // Load environment variables from .env file 
import cookieParser from 'cookie-parser'; // Middleware to parse cookies
import path from 'path'; // Node.js module to work with file and directory paths

import { connectDB } from './lib/db.js'; // Import the connectDB function

// const app = express();
import {app, server} from './lib/socket.js'; // Import the app and server from socket.js

const port = process.env.PORT || 5001; // Use the port from environment variables or default to 5001
const __dirname = path.resolve(); // Get the current directory name

app.use(express.json()); // Middleware to parse JSON request bodies
// app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin (your frontend URL)
  credentials: true, // Include credentials (cookies) in requests
}))
// app.use(cors()); // from all origins

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Serve static files from the frontend build directory
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html')); // Serve the index.html file for all other routes
  });
}

server.listen(port , () => {
  console.log('Server is running on port : '+ port);
  connectDB(); // Call the connectDB function to connect to MongoDB
});