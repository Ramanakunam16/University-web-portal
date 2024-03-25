const mongoose = require('mongoose');
const connectMDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`mongoDB database connected ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectMDB;
