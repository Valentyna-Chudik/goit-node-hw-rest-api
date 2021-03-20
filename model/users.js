const User = require("./schemas/user");

const createUser = async ({ email, password, verificationToken }) => {
  try {
    const newUser = new User({ email, password, verificationToken });
    return await newUser.save();
  } catch (err) {
    return console.error(err.message);
  }
};

const findUserByEmail = async (email) => {
  try {
    const result = await User.findOne({ email });
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

const findUserById = async (userId) => {
  try {
    const result = await User.findOne({ _id: userId });
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

const findUserByToken = async (token) => {
  try {
    const result = await User.findOne({ token });
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

const findByVerificationToken = async (verificationToken) => {
  try {
    const result = await User.findOne({ verificationToken });
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

const updateUserToken = async (userId, token) => {
  try {
    const result = await User.updateOne({ _id: userId }, { token });
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

const updateVerificationToken = async (userId, verificationToken) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { verificationToken }
    );
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

const updateUserAvatar = async (userId, avatar, imgIdCloud) => {
  try {
    const result = await User.updateOne(
      { _id: userId },
      { avatarURL: avatar, imgIdCloud }
    );
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByToken,
  findByVerificationToken,
  updateUserToken,
  updateVerificationToken,
  updateUserAvatar,
};
