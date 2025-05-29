const mongoose = require('mongoose');
const { Schema } = mongoose; // Importing Schema from mongoose

const PetSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true 
  },
  breed: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  about: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  accountNumber: { 
    type: String, 
    required: true 
  },
  color: { 
    type: String, 
    required: false
    },
  reviews: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who gave the review
      name: { type: String }, // Ensure this field exists
      rating: { type: Number, }, // Rating given by the user (1-5)
      headline: { type: String, required: true }, // Review heading
      review: { type: String, required: true }, // Review contents
      createdAt: { type: Date, default: Date.now },
    }
  ],

  images: [String], // Array to store image file paths
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Reference to the User model
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['Available', 'Blocked', 'Unblocked'], 
    default: 'Available' 
  }
});

module.exports = mongoose.model("Pet", PetSchema);
