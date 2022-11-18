const { Schema, model, SchemaTypes } = require('mongoose');

const contactsScheme = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
  },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    }
  }, {versionKey: false});

const Contacts = model('contact', contactsScheme);

module.exports = { Contacts };