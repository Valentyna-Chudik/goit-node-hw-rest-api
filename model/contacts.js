const Contact = require("./Schemas/contact-schema");

const listContacts = async () => {
  try {
    const result = await Contact.find({});
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const result = await Contact.findOne({ _id: contactId });
    console.log(result.contactId);
    console.log(result._id);
    return result;
  } catch (err) {
    console.error(err.message);
  }
};

const addContact = async (body) => {
  try {
    const result = await Contact.create(body);
    return result;
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { ...body },
      { new: true }
    );
    return result;
  } catch (err) {
    console.error(err.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const result = await Contact.findByIdAndRemove({ _id: contactId });
    return result;
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
