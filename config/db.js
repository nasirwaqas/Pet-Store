const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log(`Mongodb server is connected to ${mongoose.connection.host}`.bgGreen.white.bold);
    } catch (error) {
      console.log(`Mongodb server Issue: ${error.message}`.bgRed.white);
    }
};
module.exports = { connectDB };