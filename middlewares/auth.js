const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Unauthorized } = require('../helper/helper');
const { User } = require('../models/model.user');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization || " ";
    const [tokenType, token] = authHeader.split(' ');
    if (tokenType === "Bearer" && token) {
     try {
         const verifiedToken = jwt.verify(token, config.SECRET);
         const user = await User.findById(verifiedToken._id);
         if (!user || !user.token) {
             return next(Unauthorized("Not authorized"))
         }
         req.user = user;
         return next()
      } catch (error) {
         if (error.name === "TokenExpiredError") {
             return next(Unauthorized("Not authorized"));
         }
         if (error.name === "JsonWebTokenError") {
             return next(Unauthorized("Not authorized"));
         }
        }
    }
};



module.exports = { auth };