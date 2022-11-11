require("dotenv").config();

const config = {
HOST_DB: process.env.HOST_DB,
PORT: +process.env.PORT || 3000 // process.env.PORT return STring and we adding plus to convert String to Number
}

module.exports = config

