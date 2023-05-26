const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const connectDatabase = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

connectDatabase();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/weather", weatherRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
