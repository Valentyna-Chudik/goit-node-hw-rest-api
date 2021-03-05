const Contact = require("./schemas/contact");

const listContacts = async (
  userId,
  { sortBy, sortByDesk, sub = "free", filter, page = "1", limit = "20" }
) => {
  try {
    const result = await Contact.paginate(
      { owner: userId },
      {
        limit,
        page,
        sort: {
          ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
          ...(sortByDesk ? { [`${sortByDesk}`]: -1 } : {}),
        },
        select: filter ? filter.split("|").join(" ") : "",
        populate: {
          path: "owner",
          select: "email -_id",
        },
      }
    );

    if (sub) {
      const filteredContacts = await Contact.find({ subscription: sub });
      return filteredContacts;
    }

    const { docs: contacts, totalDocs: total } = result;
    return {
      total: total.toString(),
      limit,
      page,
      filter,
      sub,
      contacts,
    };
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
    const result = await Contact.findOneAndUpdate(
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
    const result = await Contact.findOneAndRemove({
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
