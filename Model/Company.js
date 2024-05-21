const mongoose = require("mongoose");

const { Schema } = mongoose;
const CompanySchema = new Schema(
  {
    name: String,
    Tgst_Tax: Number,
    Tax: Number,
    owner: String,
  },
  { timestamps: true }
);

const Booking = mongoose.model("companys", CompanySchema);

module.exports = Booking;
