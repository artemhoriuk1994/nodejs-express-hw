const express = require("express");
const {
  register, login, getCurrent, logout
} = require("../../controler/users.controler");
const { auth } = require("../../middlewares/auth");
const { tryCatchWrapper } = require("../../helper/helper");

const authRouter = express.Router();

authRouter.post("/register", tryCatchWrapper(register));
authRouter.post("/login", tryCatchWrapper(login));
authRouter.get("/current", auth, tryCatchWrapper(getCurrent));
authRouter.post("/logout", auth, tryCatchWrapper(logout));
authRouter.patch("/", auth, tryCatchWrapper(setSubcrition));


module.exports = authRouter
