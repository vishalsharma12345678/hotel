const express = require("express");

const router = express.Router();
const Room = require("../Model/Room");
const f = require("../Model/Booking");
router.post("/addroom", async function (req, res) {
  await Room.create(req.body).then((room) => {
    if (!room) return res.status(404).send("Error creating room");
    res.send(room);
  });
});

router.get("/lockRoom/:id", async function (req, res) {
  await Room.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { Room_Status: "Locked" } }
  ).then((room) => {
    if (!room) return res.status(404).send("Error creating room");
    res.send("ok");
  });
});
router.get("/lockRoom", async function (req, res) {
  await Room.find({ Room_Status: "Locked" }).then((room) => {
    if (!room) return res.status(404).send("Error creating room");
    res.send(room);
  });
});
router.get("/unlockRoom/:id", function (req, res) {
  Room.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { Room_Status: "Available" } }
  ).then((room) => {
    if (!room) return res.status(404).send("Error creating room");
    res.redirect("/lockedRooms");
  });
});

router.post("/getroombyid", async (req, res) => {
  try {
    const room = await Room.findOne({ _id: req.body.roomid })
      .populate("currentbookings")
      .exec();
    res.send(room);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.get("/getallroomsAvalible", async (req, res) => {
  try {
    const rooms = await Room.find({ Room_Status: "Available" })
      .populate("currentbookings")
      .exec();
    res.send(rooms);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
router.post("/getallroomsAvalible", async (req, res) => {
  // console.log(req.body.value);
  try {
    const rooms = await Room.find({
      $and: [
        {
          Room_Status: "Available",
        },
        { roomType: req.body.value },
      ],
    })
      .populate("currentbookings")
      .exec();
    res.send(rooms);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("currentbookings").exec();
    res.send(rooms);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
router.get("/getallroomstype", async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("currentbookings").exec();
    const u = rooms.map((item) => Number(item.roomNo));
    res.send(u);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
router.get("/roomsDetails", async (req, res) => {
  try {
    let EmptyRooms = await Room.find({
      status: { $ne: "booked" },
      Room_Status: "Available",
    });
    const OccupiedRoom = await Room.find({ status: { $eq: "booked" } });
    const Upcomingbooking = await f.find({
      $and: [
        { check_in: { $gt: new Date().toISOString().split("T")[0] } },
        { status: { $eq: "booked" } },
      ],
    });
    const Lastbooking = await f.find({
      $and: [
        { check_out: { $lt: new Date().toISOString().split("T")[0] } },
        { check_in_check_out: "Checkedout" },
      ],
    });
    res.send({
      EmptyRooms: `${EmptyRooms.length}`,
      OccupiedRoom: `${OccupiedRoom.length}`,
      Upcomingbooking: `${Upcomingbooking.length}`,
      Lastbooking: `${Lastbooking.length}`,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
router.get("/delete/:id", async function (req, res) {
  console.log(req.params);
  await Room.findByIdAndDelete(req.params.id).then(async (room) => {
    if (!room) return res.status(404).send("Error creating room");
  });
  res.send("ok");
});
module.exports = router;
