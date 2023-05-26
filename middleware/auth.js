const jwt = require("jsonwebtoken");
const user = require("../models/user");

const authenticateToken = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Permission Denied ! No Token Found" });
      }
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      // Attach the decoded token to the request object
      req.user = await user.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401).json("Not authorized, token failed");
  }
};

module.exports = authenticateToken;
