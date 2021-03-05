const Contacts = require("../model/contacts");
const { HttpCode } = require("../helpers/constants");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await Contacts.listContacts(userId, req.query);
    return res.status(HttpCode.OK).json({
      status: "Success",
      code: HttpCode.OK,
      message: "Contacts found",
      data: { ...contacts },
    });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(req.params.contactId, userId);

    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "Success",
        code: HttpCode.OK,
        message: "Contact found",
        data: {
          contact,
        },
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: "Error",
        code: HttpCode.NOT_FOUND,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    return res.status(HttpCode.CREATED).json({
      status: "Success",
      code: HttpCode.CREATED,
      message: "Contact created",
      data: contact,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (req.body) {
      const contact = await Contacts.updateContact(
        req.params.contactId,
        req.body,
        userId
      );

      if (contact) {
        return res.status(HttpCode.OK).json({
          status: "Success",
          code: HttpCode.OK,
          message: "Contact updated",
          data: {
            contact,
          },
        });
      } else {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "Error",
          code: HttpCode.NOT_FOUND,
          message: "Not found",
        });
      }
    } else {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "Error",
        code: HttpCode.BAD_REQUEST,
        message: "Missing fields",
      });
    }
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(req.params.contactId, userId);

    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "Success",
        code: HttpCode.OK,
        message: "Contact deleted",
        data: {
          contact,
        },
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: "Error",
        code: HttpCode.NOT_FOUND,
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
