const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require("../modals/Product"); // Check that the path is correct
const User = require("../modals/User"); // Check that the path is 
const jsonwebtoken = require("../middlewares/authMiddleware");
const jwt = require('jsonwebtoken');
const Review = require("../modals/Review")


exports.uploadProduct = async (req, res) => {
  try {
    const { category, size, price, description, accountNumber, about, details, discount, color } = req.body;
    // Save only the relative path for each image
    const images = req.files.map(file => file.filename);

    // Create a new Product document
    const newProduct = new Product({
      category,
      size,
      price,
      description,
      about,
      details,
      discount,
      color,
      accountNumber,
      images,
      uploadedBy: req.user._id, // Associate Product with user
    });

    // Save the Product document
    const savedProduct = await newProduct.save();

    // Populate the uploadedBy field
    const populatedProduct = await Product.findById(savedProduct._id).populate('uploadedBy').exec();

    res.status(201).json({ message: 'Product uploaded successfully', product: populatedProduct });
  } catch (error) {
    console.error('Error in uploadProduct:', error);
    res.status(500).json({ message: 'Error uploading product', error: error.message });
  }
};

exports.getProductsByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming the user ID is stored in the token and extracted by authMiddleware

    const products = await Product.find({ uploadedBy: userId });

    if (!products) {
      return res.status(404).json({ success: false, message: 'No products found for this user' });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
};


// Update a product by ID

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Handle image upload if a new file is provided
    let newImagePath = existingProduct.images[0]; // Keep the old image path by default
    if (req.file) {
      newImagePath = `images/${req.file.filename}`; // Update with the new image path

      // Optionally delete the old image from the server
      if (existingProduct.images[0] && existingProduct.images[0] !== newImagePath) {
        const oldImagePath = path.join(__dirname, '..', 'public', existingProduct.images[0]);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // Update the Product details
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        category: req.body.category || existingProduct.category,
        size: req.body.size || existingProduct.size,
        price: req.body.price || existingProduct.price,
        description: req.body.description || existingProduct.description,
        accountNumber: req.body.accountNumber || existingProduct.accountNumber,
        about: req.body.about || existingProduct.about,
        details: req.body.details || existingProduct.details,
        discount: req.body.discount || existingProduct.discount,
        color: req.body.color || existingProduct.color,
        images: [newImagePath],
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Product:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the Product by ID using Mongoose
    const product = await Product.findById(productId);

    // If product is not found, return 404
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If Product is blocked, return 403 (forbidden)
    if (product.status === 'blocked') {
      return res.status(403).json({ message: 'Product is blocked' });
    }

    // Return the product data
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params; // Get productId from URL params
    const { rating, headline, review } = req.body; // Get review data from request body
    const userId = req.user._id; // Assuming user ID comes from authentication middleware (JWT)

    // Validate review input
    if (!rating || !headline || !review) {
      return res.status(400).json({ message: 'All fields are required: rating, headline, and review.' });
    }

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user has already reviewed this product
    const existingReview = product.reviews.find(r => r.user.toString() === userId.toString());
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
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

    // Add the new review to the product's reviews array
    product.reviews.push(newReview);

    // Save the product to persist the new review in the database
    await product.save();

    res.status(201).json({ message: 'Review added successfully', product });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getOverallRating = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the product along with its reviews
    const product = await Product.findById(id).populate('reviews.user', 'name'); // Optionally populate user details for reviews

    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }

    // Calculate the rating breakdown
    const ratingBreakdown = product.reviews.reduce(
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
      reviews: product.reviews // Send all reviews for the product
    });
  } catch (error) {
    console.error('Error fetching overall rating and reviews:', error);
    res.status(500).json({ message: 'Error fetching overall rating and reviews' });
  }
};



exports.searchProducts = async (req, res) => {
  try {
    const { category, size, minPrice, maxPrice, minRating } = req.query;

    // Construct a query object based on search filters
    let query = {};
    if (category) query.category = { $regex: new RegExp(category, 'i') }; // Case-insensitive search
    if (size) query.size = { $regex: new RegExp(size, 'i') }; // Case-insensitive for size
    if (minPrice) query.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };

    // Find products with the specified filters
    let products = await Product.find(query);

    // If minRating is specified, calculate the average rating and filter based on it
    if (minRating) {
      products = products.filter(product => {
        const totalReviews = product.reviews.length;
        const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;
        return avgRating >= parseFloat(minRating);
      });
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};
