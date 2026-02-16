const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME;

  if (!uri) throw new Error("MONGO_URI missing");
  await mongoose.connect(uri, { dbName });
  console.log("MongoDB connected:", dbName);
}

module.exports = connectDB;
