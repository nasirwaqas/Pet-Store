const User = require("../modals/User");
const Product = require("../modals/Product");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'User' });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
};
// Updata user status (accept/reject/block)
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body; // Get userId and status from the request body

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Blocked'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User status updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user status', error: error.message });
  }
};

// Get all products
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate('uploadedBy', 'name email');
//     res.status(200).json({ success: true, products });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
//   }
// };
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('uploadedBy', 'name email').exec(); // Populate `uploadedBy` with user details
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Update product status (block/unblock)
exports.updateProductStatus = async (req, res) => {
  try {
    const { productId, status } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, { status }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product status updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product status', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    // Find user and update
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find user and delete
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
   // update Product details

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { productType, price, size, description, about, details, discount, color} = req.body;

    // Find the product by ID and update its details
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { productType, price, size, description,  size, about, details, discount, color,},
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};