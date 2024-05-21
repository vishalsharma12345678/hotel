const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  await User.find({}).then(async (result) => {
    res.send(result);
  });
});
router.post("/createUser", async (req, res) => {
  console.log(req.body);
  await User.create(req.body).then(async (result) => {
    res.send(result);
  });
});
router.post("/update", async (req, res) => {
  let { id, value } = req.body;
  id = new mongoose.Types.ObjectId(id);
  console.log(req.body);
  console.log(id);
  await User.findByIdAndUpdate({ _id: id }, { $set: { isAdmin: value } }).then(
    async (result) => {
      res.send(result);
    }
  );
});
router.post("/updatedetails", async (req, res) => {
  let { id, ...rest } = req.body;
  await User.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        name: rest.name,
        username: rest.username,
        password: rest.password,
        mobileNumber: rest.mobileNumber,
        address: rest.address,
        isAdmin: rest.isAdmin,
        booking: rest.booking,
        addRoom: rest.addRoom,
        lockedRoom: rest.lockedRoom,
        Roomtype: rest.Roomtype,
        Users: rest.Users,
      },
    }
  ).then(async (result) => {
    res.send(result);
  });
});
router.get("/deleteUser/:id", async (req, res) => {
  let { id } = req.params;
  await User.deleteOne({ _id: id }).then(async (result) => {
    res.send(result);
  });
});
module.exports = router;
