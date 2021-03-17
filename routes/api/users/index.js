const express = require("express");
const router = express.Router();
const validate = require("./validation");
const userController = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
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
router.patch(
  "/avatars",
  guard,
  upload.single("avatar"),
  validate.validateUploadAvatar,
  userController.avatars
);

module.exports = router;
