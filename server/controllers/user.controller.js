require('dotenv').config();
const bcrypt = require('bcryptjs');
const express = require('express');
const User = require("../modals/User");
const jwt = require('jsonwebtoken');

  

exports.register = async (req, res) => {
    try {
        const { name, email, password, role,   mobile,complaint, address, } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(200).send({ message: 'User Already Exist', success: false });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with hashed password and role
        const user = new User({ 
            name, 
            email, 
            password: hashedPassword, // corrected typo from 'hash' to 'hashedPassword'
            mobile,
            complaint,
            address,
            role // explicitly set the role
        });

        const savedUser = await user.save();
        console.log("savedUser", savedUser);

        const payload = {
            id: savedUser.id,
            name: savedUser.name,
            role: savedUser.role,
        };

        res.status(201).send({ message: 'Register successfully', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: `Register Controller ${error.message}` });
    }
};



exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: 'User Not found', success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: 'Invalid Credentials', success: false });
        }
        if (user.status === 'Rejected') {
            return res.status(403).json({ success: false, message: 'You have been rejected by admin' });
          }
        
        // Include additional user details in the token payload
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        // Get JWT_SECRET with fallback
        const jwtSecret = process.env.JWT_SECRET || 'secret123';
        
        // Debug logs
        console.log('JWT_SECRET at token creation:', jwtSecret);
        console.log('JWT_SECRET type:', typeof jwtSecret);
        
        if (!jwtSecret || jwtSecret.trim() === '') {
            throw new Error('JWT_SECRET is not defined or empty');
        }
        
        const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: 3600 });

        // Decode token to get the payload
        const decodedToken = jwt.decode(token);
        console.log('Token Details:', decodedToken);

        res.status(200).send({ message: 'Login successfully', success: true, token: token, user: user });
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).send({ message: `Error in Login server ${error.message}` });
    }
};

// exports.getUserData = async (req, res) => {
//     try {
//         const user = await User.findOne({ _id: req.body.userId });
//         if (!user) {
//             return res.status(200).send({ message: 'User Not found', success: false });
//         } else {
//             return res.status(201).send({  success: true, data: { name: user.name, email: user.email, role: user.role } });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ message: 'auth Error', success: false, error: error.message });
//     }
// };
exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(200).send({ message: 'User Not found', success: false });
        }

        return res.status(200).send({ 
            success: true, 
            data: { 
                name: user.name, 
                email: user.email, 
                address: user.address
            } 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error in fetching user data', success: false, error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const userId = req.user._id; // Access the userId from req.user

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, address },
            { new: true } // return the updated user
        );

        if (!updatedUser) {
            return res.status(404).send({ success: false, message: 'User not found!' });
        }

        res.status(200).send({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ success: false, message: 'Server error' });
    }
};

