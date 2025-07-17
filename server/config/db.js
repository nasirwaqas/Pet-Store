const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        // Set mongoose global options


        mongoose.set('strictQuery', false);
        
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`.bgGreen.white.bold);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.log(`MongoDB connection error: ${err}`.bgRed.white);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected'.bgYellow.black);
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected'.bgGreen.white);
        });
        
    } catch (error) {
        console.log(`MongoDB server Issue: ${error.message}`.bgRed.white);
        process.exit(1);
    }
};

module.exports = { connectDB };