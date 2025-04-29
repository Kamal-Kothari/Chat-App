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

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });

    // socket.on("message", (message) => {
    //     console.log("Message received:", message);
    //     // Broadcast the message to all connected clients
    //     io.emit("message", message);
    // });
});

export  {app, server, io};