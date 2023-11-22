const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 30,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: {
        user: "user",
        admin: "admin",
      },
      default: "user",
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    wishlist: {
      type: [String],
      default: [],
    },
    cart: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
