const { Contacts } = require('../models/model.contact')
const {NotFoundHttpError} = require("../helper/helper");

const listContacts = async (req, res, next) => {
  const { _id } = req.user;
  const { page = 1, limit = 20, favorite} = req.query;
  const skip = (page - 1) * limit;
  
  if (favorite) {
    const parsedFavorite = JSON.parse(favorite)
    const contactsFavorite = await Contacts.find({ owner: _id, favorite: parsedFavorite }, '', { skip, limit: +limit });
    const total = contactsFavorite.length;
    return res.json({ total, data: contactsFavorite })
  }

  const contacts = await Contacts.find({ owner: _id }, '', { skip, limit: +limit });
  const total = contacts.length;
  return res.json({ total, data: contacts });
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params
  const { _id } = req.user;
  const contact = await Contacts.findById(contactId, _id)
    if (contact) {
        return res.json(contact)
    }
    return next(NotFoundHttpError())
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params
  const { _id } = req.user;
  const removedContact = await Contacts.findByIdAndDelete(contactId,  _id );
    if (removedContact) {
        return res.status(200).json(removedContact)
    }
    return next(NotFoundHttpError())
};

const addContact = async (req, res, next) => {
  const { _id } = req.user;
  const newContact = await Contacts.create({...req.body, owner: _id});
  return res.status(201).json(newContact)
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;

  const updatedContact = await Contacts.findByIdAndUpdate( {_id: contactId, owner: _id },req.body,{ new: true })
  
  if (!updatedContact) {
    next(NotFoundHttpError())
  }
    return res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res, next) => { 
  const { contactId } = req.params;
  const { _id } = req.user;
  const updatedStatus = await Contacts.findByIdAndUpdate({ _id: contactId, owner: _id }, req.body, { new: true });
  
    if (!updatedStatus) {
      return next(NotFoundHttpError())
    }
      return res.status(200).json(updatedStatus); 
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
};
