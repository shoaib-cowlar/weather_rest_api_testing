const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weatherSchema = new Schema({
  city: {
    type: String,
  },
  icon: {
    type: String,
  },
  description: {
    type: String,
  },
  temp: {
    type: String,
  },
  pressure: {
    type: String,
  },
  humidity: {
    type: String,
  },
  speed: {
    type: String,
  },
});

module.exports = mongoose.model("Weather", weatherSchema);
