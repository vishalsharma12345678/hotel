const express = require("express");
const app = express();
const port = 4000;
const session = require("express-session");
const path = require("path");
const routes = require("./routes");
const db = require("./db");
const schedule = require("node-schedule");

require("dotenv").config();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var cors = require("cors");
const Booking = require("./Model/Booking");
app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://starfish-app-9da43.ondigitalocean.app/",
    ],
    credentials: true,
  })
);
app.use(
  session({
    //name to be put in "key" field in postman etc
    secret: "SESS_SECRET",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 24,
      expires: 24 * 60 * 60,
    },
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(async (req, res, next) => {
  let user = req.session.user;
  if (!user) return next();
  res.locals.user = user;
  next();
});

schedule.scheduleJob("* * */1 * *", async function () {
  let fine = await Booking.find({ payment_type: "onhold" });
  fine.forEach((item) => {});
  console.log(fine);
  console.log(new Date());
});
app.use(routes);
app.listen(process.env.PORT, () => {
  console.log("connected sucessfully " + process.env.PORT);
});
