const express = require('express');
const router = express.Router();
const pet = require('../controllers/pet.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');


const multer = require('multer');
const path = require('path'); // Import the path module

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../client/public/images')); // Use absolute path
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Keep the original file name
  }
});

const upload = multer({ storage: storage });
// Route to handle pet uploads
router.get('/searchPets', pet.searchPets);
router.post('/uploadPet',authMiddleware, upload.array('images', 3), pet.uploadPet);
router.get('/getPetsByUser', authMiddleware, pet.getPetsByUser);
router.get('/:id', pet.getPetById);
router.put('/updatePet/:id', authMiddleware, upload.single('image'), pet.updatePet);
router.delete('/deletePet/:id', authMiddleware, pet.deletePet);
router.post('/:petId/review', authMiddleware, pet.addReview);
router.get('/:id/rating',  pet.getOverallRating);


module.exports = router;
