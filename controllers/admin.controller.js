const User = require("../modals/User");
const Pet = require("../modals/Pet");

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

// Get all pets
// exports.getAllPets = async (req, res) => {
//   try {
//     const pets = await Pet.find().populate('uploadedBy', 'name email');
//     res.status(200).json({ success: true, pets });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching pets', error: error.message });
//   }
// };
exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate('uploadedBy', 'name email').exec(); // Populate `uploadedBy` with user details
    res.json({ pets });
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Error fetching pets', error: error.message });
  }
};

// Update pet status (block/unblock)
exports.updatePetStatus = async (req, res) => {
  try {
    const { petId, status } = req.body;
    const updatedPet = await Pet.findByIdAndUpdate(petId, { status }, { new: true });

    if (!updatedPet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    res.status(200).json({ success: true, message: 'Pet status updated successfully', pet: updatedPet });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating pet status', error: error.message });
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
   // update pet details

exports.updatePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const { petType, price, breed, description, about, details, discount, color} = req.body;

    // Find the pet by ID and update its details
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { petType, price, breed, description,  breed, about, details, discount, color,},
      { new: true } // Return the updated document
    );

    if (!updatedPet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    res.json({ success: true, pet: updatedPet });
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};