const { Contacts } = require('../models/model.contact')
const { schemePost, schemePatch, schemePut} = require('../schema/validationsContacts')
const {NotFoundHttpError, BadRequestHttp} = require("../helper/helper");

const listContacts = async (req, res, next) => {
  const { user } = req;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contacts.find({user},'',{skip, limit: +limit});
  return res.json(contacts);
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
  const { error } = schemePost.validate(req.body);
  if (error) {
    return next(BadRequestHttp(error.message))
  }
  const { _id } = req.user;
  const newContact = await Contacts.create({...req.body, owner: _id});
  return res.status(201).json(newContact)
};

const updateContact = async (req, res, next) => {
  const { error } = schemePut.validate(req.body);
  const { contactId } = req.params;
  const { _id } = req.user;

  if (error) {
    return next(BadRequestHttp(error.message))
  }

  const updatedContact = await Contacts.findByIdAndUpdate( {_id: contactId, owner: _id },req.body,{ new: true })
  
  if (!updatedContact) {
    next(NotFoundHttpError())
  }
    return res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res, next) => { 
  const { error } = schemePatch.validate(req.body);
  if (error) {
    return next(BadRequestHttp(error.message))
  }
  const { contactId } = req.params;
  const favorite = req.body;
  const { _id } = req.user;
  const updatedStatus = await Contacts.findByIdAndUpdate({ _id: contactId, owner: _id }, favorite, { new: true })
  
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
