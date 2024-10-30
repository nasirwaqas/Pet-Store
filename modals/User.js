const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    required: true,
  },
  address: {
    type: String
  },
  mobile: {
    type: String,
    required: false,
  },
  complaint: {
    type: String,
    required: false,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  experience: {
    type: String,
    default: '',
  },
  expertise: {
    type: String,
    default: '',
  },
  qualification: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending' 
  },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }] // Array to store pet IDs
});

module.exports = mongoose.model("User", UserSchema);