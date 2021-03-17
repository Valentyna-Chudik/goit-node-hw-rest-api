const express = require("express");
const router = express.Router();

const validate = require("./validation");
const contactsController = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

router
  .get("/", guard, contactsController.getAll)
  .post("/", guard, validate.addContact, contactsController.create);

router
  .get("/:contactId", guard, contactsController.getById)
  .patch(
    "/:contactId",
    guard,
    validate.updateContact,
    contactsController.update
  )
  .delete("/:contactId", guard, contactsController.remove);

module.exports = router;
