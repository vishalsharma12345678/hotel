const mongoose = require("mongoose");
const Guests = require("./Guests");
const { Schema } = mongoose;
const BookingSchema = new Schema(
  {
    registrationNo: {
      type: String,
      required: true,
    },
    invoice_No: {
      type: String,
      required: true,
    },
    log_No: {
      type: Number,
      required: true,
    },
    check_in_check_out: {
      type: String,
      default: "waiting to checkin",
    },
    check_in: {
      type: Date,
      required: true,
    },
    check_out: {
      type: Date,
      required: true,
    },
    room_type: {
      type: String,
      required: true,
    },
    currentbooking: {
      type: String,
      // required: true,
    },
    meal_plan: {
      type: String,
      required: true,
    },
    room_number: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Rooms",
        required: true,
      },
    ],
    guest_basis: {
      type: String,
      required: true,
    },
    guest_type: {
      type: String,
      required: true,
    },
    bill_to: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      default: "",
    },
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    wp_nd: {
      type: String,
      dafalt: "",
    },
    passport_number: {
      type: String,
      default: "",
    },
    nationality: {
      type: String,
      required: true,
    },
    country_residence: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    proffesion: {
      type: String,
      required: true,
    },
    adultNo: Number,
    children: Number,
    adultCharges: {
      type: Boolean,
      default: false,
    },
    group: {
      type: String,
      required: true,
    },
    payment_type: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
    verifiedby: {
      type: String,
    },
    price: {
      type: Number,
    },
    currency: {
      type: String,
      default: "USD",
    },
    userid: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    status: { type: String, default: "booked" },
    moreperson: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Guests",
      },
    ],
  },
  { timestamps: true }
);

const Booking = mongoose.model("booking", BookingSchema);

module.exports = Booking;
