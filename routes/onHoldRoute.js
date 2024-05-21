const express = require("express");
const Booking = require("../Model/Booking");

const router = express.Router();

router.get("/", async function (req, res) {
  let bills = await Booking.find({ payment_type: "onhold" });
  console.log(bills);
  res.send(bills);
});

router.post("/update", async function (req, res) {
  let bills = await Booking.find({ payment_type: "onhold" });
  console.log(bills);
  res.send(bills);
});

module.exports = router;
