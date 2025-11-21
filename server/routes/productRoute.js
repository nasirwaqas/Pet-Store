const express = require('express');
const router = express.Router();
const product = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');



const multer = require('multer');
const path = require('path'); // Import the path module

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload/images')); // Use absolute path
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Keep the original file name
  }
});

const upload = multer({ storage: storage });
// Route to handle product uploads
router.get('/searchProducts', product.searchProducts);
router.post('/uploadProduct',authMiddleware, upload.array('images'), product.uploadProduct);
router.get('/getProductsByUser', authMiddleware, product.getProductsByUser);
router.get('/:id', product.getProductById);
router.put('/updateProduct/:id', authMiddleware, upload.single('image'), product.updateProduct);
router.delete('/deleteProduct/:id', authMiddleware, product.deleteProduct);
router.post('/:productId/review', authMiddleware, product.addReview);
router.get('/:id/rating',  product.getOverallRating);


module.exports = router;
