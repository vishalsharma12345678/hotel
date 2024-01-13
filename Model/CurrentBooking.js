const mongoose = require("mongoose");
const { Schema } = mongoose;
const CurrentSchema = new Schema({
    user_id: {
        type:mongoose.Types.ObjectId,
    },
    formdate:{
        type:String
    },
    todate:{
        type:String
    },
    status:{
        type:String
    },
    booked_id:{
        type:String
    }
    
});

const CurrentBooking = mongoose.model("CuurentBooking", CurrentSchema);

module.exports = CurrentBooking;
