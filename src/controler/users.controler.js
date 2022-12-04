const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { v4: uuidv4 }  = require('uuid')
const { Unauthorized, BadRequest, NotFound } = require('http-errors');
const { User } = require('../models/model.user');
const config = require('../config/config');
const path = require('path');
const { PORT} = require('../config/config');
const { verifyEmail } = require('../middlewares/verification');

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const findEmail = await User.findOne({ email });
  if (findEmail) {
    throw new BadRequest("Alredy registred");
  }

  const avatarURL = gravatar.url(email, { protocol: "https" });
  const verificationToken = uuidv4();
  const user = await User.create({ email, password, avatarURL , verificationToken});
  await verifyEmail(email, verificationToken);
  return res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription
    }
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
  if (!user) {
    throw new Unauthorized("Email or password is wrong!")
  }
  if (!user.verify) {
    throw new Unauthorized("Please verify your email")
  }
  const isPasswordTrue = await bcrypt.compare(password, user.password);
  if (!isPasswordTrue) {
    throw new Unauthorized("Email or password is wrong!")
  }
  const token = jwt.sign({ _id: user.id }, config.SECRET, {
    expiresIn: '1w'
  });
  await User.findByIdAndUpdate( user.id, {token})
  return res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription
    }
  })
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  return res.status(200).json(
    {
      email,
      subscription
    }
  )
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json()
};

const setSubcription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription }  = req.body;
  const find = await User.findOne(_id);
  
  if (subscription === find.subscription) {
    throw new BadRequest("You have this subscrition alredy");
  }
  const newSubscription = await User.findByIdAndUpdate(_id, { subscription }, { new: true });
  res.status(200).json({
    email: newSubscription.email,
    subscription: newSubscription.subscription
  });
};

const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    throw new BadRequest("Wrong file type. Only .jpeg, .jpg or .png are allowed.");
  }
  const { path: tmpPath, originalname } = req.file
  const { _id } = req.user;
  const publicPath = path.join(process.cwd(), "public/avatars");
  const resultUpload = path.join(publicPath, _id + originalname);
  await fs.rename(tmpPath, resultUpload);

    const resizeImage = await Jimp.read(resultUpload);
  resizeImage.resize(250, 250).write(resultUpload)
  const avatarURL = path.join("avatars", _id + originalname);
  const newAvatar = await User.findByIdAndUpdate(_id, { avatarURL }, { new: true })
  return res.status(200).json({
    avatarURL: `http://localhost:${PORT}/${newAvatar.avatarURL.split("\\").join("/")}`
  });
};

const verifycationRequest = async (req, res, next) => {
  const { verificationToken } = req.params
  const verifiedUser = await User.findOne({ verificationToken });
  if (verifiedUser && !verifiedUser.verify) {
    await User.findByIdAndUpdate(verifiedUser._id, {
      verify: true,
      verificationToken: null
    })
    return res.status(200).json({
      message: 'Verification successful'
    })
  };
  throw new NotFound('Not Found')
};

const resendVerify = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFound("Not Found");
  }
  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }
  await verifyEmail(email, user.verificationToken);
  
   return res.status(200).json({
      message: 'Verification email sent'
  })
}
 

module.exports = {
  register, 
  login,
  getCurrent,
  logout,
  setSubcription,
  updateAvatar, 
  verifycationRequest,
  resendVerify
};
