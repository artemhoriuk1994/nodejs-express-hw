const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../controler/contacts.controler");
const{tryCatchWrapper} = require("../../helper/helper");
const { auth } = require("../../middlewares/auth");
const { validationSchema } = require("../../middlewares/schemaValidation");
const { schemePost, schemePatch, schemePut } = require("../../schema/validationsContacts");

const router = express.Router();

router.use(auth);

router.get("/", tryCatchWrapper(listContacts));

router.get("/:contactId", tryCatchWrapper(getContactById));

router.post("/",validationSchema(schemePost), tryCatchWrapper(addContact));

router.delete("/:contactId", tryCatchWrapper(removeContact));

router.put("/:contactId",validationSchema(schemePut), tryCatchWrapper(updateContact));

router.patch("/:contactId/favorite", validationSchema(schemePatch),tryCatchWrapper(updateStatusContact))

module.exports = router;
