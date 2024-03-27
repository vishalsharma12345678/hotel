const express = require("express");
const Rooms = require("../Model/Room");
const Bookings = require("../Model/Booking");
const RoomType = require("../Model/Roomtype");
const Guests = require("../Model/Guests");
const router = express.Router();
router.use("/room", require("./roomRoutes"));
router.use("/book", require("./BookingRoutes"));
router.use("/login", require("./userRoutes"));
router.use("/user", require("./personRoutes"));
router.get("/", function (req, res) {
  console.log(res.locals.user);
  res.render("login");
});
router.get("/guests", async function (req, res) {
  let guest = await Guests.find({});
  console.log(guest);
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
router.get("/Roomtype", async (req, res) => {
  res.send(await RoomType.find());
});
module.exports = router;
