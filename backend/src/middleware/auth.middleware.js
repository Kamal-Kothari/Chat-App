import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
export const protectRoute =async  (req, res, next) => {
    try {
        const token = req.cookies.jwt;//use cookie-parser to get the token from cookies
            //jwt since while storing the token in cookies we used the name jwt
            // res.cookie('jwt', token, {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized : No token found' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //decode is the same object payload we passed while signing the token
            //decoded will have the userId we passed while signing the token
        if(!decoded) {
            return res.status(401).json({ message: 'Unauthorized : Invalid token' });
        }
        const user = await User.findById(decoded.userId).select('-password');
            //since we stored userId in token, we can use it to find the user
            // const token = jwt.sign({ userId }, process.env.JWT_SECRET
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized : User not found' });
        }
        req.user = user; // Attach the user to the request object
        next(); // Call the next middleware or route handler

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error in protectRoute' });

    }

}