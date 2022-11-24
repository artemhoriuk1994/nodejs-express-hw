const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userScheme = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    index: true
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  avatarURL: {
    type: String,
    required: true
  },
  token: String
}, { versionKey: false });
  

userScheme.pre('save', async function (next) {
  const user = this;
  if (!user.isModified("password")) next();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  next()
})

const User = model('user', userScheme);


module.exports = { User };