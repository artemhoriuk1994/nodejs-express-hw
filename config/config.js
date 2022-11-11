require("dotenv").config();
const mongoose = require("mongoose");
const { HOST_DB } = process.env;
const { PORT } = process.env;

const connectMongo = async () => {
  return mongoose.connect(HOST_DB);
};
module.exports = {
    connectMongo,
    PORT
}