const express = require("express");
const Rooms = require("../Model/Room");
const Bookings = require("../Model/Booking");
const RoomType = require("../Model/Roomtype");
const Guests = require("../Model/Guests");
const Company = require("../Model/Company");
const router = express.Router();
router.use("/room", require("./roomRoutes"));
router.use("/book", require("./BookingRoutes"));
router.use("/login", require("./userRoutes"));
router.use("/user", require("./personRoutes"));
router.use("/holdbills", require("./onHoldRoute"));
const mongoose = require("mongoose");
router.get("/", function (req, res) {
  console.log(res.locals.user);
  res.render("login");
});
router.get("/Company/details", async function (req, res) {
  let data = await Company.create({
    name: "Off days inn",
    Tgst_Tax: 12,
    Tax: 8,
    owner: "XYZ",
  });
  res.send(data);
});

router.get("/Company/details/find", async function (req, res) {
  console.log("first");
  let data = await Company.find({});
  console.log(data);
  res.send(data);
});
router.post("/Company/details/find", async function (req, res) {
  console.log(req.body);
  let data = await Company.updateOne(
    {
      _id: new mongoose.Types.ObjectId("664d95310e1d38687bc012e8"),
    },
    {
      $set: {
        Tgst_Tax: req.body.Tgst_Tax,
        Tax: req.body.Tax,
      },
    }
  );
  res.send(data);
});

router.get("/guests", async function (req, res) {
  let guest = await Guests.find({});
  res.send(guest);
});
router.get("/d", function (req, res) {
  console.log(res.locals.user);
  Rooms.find({ Occupied: true }).then((rooms) => {
    res.render("Dashboard");
  });
});
router.get("/r", function (req, res) {
  console.log(res.locals.user);
  Rooms.find({}).then((rooms) => {
    res.render("registertion", { rooms: rooms });
  });
});
router.get("/roomsInventory", function (req, res) {
  Rooms.find({}).then((rooms) => {
    res.render("roomsInventory", { rooms: rooms });
  });
});
router.post("/addbooking", async function (req, res) {
  Bookings.create(req.body).then((booking) => {
    Rooms.findByIdAndUpdate(
      { _id: req.body.userid },
      {
        $set: {
          currentbookings: [
            {
              from: req.body.check_in,
            },
          ],
        },
      }
    ).then((rooms) => {
      res.send;
    });
  });
});
router.get("/roomsType", function (req, res) {
  res.render("roomsType");
});
router.get("/lockedRooms", function (req, res) {
  Rooms.find({ Room_Status: "Locked" }).then((rooms) => {
    res.render("locked", { rooms: rooms });
  });
});
router.get("/addroom", function (req, res) {
  res.render("addnewroom");
});
router.post("/addRoomtype", async (req, res) => {
  console.log(req.body);
  await RoomType.create({ name: req.body.data });
  res.send("ok");
});
router.get("/deleteRoomtype/:id", async (req, res) => {
  console.log(req.params.id);
  let data = await RoomType.findByIdAndDelete(req.params.id);
  console.log(data);
  res.send("ok");
});
router.get("/Roomtype", async (req, res) => {
  res.send(await RoomType.find());
});
module.exports = router;
