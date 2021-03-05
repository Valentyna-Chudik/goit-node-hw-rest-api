const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");
const { Subscriptions } = require("../../helpers/constants");

require("dotenv").config();
const saltWorkFactor = Number(process.env.SALT_WORK_FACTOR);
// console.log(typeof saltWorkFactor);

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    subscription: {
      type: String,
      enum: [Subscriptions.FREE, Subscriptions.PRO, Subscriptions.PREMIUM],
      default: Subscriptions.FREE,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(saltWorkFactor);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

// userSchema.path("email").validate(function (value) {
//   const re = /\S+@\S+\.\S+/;
//   return re.test(String(value).toLocaleLowerCase());
// });

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("user", userSchema);

module.exports = User;
