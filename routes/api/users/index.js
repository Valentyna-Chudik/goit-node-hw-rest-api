const express = require("express");
const router = express.Router();
const validate = require("./validation");
const userController = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const { registerLimit } = require("../../../helpers/rate-limiter");

router.post(
  "/auth/register",
  registerLimit,
  validate.createUser,
  userController.register
);
router.post("/auth/login", userController.login);
router.post("/auth/logout", guard, userController.logout);
router.get("/current", guard, userController.getCurrentUser);
// router.patch("/", guard, userController.updateUserSub);

module.exports = router;
