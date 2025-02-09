const express = require("express");
const {
  register, login, getCurrent, logout, setSubcription, updateAvatar, verifycationRequest, resendVerify
} = require("../../controler/users.controler");
const { auth } = require("../../middlewares/auth");
const { tryCatchWrapper } = require("../../helper/helper");
const { uploadImg } = require("../../middlewares/storageMiddleware");
const { validationSchema } = require("../../middlewares/schemaValidation");
const { schemePostRegister, schemeGetLogin, schemePatchSub, schemePostVerify } = require("../../schema/validationUser");

const authRouter = express.Router();

authRouter.post("/register", validationSchema(schemePostRegister), tryCatchWrapper(register));

authRouter.post("/login", validationSchema(schemeGetLogin), tryCatchWrapper(login));

authRouter.get("/current", auth, tryCatchWrapper(getCurrent));

authRouter.post("/logout", auth, tryCatchWrapper(logout));

authRouter.patch("/", auth, validationSchema(schemePatchSub), tryCatchWrapper(setSubcription));

authRouter.patch("/avatars", auth, uploadImg.single("avatar"), tryCatchWrapper(updateAvatar));

authRouter.get("/verify/:verificationToken", tryCatchWrapper(verifycationRequest));

authRouter.post('/verify',validationSchema(schemePostVerify), tryCatchWrapper(resendVerify))


module.exports = authRouter
