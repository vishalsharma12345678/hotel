const mongoose = require("mongoose");
const { Schema } = mongoose;
const InvoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
    },
    invoiceOpretor: {
      type: String,
    },
    invoicePlayer: {
      type: String,
    },
    TGST: {
      type: Number,
    },
    Tax: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentType: {
      type: String,
    },
    status: {
      type: String,
    },
    bookingid: {
      type: mongoose.Types.ObjectId,
      ref: "booking",
    },
  },
  { timestamps: true }
);

const Invoices = mongoose.model("Invoices", InvoiceSchema);

module.exports = Invoices;
