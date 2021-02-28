const express = require("express");
const router = express.Router();
const validate = require("../../services/contacts-validation");
const contactsController = require("../../controllers/contacts-controller");

router
  .get("/", contactsController.getAll)
  .post("/", validate.addContact, contactsController.create);

router
  .get("/:contactId", contactsController.getById)
  .patch("/:contactId", validate.updateContact, contactsController.update)
  .delete("/:contactId", contactsController.remove);

module.exports = router;
