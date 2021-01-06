const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected to ${conn.connection.host}`);
  } catch (err) {
    console.log("Could not connect to database");
    process.exit(1);
  }
};

module.exports = connectDB;
