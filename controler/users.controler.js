const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const {Conflict, Unauthorized, BadRequest} = require('http-errors')
const { User } = require('../models/model.user')
const config = require('../config/config')
const { schemePostRegister, schemeGetLogin, schemePatchSub } = require('../schema/validationUser');


const register = async (req, res, next) => {
  const { error } = schemePostRegister.validate(req.body);
  if (error) {
     throw new Conflict("Email in use")
  }

  const { email, password } = req.body;
  const user = await User.create({ email, password });
  return res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription
    }
  })
};

const login = async (req, res, next) => {
  const { error } =  schemeGetLogin.validate(req.body);
  if (error) {
    throw new BadRequest(error.message)
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email })
  if (!user) {
    throw new Unauthorized("Email or password is wrong!")
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

const setSubcrition = async (req, res, next) => {
  const { error } =  schemePatchSub.validate(req.body);
  const { _id } = req.user;
  const { subscription }  = req.body;
  if (error) {
   throw new BadRequest(error.message)
  }
  const find = await User.findOne(_id);
  console.log(find.subscription)
  console.log(subscription)
  if (subscription === find.subscription) {
    throw new BadRequest("You have this subscrition alredy");
  }
  const newSubscription = await User.findByIdAndUpdate(_id, { subscription }, { new: true });
  res.status(200).json({
    email: newSubscription.email,
    subscription: newSubscription.subscription
  });
};


module.exports = {
  register, 
  login,
  getCurrent,
  logout,
  setSubcrition
};
