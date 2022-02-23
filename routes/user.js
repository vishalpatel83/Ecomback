const express = require("express");
const router = express.Router();
const {
  getUserById,
  getUser,
  getAllUsers,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.get(
  "/order/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

router.get("/users", getAllUsers);
module.exports = router;
