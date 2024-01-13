const mongoose = require("mongoose");
const { Schema } = mongoose;
const GuestsSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    dob:{
        type:String,
        required: true
    },
    wp_pass:{
        type:String,
        required: true
    },
    nationality:{
        type:String,
        required: true
    },
    addharNo:{
        type:Number
    }
});

const Guests = mongoose.model("Guests", GuestsSchema);

module.exports = Guests;
