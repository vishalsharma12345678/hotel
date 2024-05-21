const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: String,
  },
  booking: {
    type: Boolean,
    default: false,
  },
  addRoom: {
    type: Boolean,
    default: false,
  },
  lockedRoom: {
    type: Boolean,
    default: false,
  },
  Roomtype: {
    type: Boolean,
    default: false,
  },
  Users: {
    type: Boolean,
    default: false,
  },
  recption: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
