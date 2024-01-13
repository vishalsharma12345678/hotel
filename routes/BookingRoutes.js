const express = require("express");
const Booking = require("../Model/Booking");
const Rooms = require("../Model/Room");
const mongoose = require("mongoose");
const Guests = require("../Model/Guests");
const CurrentBooking = require("../Model/CurrentBooking");
const Invoices = require("../Model/Invoices");
const router = express.Router();
router.post('/gues',async (req, res) => {
  console.log(req.body)
  await Invoices.find({_id:{$in:req.body}})
  .then((result) => {
    console.log(result)
   res.send({result:result});
  })
});
router.post("/addbooking", async function (req, res) {
  console.log(req.body);
  let g = await Guests.insertMany(req.body.guest)
    // console.log(g)
    let id = g.map(function (guest) { return guest._id})
    const {guest,...rest} = req.body
    let check_in_check_out= req.body.check_in === new Date().toISOString().split('T')[0]?"Checkedin":undefined
    const fullData = {...rest,moreperson:id,check_in_check_out:check_in_check_out}
    console.log(fullData)
    await Booking.create(fullData).then(async (book) => {
      if (!book) return res.status(404).send("Error creating room");
      let currentdata = await CurrentBooking.create({
          user_id: req.body.userid,
          formdate: req.body.check_in,
          todate: req.body.check_out,
          status: "booked",
          booked_id: book._id
      })
      await Rooms.findOne({ _id: req.body.room_number }).then(async (rooms) => {
        rooms.currentbookings.push(currentdata._id)
        rooms.status = "booked";
        await rooms.save().then((response)=>{
          res.send(response)
        })
      });
    });
  

});
router.get('/allBookings',async (req, res) => {
  await Booking.find({check_in_check_out:"Checkedin"}).populate('room_number').then(async(bookings) =>{
    if(!bookings) return res.status(404).send('Error in Finding')
    const Upcomingbooking = await Booking.find({$and:[{check_in:{$gt:new Date().toISOString().split('T')[0]}},{status:{$eq:"booked"}}]}).populate('room_number')
    const Lastbooking = await Booking.find({$or:[{check_out:{$lt:new Date().toISOString().split('T')[0]}},{check_in_check_out:"Checkedout"},{status:{$ne:"booked"}}]}).populate('room_number')
    res.send({booking:bookings,Upcomingbooking:Upcomingbooking,Lastbooking:Lastbooking})
  })
});
router.get('/allBooking/:id',async (req, res) => {
  await Booking.findOne({_id:req.params.id}).populate('room_number').populate('moreperson').then((bookings) =>{
    if(!bookings) return res.status(404).send('Error in Finding')
    res.send(bookings)
  })
});
router.get('/allBookingRoom/:id',async (req, res) => {
  await Booking.findOne({_id:req.params.id}).populate('room_number').then((bookings) =>{
    if(!bookings) return res.status(404).send('Error in Finding')
    res.send(bookings.room_number);
  })
});
router.post('/updateBooking',async (req, res) => {
  const {bookingid,roomid } = req.body;
  console.log(req.body)
    const bookingitem = await Booking.findOne({_id: bookingid}) 
    bookingitem.status = bookingitem.status==='cancelled'?'booked':"cancelled"
    await bookingitem.save();
    const room = await Rooms.findOne({_id:bookingitem.room_number}).populate('currentbookings').exec();
    const bookings = room.currentbookings
    console.log(new mongoose.Types.ObjectId(roomid))
    const temp=bookings.filter(booking=>{
      booking._id !== new mongoose.Types.ObjectId(roomid)
    })
    console.log(temp);
    room.currentbookings=temp;
    await room.save()
    res.send('ok')
});
router.post('/updateBookingEntry',async (req, res) => {
  const {bookingid,value } = req.body;
  console.log(req.body)
    const bookingitem = await Booking.findOne({_id: bookingid}).populate('userid')
    bookingitem.check_in_check_out = value
    if(value === 'Checkedout'){
      const room = await Rooms.findOne({_id:bookingitem.room_number}).populate('currentbookings').exec();
      const bookings = room.currentbookings
      console.log(new mongoose.Types.ObjectId(bookingitem.currentbooking))
      const temp=bookings.filter(booking=>{
        booking._id !== new mongoose.Types.ObjectId(bookingitem.currentbooking)
      })
      console.log(temp);
    room.currentbookings=temp;
    await room.save()
    }
    let oe = await Invoices.create({
      invoiceNumber:bookingitem.invoice_No,
      invoicePlayer:bookingitem.userid.name,
      Tax:12,
      TGST: 10,
      totalAmount: bookingitem.totalAmount,
      paymentType: bookingitem.payment_type,
      status: bookingitem.status,
      bookingid:bookingitem._id,
    })
    bookingitem.Invoice = oe._id;
    await bookingitem.save();
    res.send('ok')
});
router.post('/updatebookingdetails',async (req, res) => {
    await Booking.findByIdAndUpdate({_id:req.body._id},{$set:req.body}).then((result)=>{
      res.send(result);
    })

});
router.get('/deletebooking/:id',async (req, res) => {
   await Booking.findByIdAndDelete(req.params.id)
   .then((result) => {
    res.send(result);
   })
});
router.get('/invoices',async (req, res) => {
  await Invoices.find().populate({
    path:'bookingid',
    populate:{
      path:'moreperson'
    }
  })
  .then((result) => {
   res.send({result:result});
  })
});

module.exports = router;
