const axios = require("axios");
const weather = require("../models/weather");

exports.fetchWeather = async (req, res) => {
  const { cityName } = req.body;
  console.log(cityName);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=69259004c2ebac362b71a19cefe024b6`;
  try {

    
    const response = await axios.get(url);
    const data = response.data; // Extract the data property from the response object
    const { name: city } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    const newWeather = new weather({
      city,
      temp,
      humidity,
      speed,
      icon,
      description,
    });

    await newWeather.save();
    res.status(200).json(newWeather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
