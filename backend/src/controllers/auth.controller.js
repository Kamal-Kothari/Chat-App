import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../lib/cloudinary.js';

import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            //generate token
            const token = generateToken(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });


        } else {
            return res.status(400).json({ message: 'User not created' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error in signup' });

    }



}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials!!' });
        }
        //generate token
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error in login' });
    }
}
export const logout = (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error in logout' });
    }
}

export const updateProfile = async (req, res) => {
    //options to store images : cloudinary, s3, local storage, mongodb base64
    //cloudinary 25 credits per month , storage 1credit=1gb, viewing (5mb image loaded by 1000 users = 5gb) 1credit=1gb, editing credit=1000transformations.

    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const userId = req.user._id; // Get the user ID from the request object, which is set by the protectRoute middleware
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: 'profilePics',
            width: 150,
            height: 150,
            crop: 'fill',
        });
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true } // Return the updated user document
        );
        res.status(200).json(updatedUser);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error in updateProfile' });

    }
}

export const checkAuth = (req, res) => {
    try {
        const user = req.user; // Get the user from the request object, which is set by the protectRoute middleware
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error in checkAuth' });
    }
}