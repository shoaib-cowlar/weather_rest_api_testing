const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updatePassword,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", getAllUsers);
router.route("/:id").get(getUserById).delete(deleteUser).put(updatePassword);

module.exports = router;
