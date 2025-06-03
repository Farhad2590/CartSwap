const UserModel = require("../models/userModel");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const result = await UserModel.getAllUsers();
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getUserByEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await UserModel.getUserByEmail(email);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createUser: async (req, res) => {
    try {
      const user = req.body;
      const existingUser = await UserModel.getUserByEmail(user.email);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await UserModel.createUser(user);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await UserModel.deleteUser(id);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  updateUserRole: async (req, res) => {
    try {
      const userEmail = req.params.email;
      const { role } = req.body;
      const result = await UserModel.updateUserRole(userEmail, role);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  checkAdminStatus: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await UserModel.checkAdminStatus(email);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  checkOwnerStatus: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await UserModel.checkOwnerStatus(email);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  checkRenterStatus: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await UserModel.checkRenterStatus(email);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  updateUserByEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const updateData = req.body;
      const result = await UserModel.updateUserByEmail(email, updateData);
      if (result.modifiedCount === 1) {
        res
          .status(200)
          .json({ success: true, message: "User updated successfully" });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found or no changes made",
        });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  // Add this method to your userController object

// getUserStats: async (req, res) => {
//   try {
//     const result = await UserModel.getUserStats();
//     res.status(200).json({
//       success: true,
//       data: {
//         totalRenters: result.totalRenters || 0,
//         totalOwners: result.totalOwners || 0,
//         verifiedHolders: result.verifiedHolders || 0
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching user statistics:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Internal Server Error",
//       message: error.message 
//     });
//   }
// },

// Add this method to your userController object

getUserStats: async (req, res) => {
  try {
    // Get email from request (could be from params, query, or body)
    const email = req.params.email || req.query.email || req.body.email;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    // Check if user exists and is admin
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    if (user.userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    // User is admin, get stats
    const result = await UserModel.getUserStats();
    res.status(200).json({
      success: true,
      data: {
        totalRenters: result.totalRenters || 0,
        totalOwners: result.totalOwners || 0,
        verifiedHolders: result.verifiedHolders || 0
      }
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal Server Error",
      message: error.message 
    });
  }
},
};

module.exports = userController;
