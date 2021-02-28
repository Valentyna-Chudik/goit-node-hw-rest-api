const Contacts = require("../model/contacts");

const getAll = async (_req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({
      status: "Success",
      code: 200,
      message: "Contacts found",
      data: contacts,
    });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);

    if (contact) {
      return res.json({
        status: "Success",
        code: 200,
        message: "Contact found",
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "Error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res.status(201).json({
      status: "Success",
      code: 201,
      message: "Contact created",
      data: contact,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    if (req.body) {
      const contact = await Contacts.updateContact(
        req.params.contactId,
        req.body
      );

      if (contact) {
        return res.json({
          status: "Success",
          code: 200,
          message: "Contact updated",
          data: {
            contact,
          },
        });
      } else {
        return res.status(404).json({
          status: "Error",
          code: 404,
          message: "Not found",
        });
      }
    } else {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: "Missing fields",
      });
    }
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);

    if (contact) {
      return res.json({
        status: "Success",
        code: 200,
        message: "Contact deleted",
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "Error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
