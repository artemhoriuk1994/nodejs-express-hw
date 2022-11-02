const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const Joi = require("joi");
const router = express.Router();

const scheme = Joi.object({
  name: Joi.string().required().min(2).max(30),
  phone: Joi.string().required(),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        code: 404,
        message: "Not Found",
      });
    }
    res.json({
      data: {
        contact,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    const { error } = scheme.validate(req.body);
    if (error) {
      res.status(400).json({
        code: 400,
        message: `Missing required field. Validation error: ${error.message}`,
      });
      return;
    }
    res.status(201).json({
      status: 201,
      data: {
        newContact,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      status: 200,
      message: "Contact deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = scheme.validate(req.body);
    if (!req.body) {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }

    const changedContact = await updateContact(contactId, req.body);
    if (!changedContact) {
      return res.status(404).json({
        status: 404,
        message: error.message,
      });
    }
    res.status(200).json({
      status: 200,
      data: {
        changedContact,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
