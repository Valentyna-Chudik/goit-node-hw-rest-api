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

const createUser = async ({ email, password }) => {
  try {
    const newUser = new User({ email, password });
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

const findUserByToken = async (token) => {
  try {
    const result = await User.findOne({ token });
    return result;
  } catch (err) {
    return console.error(err.message);
  }
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserToken,
  findUserByToken,
};
