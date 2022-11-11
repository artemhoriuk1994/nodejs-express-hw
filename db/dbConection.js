const mongoose = require("mongoose");
const config = require("../config/config")
const connectMongo = async () => {
  return mongoose.connect(config.HOST_DB);
};

module.exports = {
    connectMongo,
}