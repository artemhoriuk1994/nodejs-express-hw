const { Contacts } = require('../models/model.contact')
const {NotFoundHttpError, BadRequestHttp} = require("../helper/helper");

const listContacts = async (req, res, next) =>  {
        const contacts = await Contacts.find()
        return res.json({
            contacts
        })
};

const getContactById = async (req, res, next) => {
    const { contactId } = req.params
    const contact = await Contacts.findById(contactId)
    if (contact) {
        return res.json({
        contact
        })
    }
    return next(NotFoundHttpError())
};

const removeContact = async (req, res, next) => {
    const { contactId } = req.params
    const removedContact = await Contacts.findById(contactId)
    if (removedContact) {
        await Contacts.findByIdAndDelete(contactId);
        return res.status(200).json({
            removedContact
        })
    }
    return next(NotFoundHttpError())
};

const addContact = async (req, res, next) => {
    if (req.body) {
      const newContact = await Contacts.insertMany(req.body)
    return res.status(201).json({
      newContact
  })
    }
    return next(BadRequestHttp("Bad Request"))
};

const updateContact = async (req, res, next) => { 
    const { contactId } = req.params;
    const updatedContact = await Contacts.findByIdAndUpdate(contactId, req.body, {new: true})
  if (!updatedContact) {
    next(NotFoundHttpError())
  }
    return res.status(200).json({
      updatedContact
  });
};

const updateStatusContact = async (req, res, next) => { 
    const { contactId } = req.params;
    const favorite = req.body;
    const contact = await Contacts.findById(contactId);
    const isPropertyFavorite = !favorite.hasOwnProperty.call(favorite, 'favorite');

    if (isPropertyFavorite) {
        return res.status(400).json({
            message: "Missing field favorite"
    }) 
    }
    if (contact) {
        const updatedStatus = await Contacts.findByIdAndUpdate(contactId, favorite, {new: true})
        return res.status(200).json({
       updatedStatus
    });
    }
    
   next(NotFoundHttpError())
     
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
    updateContact,
  updateStatusContact
};
