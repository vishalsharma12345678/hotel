const express = require("express");
const Booking = require("../Model/Booking");
const Rooms = require("../Model/Room");
const mongoose = require("mongoose");
const Guests = require("../Model/Guests");
const CurrentBooking = require("../Model/CurrentBooking");
const Invoices = require("../Model/Invoices");
const router = express.Router();
router.post("/gues", async (req, res) => {
  console.log(req.body);
  await Invoices.find({ _id: { $in: req.body } }).then((result) => {
    console.log(result);
    res.send({ result: result });
  });
});
router.post("/addbooking", async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  let room_ids = [];
  let { room_number, ...rest } = req.body;
  room_number.forEach(async (room) => {
    room_ids.push(room._id);
  });
  let fulldata = { room_number: room_ids, ...rest };
  let g = await Guests.insertMany(fulldata.guest);
  let id = g.map(function (guest) {
    return guest._id;
  });
  const { guest, ...rest1 } = fulldata;
  let check_in_check_out =
    rest1.check_in === new Date().toISOString().split("T")[0]
      ? "Checkedin"
      : undefined;
  fulldata = {
    ...rest1,
    moreperson: id,
    check_in_check_out: check_in_check_out,
  };
  console.log(fulldata);
  await Booking.create(fulldata).then(async (book) => {
    room_number.forEach(async (room) => {
      let currentdata = await CurrentBooking.create({
        user_id: req.body.userid,
        formdate: req.body.check_in,
        todate: req.body.check_out,
        status: "booked",
        booked_id: book._id,
      });
      await Rooms.findOne({ _id: room._id }).then(async (r) => {
        r.currentbookings.push(currentdata._id);
        r.status = "booked";
        await r.save();
      });
    });
    res.send("ok");
  });
});
router.get("/allBookings", async (req, res) => {
  await Booking.find({
    $and: [
      { check_in: { $lte: new Date().toISOString().split("T")[0] } },
      { check_out: { $gte: new Date().toISOString().split("T")[0] } },
      { check_in_check_out: { $ne: "Checkedout" } },
    ],
  })
    .populate("room_number")
    .then(async (bookings) => {
      if (!bookings) return res.status(404).send("Error in Finding");
      const Upcomingbooking = await Booking.find({
        $and: [
          { check_in: { $gt: new Date().toISOString().split("T")[0] } },
          { status: { $eq: "booked" } },
        ],
      }).populate("room_number");
      const Lastbooking = await Booking.find({
        $or: [
          { check_out: { $lt: new Date().toISOString().split("T")[0] } },
          { status: { $ne: "booked" } },
        ],
      })
        .populate("room_number")
        .populate("moreperson");
      res.send({
        booking: bookings,
        Upcomingbooking: Upcomingbooking,
        Lastbooking: Lastbooking,
      });
    });
});
router.get("/allBookingslength", async (req, res) => {
  await Booking.find({}).then(async (bookings) => {
    if (!bookings) return res.status(404).send("Error in Finding");
    res.send({
      booking: bookings.length,
    });
  });
});
router.get("/allBooking/:id", async (req, res) => {
  await Booking.findOne({ _id: req.params.id })
    .populate("room_number")
    .populate("moreperson")
    .then((bookings) => {
      if (!bookings) return res.status(404).send("Error in Finding");
      console.log(bookings);
      res.send(bookings);
    });
});
router.get("/allBookingRoom/:id", async (req, res) => {
  await Booking.findOne({ _id: req.params.id })
    .populate("room_number")
    .then((bookings) => {
      if (!bookings) return res.status(404).send("Error in Finding");
      res.send(bookings.room_number);
    });
});
router.post("/updateBooking", async (req, res) => {
  const { bookingid, roomid } = req.body;
  console.log(req.body);
  const bookingitem = await Booking.findOne({ _id: bookingid });
  bookingitem.status = bookingitem.status === "booked" ? "cancelled" : "booked";
  await bookingitem.save();
  const room = await Rooms.findOne({ _id: bookingitem.room_number })
    .populate("currentbookings")
    .exec();
  const bookings = room.currentbookings;
  console.log(new mongoose.Types.ObjectId(roomid));
  const temp = bookings.filter((booking) => {
    booking._id !== new mongoose.Types.ObjectId(roomid);
  });
  console.log(temp);
  room.currentbookings = temp;
  await room.save();
  res.send("ok");
});
router.post("/updateBookingcheckin", async (req, res) => {
  const { bookingid, value } = req.body;
  console.log(req.body);
  const bookingitem = await Booking.findOne({ _id: bookingid }).populate(
    "userid"
  );
  console.log(bookingitem);
  bookingitem.check_in_check_out = value;

  await bookingitem.save();

  res.send("ok");
});
router.post("/updateBookingEntry", async (req, res) => {
  const { bookingid, value } = req.body;
  console.log(req.body);
  const bookingitem = await Booking.findOne({ _id: bookingid }).populate(
    "userid"
  );
  console.log(bookingitem);
  bookingitem.check_in_check_out = value;
  bookingitem.status = "cancelled";

  if (value === "Checkedout") {
    bookingitem.room_number.forEach(async (room1) => {
      const room = await Rooms.findOne({ _id: room1 })
        .populate("currentbookings")
        .exec();
      const temp = Array.from(room.currentbookings).filter((booking) => {
        booking.booked_id !== new mongoose.Types.ObjectId(bookingitem._id);
      });
      room.currentbookings = temp;
      await room.save();
    });
  }
  let oe = await Invoices.create({
    invoiceNumber: bookingitem.invoice_No,
    invoicePlayer: bookingitem.full_name,
    Tax: 12,
    TGST: 10,
    totalAmount:
      bookingitem.price *
      days(new Date(bookingitem.check_in), new Date(bookingitem.check_out)) *
      (bookingitem.adultNo / 4),
    paymentType: bookingitem.payment_type,
    status: bookingitem.status,
    bookingid: bookingitem._id,
  });
  bookingitem.Invoice = oe._id;
  await bookingitem.save();

  res.send("ok");
});
router.post("/updateBookingEntryhold", async (req, res) => {
  const { bookingid, value } = req.body;
  const bookingitem = await Booking.findOne({ _id: bookingid }).populate(
    "userid"
  );
  bookingitem.check_in_check_out = value;
  bookingitem.status = "cancelled";

  if (value === "Checkedout") {
    bookingitem.room_number.forEach(async (room1) => {
      const room = await Rooms.findOne({ _id: room1 })
        .populate("currentbookings")
        .exec();
      const temp = Array.from(room.currentbookings).filter((booking) => {
        booking.booked_id !== new mongoose.Types.ObjectId(bookingitem._id);
      });
      room.currentbookings = temp;
      await room.save();
    });
  }

  bookingitem.Invoice = null;
  await bookingitem.save();

  res.send("ok");
});
router.post("/updateBookingEntryCredit", async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  const bookingitem = await Booking.findOne({ _id: id }).populate("userid");
  console.log(bookingitem);
  bookingitem.payment_type = "credit";

  let oe = await Invoices.create({
    invoiceNumber: bookingitem.invoice_No,
    invoicePlayer: bookingitem.full_name,
    Tax: 12,
    TGST: 10,
    totalAmount:
      bookingitem.price *
        days(new Date(bookingitem.check_in), new Date(bookingitem.check_out)) *
        (bookingitem.adultNo / 4) ===
      0
        ? 1
        : bookingitem.adultNo / 4,
    paymentType: bookingitem.payment_type,
    status: bookingitem.status,
    bookingid: bookingitem._id,
  });
  bookingitem.Invoice = oe._id;
  await bookingitem.save();

  res.send("ok");
});
router.post("/updatebookingdetails", async (req, res) => {
  console.log(req.body);
  await Booking.findByIdAndUpdate(
    { _id: req.body._id },
    { $set: req.body }
  ).then((result) => {
    res.send(result);
  });
});
router.get("/deletebooking/:id", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id).then((result) => {
    res.send(result);
  });
});
router.get("/invoices", async (req, res) => {
  await Invoices.find()
    .populate({
      path: "bookingid",
      populate: {
        path: "moreperson",
      },
    })
    .then((result) => {
      res.send({ result: result });
    });
});
function days(i, j) {
  let Difference_In_Time = i.getTime() - j.getTime();
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  return Math.abs(Difference_In_Days) + 1;
}
router.post("/allBookingswithdate", async (req, res) => {
  console.log(req.body);
  const Upcomingbooking = await Booking.find({
    $and: [
      { check_in: { $gte: new Date().toISOString().split("T")[0] } },
      { status: { $eq: "booked" } },
    ],
    check_in: {
      $gt: String(new Date(req.body.check_in).toISOString().split("T")[0]),
    },
    check_out: {
      $lt: String(new Date(req.body.check_out).toISOString().split("T")[0]),
    },
  }).populate("room_number");
  const Lastbooking = await Booking.find({
    check_in: {
      $gte: req.body.check_in,
    },
    check_out: {
      $lte: req.body.check_out,
    },
    $or: [
      { check_out: { $lte: new Date().toISOString().split("T")[0] } },
      { check_in_check_out: "Checkedout" },
      { status: { $ne: "booked" } },
    ],
  })
    .populate("room_number")
    .populate("moreperson");
  console.log(Lastbooking);
  res.send({
    Lastbooking: Lastbooking,
    Upcomingbooking: Upcomingbooking,
  });
});

module.exports = router;
