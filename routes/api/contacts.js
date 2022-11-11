const express = require("express");
const { scheme } = require('../../middlewares/validations')
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();



router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(
      contacts
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json({
      contact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const createdContact = await addContact(req.body);
    const { error } = scheme.validate(req.body);
    if (error) {
      res.status(400).json({
        message: `Missing required field. Validation error: ${error.message}`,
      });
      return;
    }
    res.status(201).json({
      createdContact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await removeContact(contactId);
    if (!deletedContact) {
      res.status(404).json({ message: "NotFound" });
    }
    res.status(200).json({
      message: "Contact deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = scheme.validate(req.body);
    if (!req.body) {
      return res.status(400).json({
        message: error.message,
      });
    }
    const changedContact = await updateContact(contactId, req.body);

    if (!changedContact) {
      return res.status(404).json({
        message: error.message,
      });
    }
     
    res.status(200).json({
      changedContact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
