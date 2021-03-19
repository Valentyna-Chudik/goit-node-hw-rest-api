const User = require("./schemas/user");

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

const createUser = async ({ email, password, verify, verificationToken }) => {
  try {
    const newUser = new User({ email, password, verify, verificationToken });
    return await newUser.save();
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

const updateVerificationToken = async (userId, verify, verificationToken) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { verify, verificationToken }
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

// const findUserAndUpdate = async (userId, subscription) => {
//   try {
//     const result = await User.updateOne({ _id: userId }, { subscription });
//     return result;
//   } catch (err) {
//     console.error(err.message);
//   }
// };

module.exports = {
  findUserByEmail,
  findUserById,
  findUserByToken,
  findByVerificationToken,
  createUser,
  updateUserToken,
  updateVerificationToken,
  updateUserAvatar,
  // findUserAndUpdate,
};
