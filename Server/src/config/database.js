const mongoose = require("mongoose");

const connectDB = async () => {
  const database = await mongoose.connect(`${process.env.MONGO_URI}/devTinder`);
  // console.log(database)
};

module.exports = connectDB;
