const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

async function listContacts() {
  try {
    const file = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(file);
    return contacts;
  } catch (err) {
    return console.error(err.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contactById = contacts.find(({ id }) => id.toString() === contactId);
    return contactById;
  } catch (err) {
    console.error(err.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(({ id }) => id.toString() === contactId);
    const updatedContacts = contacts.filter(
      ({ id }) => id.toString() !== contactId
    );
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, "utf8"));
    return contact;
  } catch (err) {
    console.error(err.message);
  }
}

async function addContact(body) {
  try {
    const contacts = await listContacts();
    const newContact = { ...body, id: uuid() };
    const updatedContacts = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, "utf8"));
    return newContact;
  } catch (err) {
    console.error(err.message);
  }
}

async function updateContact(contactId, body) {
  try {
    const contacts = await listContacts();
    const targetContactIndex = contacts.findIndex(
      ({ id }) => id.toString() === contactId
    );
    if (targetContactIndex === -1) return;
    contacts[targetContactIndex] = {
      ...contacts[targetContactIndex],
      ...body,
    };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, "utf8"));
    return contacts[targetContactIndex];
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

// const db = require("./db");

// const listContacts = async () => {
//   return db.get("contacts").value();
// };

// const getContactById = async (contactId) => {
//   return db.get("contacts").find({ contactId }).value();
// };

// const removeContact = async (contactId) => {
//   const [record] = db.get("contacts").remove({ contactId }).write();
//   return record;
// };

// const addContact = async (body) => {
//   const id = uuid();
//   const record = {
//     id,
//     ...body,
//   };
//   db.get("contacts").push(record).write();
//   return record;
// };

// const updateContact = async (contactId, body) => {
//   const record = db.get("contacts").find({ contactId }).assign(body).value();
//   db.write();
//   return record.contactId ? record : null;
// };
