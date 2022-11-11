const { Schema, model } = require('mongoose');

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
    }
  });

const Contacts = model('contacts', contactsScheme);

module.exports = { Contacts };