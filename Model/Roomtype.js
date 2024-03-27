const mongoose = require("mongoose");
const { Schema } = mongoose;
const RoomTypeSchema = new Schema(
  {
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

const RoomType = mongoose.model("RoomType", RoomTypeSchema);

module.exports = RoomType;
