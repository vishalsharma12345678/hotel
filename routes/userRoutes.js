const express = require("express");
const User = require("../Model/User");
const router = express.Router();
router.get("/", function (req, res) {
  res.render("login");
});
router.post("/getlogin", function (req, res) {
  console.log(req.body);
  User.findOne({ username: req.body.username }).then(function (user) {
    console.log(user);
    if (user) {
      if (req.body.password === user.password) {
        req.session.user = user;
        return res.send(user);
      }
      return res.status(404).send("Invalid username or Password");
    } else {
      return res.status(404).send("Invalid username or Password");
    }
  });
});
router.get("/register", function (req, res) {
  //   console.log(req.body);
  User.create({
    name: "vishal",
    username: "vishal",
    password: "vishal",
    mobileNumber: "9368660084",
    address: "sdfsdfsdf",
  }).then(function (user) {
    return res.send(user);
  });
});
module.exports = router;
