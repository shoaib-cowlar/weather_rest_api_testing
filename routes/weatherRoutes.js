const express = require("express");
const router = express.Router();

const { fetchWeather } = require("../controllers/weatherController");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, fetchWeather);

module.exports = router;
