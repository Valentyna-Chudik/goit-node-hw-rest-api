const db = require("./db");
const { ObjectID } = require("mongodb");

const getCollection = async (db, name) => {
  try {
    const client = await db;
    const collection = await client.db().collection(name);
    return collection;
  } catch (err) {
    return console.error(err.message);
  }
};

const listContacts = async () => {
  try {
    const collection = await getCollection(db, "contacts");
    const result = await collection.find({}).toArray();
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const collection = await getCollection(db, "contacts");
    const objectID = new ObjectID(contactId);
    // console.log(objectID.getTimestamp(contactId)); // record creation time
    const [result] = await collection.find({ _id: objectID }).toArray();
    return result;
  } catch (err) {
    console.error(err.message);
  }
};

const addContact = async (body) => {
  try {
    const newContact = { ...body };
    const collection = await getCollection(db, "contacts");
    const {
      ops: [result],
    } = await collection.insertOne(newContact);
    return result;
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const collection = await getCollection(db, "contacts");
    const objectID = new ObjectID(contactId);
    const { result } = await collection.findOneAndUpdate(
      { _id: objectID },
      { $set: body },
      { returnOriginal: false }
    );
    return result;
  } catch (err) {
    console.error(err.message);
  }
};
const removeContact = async (contactId) => {
  try {
    const collection = await getCollection(db, "contacts");
    const objectID = new ObjectID(contactId);
    const { result } = await collection.findOneAndDelete({ _id: objectID });
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
