const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const contactsPath = path.resolve("./models/contacts.json");

const listContacts = async () => {
  const dbRAW = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(dbRAW);
};

const getContactById = async (contactId) => {
  const getContactList = await listContacts();
  const freshDB = getContactList.find((contact) => {
    return contact.id === contactId;
  });
  return freshDB;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactForRemove = await getContactById(contactId);
  const newData = contacts.filter((contact) => contact.id !== contactId);
  fs.writeFile(contactsPath, JSON.stringify(newData));
  return contactForRemove;
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const contactsList = await listContacts();
  const id = uuidv4();
  const contact = { id, name, email, phone };
  contactsList.push(contact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsList));
  return contact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  contacts[contacts.findIndex((contact) => contact.id === contactId)] = {
    id: contactId,
    name: body.name,
    email: body.email,
    phone: body.phone,
  };
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contacts;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
