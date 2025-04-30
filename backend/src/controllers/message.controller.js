import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js'; // Import the socket instance
export const getUsersForSidebar = async (req, res) => {
    try {
        const users = await User.find({_id : {$ne : req.user._id}}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error in sidebarUsers' });
        
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: otherUserId } = req.params; // Extract the ID from the request parameters
        const userId = req.user._id; // Get the logged-in user's ID from the request object
        // Find messages where the sender or receiver is the logged-in user and the other user
        const messages = await Message.find({
            $or : [
                {senderId : userId, receiverId : otherUserId},
                {senderId : otherUserId, receiverId : userId}
            ],
        })

        res.status(200).json(messages); // Send the messages as a response

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error in getMessages' });  
        
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params; // Extract the receiver ID from the request parameters
        const senderId = req.user._id; // Get the logged-in user's ID from the request object

        const { text, image } = req.body; // Extract the message text and image from the request body
        let imageUrl = null; // Initialize imageUrl to null
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image, { folder: 'messages' });
            imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            ...(imageUrl && { image: imageUrl }), // Use the image URL if an image is provided
            // image: imageUrl, // imageUrl will be null if no image is provided
        });

        await newMessage.save(); // Save the new message to the database

        const receiverSocketId = getReceiverSocketId(receiverId); // Get the socket ID of the receiver
        if(receiverSocketId) io.to(receiverSocketId).emit('message', newMessage); // Emit the message to the receiver's socket

        res.status(201).json(newMessage); // Send the newly created message as a response

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error in sendMessage' });
        
    }
}