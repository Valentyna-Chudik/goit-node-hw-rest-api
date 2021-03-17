const bcrypt = require("bcryptjs");

const { users } = require("./data");

const findUserByEmail = jest.fn((email) => {
  const [user] = users.filter((el) => String(el.email) === String(email));
  return user;
});

const findUserById = jest.fn((userId) => {
  const [user] = users.filter((el) => String(el._id) === String(userId));
  return user;
});

const createUser = jest.fn(({ email, password }) => {
  const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  const newUser = {
    email,
    password: pass,
    _id: "604f42c81fef561744d46345",
    validPassword: function (pass) {
      return bcrypt.compareSync(pass, this.password);
    },
  };

  users.push(newUser);
  return newUser;
});

const updateUserToken = jest.fn((userId, token) => {
  return {};
});

const findUserByToken = jest.fn((token) => {
  const [user] = users.filter((el) => String(el.token) === String(token));
  return user;
});

// const findUserAndUpdate = async (userId, subscription) => {
//   try {
//     const result = await User.updateOne({ _id: userId }, { subscription });
//     return result;
//   } catch (err) {
//     console.error(err.message);
//   }
// };
const updateUserAvatar = jest.fn((userId, avatar, imgIdCloud) => {
  return {};
});

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserToken,
  findUserByToken,
  // findUserAndUpdate,
  updateUserAvatar,
};
