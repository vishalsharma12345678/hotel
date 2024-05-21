const mongoose = require("mongoose");

let url =
  "mongodb+srv://vshalsha1234:12345adt@cluster0.5pec6tp.mongodb.net/HotalABCretryWrites=true&w=majority";
// let url = "mongodb://127.0.0.1:27017/HotelABC";
//connect to the database
mongoose.connect(url, {
  useNewUrlParser: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

//error
db.on("error", function (err) {
  console.log(err.message);
});

//up and running then print the message
db.once("open", function () {
  console.log("Successfully connected to the database");
});
