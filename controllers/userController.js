const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { default: mongoose } = require("mongoose");

exports.registerUser = async (req, res) => {
  console.log(req.body);
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName, lastName, email, password);
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: "Email is already in use" });
      return;
    } else {
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: newPassword,
      });
      await newUser.save();
      if (newUser) {
        res.status(200).json({
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        });
      } else {
        res.status(400).json("Invalid user data");
        return;
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const match = await bcrypt.compare(password, user.password);

    if (user && match) {
      const { _doc } = user;
      const { password, ...others } = _doc;
      res.json({
        ...others,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: "Invalid user email or password" });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
    return;
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user Id" });
      return;
    }
    const user = await User.findById(userId).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User does not exist" });
      return;
    }
  } catch (err) {
    console.log("Error While Getting Error :", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user Id" });
      return;
    }
    const user = await User.findById(userId);

    if (user) {
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ error: "User does not exist" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    const match = await bcrypt.compare(currentPassword, user.password);

    if (match) {
      const salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });

      res.json({ message: "Password update successful" });
    } else {
      res.status(401).json({ error: "Incorrect password" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
