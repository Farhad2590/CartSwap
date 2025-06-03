const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User routes
router.get("/", userController.getAllUsers);
router.get("/:email", userController.getUserByEmail);
router.put("/:email", userController.updateUserByEmail);
router.post("/", userController.createUser);
router.delete("/:id", userController.deleteUser);
router.put("/updateUserRole/:email", userController.updateUserByEmail);
router.get('/stats', userController.getUserStats); // Call with ?email=admin@example.com
// Role checking routes
router.get("/admin/:email", userController.checkAdminStatus);
router.get("/owner/:email", userController.checkOwnerStatus);
router.get("/renter/:email", userController.checkRenterStatus);

module.exports = router;
