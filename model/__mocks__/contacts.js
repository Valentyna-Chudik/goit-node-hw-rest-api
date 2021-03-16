const { contacts } = require("./data");

const listContacts = jest.fn(
  (
    userId,
    { sortBy, sortByDesk, sub = "free", filter, page = "1", limit = "20" }
  ) => {
    return { contacts, total: contacts.length, page, limit };
  }
);

const getContactById = jest.fn((contactId, userId) => {
  const [contact] = contacts.filter(
    (el) => String(el._id) === String(contactId)
  );
  return contact;
});

const addContact = jest.fn((body) => {
  const newContact = { ...body, _id: "604215a005cda41e4c3dcd42" };
  contacts.push(newContact);
  return newContact;
});

const updateContact = jest.fn((contactId, body, userId) => {
  let [contact] = contacts.filter((el) => String(el._id) === String(contactId));
  if (contact) {
    contact = { ...contact, ...body };
  }
  return contact;
});

const removeContact = jest.fn((contactId, userId) => {
  const contactIndex = contacts.findIndex(
    (el) => String(el._id) === String(contactId)
  );
  if (contactIndex === -1) {
    return null;
  }
  const [contact] = contacts.splice(contactIndex, 1);
  return contact;
});

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
