import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    }
});

const userSocketMap = {}; // Map to store user IDs and their corresponding socket IDs
// {
//     userId1: socketId1,
//     userId2: socketId2,
//     userId3: socketId3,
// }

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    const userId = socket.handshake.query.userId; // Get userId from the query parameters
    // io("http://localhost:3000", { query: { userId: "123" } });

    if (userId) userSocketMap[userId] = socket.id; // Store the socket ID for the user
    console.log("User ID:", userId, "Socket ID:", socket.id);

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Send the updated list of online users to all clients

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
        // Remove the user from the map when they disconnect
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Send the updated list of online users to all clients
    });

    // socket.on("message", (message) => {
    //     console.log("Message received:", message);
    //     // Broadcast the message to all connected clients
    //     io.emit("message", message);
    // });
});

export { app, server, io };