const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      id:String,
      secure_url:String,
    },
    coverPicture: {
      id:String,
      secure_url:String,
    },
    friends: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
      default: ''
    },
    from: {
      type: String,
      max: 50,
      default: ''
    },
    relationship: {
      type: String,
      default: ''
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usermodel", UserSchema);
