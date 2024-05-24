const mongoose = require("mongoose");
const { Schema } = mongoose;
const RoomsSchema = new Schema(
  {
    roomNo: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    Room_amneities: {
      type: String,
      required: true,
    },
    Room_Status: {
      type: String,
      required: true,
    },
    room_type_name: {
      type: String,
      required: true,
    },
    rate_type_name: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    Bedbreakfast: {
      type: Number,
    },
    halfboard: {
      type: Number,
    },
    full_board: {
      type: Number,
    },
    adult_charge: {
      type: Number,
    },
    status: {
      type: String,
    },
    currentbookings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "CuurentBooking",
      },
    ],
  },
  { timestamps: true }
);

const Rooms = mongoose.model("Rooms", RoomsSchema);

module.exports = Rooms;
