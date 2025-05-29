const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Pet = require("../modals/Pet"); // Check that the path is correct
const User = require("../modals/User"); // Check that the path is 
const jsonwebtoken = require("../middlewares/authMiddleware");
const jwt = require('jsonwebtoken');
const Review = require("../modals/Review")


exports.uploadPet = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded', error: 'No files provided in the request' });
    }

    const { category, breed, price, description, accountNumber,about, details, discount, color } = req.body;
    const images = req.files.map(file => file.path); // Map over files to get paths

    // Create a new pet document
    const newPet = new Pet({
      category,
      breed,
      price,
      description,
      about,
      details,
      discount,
      color,
      accountNumber,
      images,
      uploadedBy: req.user._id, // Associate pet with user
    });

    // Save the pet document
    const savedPet = await newPet.save();

    // Populate the uploadedBy field
    const populatedPet = await Pet.findById(savedPet._id).populate('uploadedBy').exec();

    res.status(201).json({ message: 'Pet uploaded successfully', pet: populatedPet });
  } catch (error) {
    console.error('Error in uploadPet:', error);
    res.status(500).json({ message: 'Error uploading pet', error: error.message });
  }
};

  exports.getPetsByUser = async (req, res) => {
    try {
      const userId = req.user._id; // Assuming the user ID is stored in the token and extracted by authMiddleware
  
      const pets = await Pet.find({ uploadedBy: userId });
  
      if (!pets) {
        return res.status(404).json({ success: false, message: 'No pets found for this user' });
      }
  
      res.status(200).json({ success: true, pets });
    } catch (error) {
      console.error('Error fetching pets:', error);
      res.status(500).json({ success: false, message: 'Error fetching pets', error: error.message });
    }
  };


// Update a pet by ID

exports.updatePet = async (req, res) => {
    try {
      const petId = req.params.id;
      const existingPet = await Pet.findById(petId);
  
      if (!existingPet) {
        return res.status(404).json({ success: false, message: 'Pet not found' });
      }
  
      // Handle image upload if a new file is provided
      let newImagePath = existingPet.images[0]; // Keep the old image path by default
      if (req.file) {
        newImagePath = `images/${req.file.filename}`; // Update with the new image path
  
        // Optionally delete the old image from the server
        if (existingPet.images[0] && existingPet.images[0] !== newImagePath) {
          const oldImagePath = path.join(__dirname, '..', 'public', existingPet.images[0]);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }
  
      // Update the pet details
      const updatedPet = await Pet.findByIdAndUpdate(
        petId,
        {
          category: req.body.category || existingPet.category,
          breed: req.body.breed || existingPet.breed,
          price: req.body.price || existingPet.price,
          description: req.body.description || existingPet.description,
          accountNumber: req.body.accountNumber || existingPet.accountNumber,
          about: req.body.about || existingPet.about,
          details: req.body.details || existingPet.details,
          discount: req.body.discount || existingPet.discount,
          color: req.body.color || existingPet.color,
          images: [newImagePath],
        },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: 'Pet updated successfully',
        pet: updatedPet,
      });
    } catch (error) {
      console.error('Error updating pet:', error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  };


exports.deletePet = async (req, res) => {
    try {
      const petId = req.params.id;
  
      // Find the pet by ID and delete it
      const deletedPet = await Pet.findByIdAndDelete(petId);
  
      if (!deletedPet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Pet deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting pet:', error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  };

  exports.getPetById = async (req, res) => {
    const petId = req.params.id;
  
    try {
      // Find the pet by ID using Mongoose
      const pet = await Pet.findById(petId);
  
      // If pet is not found, return 404
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
  
      // If pet is blocked, return 403 (forbidden)
      if (pet.status === 'blocked') {
        return res.status(403).json({ message: 'Pet is blocked' });
      }
  
      // Return the pet data
      res.status(200).json(pet);
    } catch (error) {
      console.error('Error fetching pet details:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  exports.addReview = async (req, res) => {
    try {
      const { petId } = req.params; // Get petId from URL params
      const { rating, headline, review } = req.body; // Get review data from request body
      const userId = req.user._id; // Assuming user ID comes from authentication middleware (JWT)
  
      // Validate review input
      if (!rating || !headline || !review) {
        return res.status(400).json({ message: 'All fields are required: rating, headline, and review.' });
      }
  
      // Find the pet by its ID
      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
  
      // Check if the user has already reviewed this pet
      const existingReview = pet.reviews.find(r => r.user.toString() === userId.toString());
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this pet.' });
      }
  
      // Fetch the user to get their username
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add a new review
      const newReview = {
        user: userId,
        name: user.name,
        rating,
        headline,
        review,
      };
  
      // Add the new review to the pet's reviews array
      pet.reviews.push(newReview);
  
      // Save the pet to persist the new review in the database
      await pet.save();
  
      res.status(201).json({ message: 'Review added successfully', pet });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  
  exports.getOverallRating = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the pet along with its reviews
      const pet = await Pet.findById(id).populate('reviews.user', 'name'); // Optionally populate user details for reviews
  
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
  
      // Calculate the rating breakdown
      const ratingBreakdown = pet.reviews.reduce(
        (acc, review) => {
          acc[review.rating] = (acc[review.rating] || 0) + 1;
          return acc;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      );
  
      const totalRatings =
        ratingBreakdown[5] +
        ratingBreakdown[4] +
        ratingBreakdown[3] +
        ratingBreakdown[2] +
        ratingBreakdown[1];
  
      // If there are no ratings, return 0 as the overall rating
      if (totalRatings === 0) {
        return res.json({ overallRating: 0, ratingBreakdown, totalRatings, reviews: [] });
      }
  
      const weightedSum =
        5 * ratingBreakdown[5] +
        4 * ratingBreakdown[4] +
        3 * ratingBreakdown[3] +
        2 * ratingBreakdown[2] +
        1 * ratingBreakdown[1];
  
      const overallRating = (weightedSum / totalRatings).toFixed(1);
  
      // Respond with the overall rating, rating breakdown, total ratings, and the list of reviews
      res.json({
        overallRating,
        ratingBreakdown,
        totalRatings,
        reviews: pet.reviews // Send all reviews for the pet
      });
    } catch (error) {
      console.error('Error fetching overall rating and reviews:', error);
      res.status(500).json({ message: 'Error fetching overall rating and reviews' });
    }
  };

  

exports.searchPets = async (req, res) => {
  try {
    const { category, breed, minPrice, maxPrice, minRating } = req.query;

    // Construct a query object based on search filters
    let query = {};
    if (category) query.category = { $regex: new RegExp(category, 'i') }; // Case-insensitive search
    if (breed) query.breed = { $regex: new RegExp(breed, 'i') }; // Case-insensitive for breed
    if (minPrice) query.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    
    // Find pets with the specified filters
    let pets = await Pet.find(query);

    // If minRating is specified, calculate the average rating and filter based on it
    if (minRating) {
      pets = pets.filter(pet => {
        const totalReviews = pet.reviews.length;
        const totalRating = pet.reviews.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;
        return avgRating >= parseFloat(minRating);
      });
    }

    res.json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).send('Error fetching pets');
  }
};
