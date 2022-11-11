require("dotenv").config();
const mongoose = require("mongoose");
const  HOST_DB  = process.env.HOST_DB;
const PORT = process.env.PORT || 3000

const connectMongo = async () => {
  return mongoose.connect(HOST_DB);
};
module.exports = {
    connectMongo,
    PORT
}