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
    breakfast_price: {
      type: Number,
      required: true,
    },
    lunch_price: {
      type: Number,
      required: true,
    },
    dinner_price: {
      type: Number,
      required: true,
    },
    breakfast_lunch: {
      type: Number,
      required: true,
    },
    lunch_dinner: {
      type: Number,
      required: true,
    },
    dinner_breakfast: {
      type: Number,
      required: true,
    },
    full_board: {
      type: Number,
      required: true,
    },
    adult_charge: {
      type: Number,
      required: true,
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
