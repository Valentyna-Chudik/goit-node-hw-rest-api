const contacts = [
  {
    _id: "606215a005cda41e4c2dcd41",
    subscription: "pro",
    name: "Test1",
    email: "test2@test.com",
    phone: "11111111111",
    owner: "604f42c81fef561744d46245",
  },

  {
    _id: "604215a805cda41e5c2dcd42",
    subscription: "free",
    name: "Test2",
    email: "test2@test.com",
    phone: "22222222222",
    owner: "604f42c81fef561744d46245",
  },
];

const newContact = {
  name: "Test3",
  email: "test3@test.com",
  phone: "33333333333",
  subscription: "free",
};

const User = {
  _id: "604f42c81fef561744d46245",
  subscription: "free",
  token:
    "eiJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDRmNDJjODFmZWY1NjE3NDRkNDYyNDUiLCJpYXQiOjE2MTU4MDcyMTUsImV4cCI6MTYxNTgzNjAxNX0.6kA2vtGhRzTLTr5IusaweOaKagzvQB5OBDn0qo7zf_4",
  email: "test@user.net",
  password: "$2a$08$v3BWIRxRp5wG5XIvfsJSKe1OfDre9pnEbO1vFR8YThVIsl9b8SODu",
  avatarURL:
    "https://s.gravatar.com/avatar/b116f96ec0cc65d90eb1b7bffff75725?s=250",
};

const users = [];
users[0] = User;

const newUser = { email: "test2@user.com", password: "123456" };

module.exports = { contacts, newContact, User, users, newUser };
