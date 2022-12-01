require("dotenv").config();

const config = {
    SECRET: process.env.SECRET,
    HOST_DB: process.env.HOST_DB,
    PORT: +process.env.PORT || 3000,
    SEND_GRID: process.env.SENDGRID_API_KEY,
    OWNER_EMAIL: process.env.OWNER_EMAIL
};

module.exports = config;

