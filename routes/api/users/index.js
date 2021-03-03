const express = require("express");
const router = express.Router();
// const validate = require("./validation");
const userController = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.post("/auth/logout", userController.logout);
router.get("/current", guard, userController.getCurrentUser);

module.exports = router;
