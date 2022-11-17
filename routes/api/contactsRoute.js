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

const router = express.Router();

router.use(auth);

router.get("/", tryCatchWrapper(listContacts));

router.get("/:contactId", tryCatchWrapper(getContactById));

router.post("/", tryCatchWrapper(addContact));

router.delete("/:contactId", tryCatchWrapper(removeContact));

router.put("/:contactId", tryCatchWrapper(updateContact));

router.patch("/:contactId/favorite", tryCatchWrapper(updateStatusContact))

module.exports = router;
