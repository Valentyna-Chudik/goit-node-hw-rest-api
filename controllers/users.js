const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const { Subscriptions, HttpCode } = require("../helpers/constants");

require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findUserByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        data: "Conflict",
        message: "Email in use",
      });
    }

    const newUser = await Users.createUser({ email, password });
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: Subscriptions.FREE,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findUserByEmail(email);
    const isPasswordValid = await user.validPassword(password);

    if (!user || !isPasswordValid) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        data: "Unauthorized",
        message: "Email or password is wrong",
      });
    }

    const userId = user._id;
    const payload = { userId };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "8h" });
    await Users.updateUserToken(userId, token);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email,
          subscription: Subscriptions.FREE,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};
const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateUserToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({ message: "Nothing" });
  } catch (e) {
    next(e);
  }
};

const getCurrentUser = async (req, res, next) => {};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
