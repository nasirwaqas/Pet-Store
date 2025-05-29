const express = require('express');
const router = express.Router();
const pet = require('../controllers/pet.controller');
const user = require('../controllers/user.controller');
const admin = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/authMiddleware');


const multer = require('multer');
const path = require('path'); // Import the path module

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'client/public/images'); // Specify the directory where uploaded files should be stored
  },

filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Keep the original file name
  }
});

const upload = multer({ storage: storage });
// Route to handle pet uploads]
// Get all users
router.get('/users', admin.getAllUsers);

// Update user status (accept/reject/block)
router.put('/user-status', admin.updateUserStatus);

// Get all pets
router.get('/pets', admin.getAllPets);

// Update pet status (block/unblock)
router.put('/pet-status', admin.updatePetStatus);
// update pet detils
router.put('/pets/:id', admin.updatePet);
// Route for updating a user
router.put('/users/:id', admin.updateUser);
// Route for deleting a user
router.delete('/users/:id', admin.deleteUser);


module.exports = router;
