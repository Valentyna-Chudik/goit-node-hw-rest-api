const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const Jimp = require("jimp");
const { promisify } = require("util");
const cloudinary = require("cloudinary").v2;
const { nanoid } = require("nanoid");
require("dotenv").config();

const Users = require("../model/users");
const { Subscriptions, HttpCode } = require("../helpers/constants");
const EmailService = require("../services/email");
const createFolderIsExist = require("../helpers/create-dir");

const SECRET_KEY = process.env.JWT_SECRET;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadCloud = promisify(cloudinary.uploader.upload);

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const user = await Users.findUserByEmail(email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "Error",
        code: HttpCode.CONFLICT,
        data: "Conflict",
        message: "Email in use",
      });
    }

    const verificationToken = nanoid();
    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendEmail(verificationToken, email, name);

    const newUser = await Users.createUser({
      ...req.body,
      verify: false,
      verificationToken,
    });
    return res.status(HttpCode.CREATED).json({
      status: "Success",
      code: HttpCode.CREATED,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          subscription: Subscriptions.FREE,
          avatarURL: newUser.avatarURL,
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
    const isPasswordValid = await user?.validPassword(password);

    if (!user || !isPasswordValid || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "Error",
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
      status: "Success",
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
    const userId = String(req.user._id);
    await Users.updateUserToken(userId, null);
    return res.status(HttpCode.NO_CONTENT).json();
  } catch (e) {
    next(e);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userToken = req.user.token;
    const user = await Users.findUserByToken(userToken);

    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "Error",
        code: HttpCode.UNAUTHORIZED,
        data: "Unauthorized",
        message: "Not authorized",
      });
    }

    return res.status(HttpCode.OK).json({
      status: "Success",
      code: HttpCode.OK,
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    const userId = String(req.user._id);
    // STATIC
    // const avatarUrl = await saveAvatarToStatic(req);
    // await Users.updateUserAvatar(userId, avatarUrl);

    // CLOUDINARY
    const {
      public_id: imgIdCloud,
      secure_url: avatarUrl,
    } = await saveAvatarToCloud(req);
    await Users.updateUserAvatar(userId, avatarUrl, imgIdCloud);

    return res.json({
      status: "Success",
      code: HttpCode.OK,
      data: {
        avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

const saveAvatarToStatic = async (req) => {
  const userId = String(req.user._id);
  const USERS_AVATARS = process.env.USERS_AVATARS;
  const filePath = req.file.path;
  const newAvatarName = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(filePath);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(filePath);
  await createFolderIsExist(path.join(USERS_AVATARS, userId));
  await fs.rename(filePath, path.join(USERS_AVATARS, userId, newAvatarName));
  const avatarUrl = path.normalize(path.join(userId, newAvatarName));
  try {
    await fs.unlink(
      path.join(process.cwd(), USERS_AVATARS, req.user.avatarURL)
    );
  } catch (err) {
    console.log(err.message);
  }
  return avatarUrl;
};

const saveAvatarToCloud = async (req) => {
  const filePath = req.file.path;
  const result = await uploadCloud(filePath, {
    public_id: req.user.imgIdCloud?.replace("Photo/", ""),
    folder: "Photo",
    transformation: { width: 250, height: 250, crop: "fill" },
  });

  // cloudinary.uploader.destroy(req.user.imgIdCloud, (err, result) => {
  //   console.log(err, result);
  // });

  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.log(err.message);
  }
  return result;
};

const verify = async (req, res, next) => {
  try {
    const user = Users.findByVerificationToken(req.params.token);
    if (user) {
      await Users.updateVerificationToken(user.id, true, null);
      return res.status(HttpCode.OK).json({
        status: "Success",
        code: HttpCode.OK,
        message: "Verification successful!",
      });
    }

    return res.status(HttpCode.BAD_REQUEST).json({
      status: "Error",
      code: HttpCode.BAD_REQUEST,
      data: "Bad request",
      message: "Link is not valid",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  // updateUserSub,
  avatars,
  verify,
};
