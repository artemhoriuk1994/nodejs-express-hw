const { Contacts } = require('../models/model.contact');
const { schemePost, schemePatch, schemePut } = require('../middlewares/validations');
const {NotFoundHttpError, BadRequestHttp} = require("../helper/helper");

const listContacts = async (req, res, next) =>  {
        const contacts = await Contacts.find()
        return res.json(contacts)
};

const getContactById = async (req, res, next) => {
    const { contactId } = req.params
    const contact = await Contacts.findById(contactId)
    if (contact) {
        return res.json(contact)
    }
    return next(NotFoundHttpError())
};

const removeContact = async (req, res, next) => {
    const { contactId } = req.params
    const removedContact = await Contacts.findByIdAndDelete(contactId);
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
  const newContact = await Contacts.create(req.body)
    return res.status(201).json(newContact)
};

const updateContact = async (req, res, next) => { 
  const { error } = schemePut.validate(req.body);
 if (error) {
      return next(BadRequestHttp(error.message))
  }
  const { contactId } = req.params;
  const updatedContact = await Contacts.findByIdAndUpdate(contactId, req.body, { new: true })
  
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
  const favorite  = req.body
  const updatedStatus = await Contacts.findByIdAndUpdate(contactId, favorite, {new: true})
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
