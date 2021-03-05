const mongoose = require("mongoose");
const { Schema, model, SchemaTypes } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set your name, please"],
      minlength: 3,
      maxlength: 30,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Set your email, please"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Set your phone number, please"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
      required: true,
    },

    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

// contactSchema.virtual("contactId").get(function () {
//   return this._id;
// });

contactSchema.plugin(mongoosePaginate);

const Contact = model("contact", contactSchema);

module.exports = Contact;
