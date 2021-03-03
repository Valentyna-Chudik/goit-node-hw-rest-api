const Contact = require("./schemas/contact");

const listContacts = async (userId) => {
  try {
    const result = await Contact.find({ owner: userId }).populate({
      path: "owner",
      select: "email -_id",
    });
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

const getContactById = async (contactId, userId) => {
  try {
    const result = await Contact.findOne({
      _id: contactId,
      owner: userId,
    }).populate({
      path: "owner",
      select: "email -_id",
    });
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

const updateContact = async (contactId, body, userId) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId, owner: userId },
      { ...body },
      { new: true }
    );
    return result;
  } catch (err) {
    console.error(err.message);
  }
};

const removeContact = async (contactId, userId) => {
  try {
    const result = await Contact.findByIdAndRemove({
      _id: contactId,
      owner: userId,
    });
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
