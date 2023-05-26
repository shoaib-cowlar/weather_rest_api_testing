const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const data = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    console.log(`Mongodb  connected with Server : ${data.connection.host}`);
  } catch (error) {
    console.log("Error While Connecting to Mongodb Server", error);
  }
};

module.exports = connectDatabase;
