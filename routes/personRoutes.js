const express = require('express');
const router  = express.Router();
const User = require('../Model/User');
const  mongoose  = require('mongoose');

router.get('/',async (req, res)=>{
    await User.find({}).then(async (result)=>{
        res.send(result);
    })
})  
router.post('/createUser',async (req, res)=>{
    console.log(req.body)
    await User.create(req.body).then(async (result)=>{
        res.send(result);
    })
}) 
router.post('/update',async (req, res)=>{
    let {id,value} = req.body
    value = (value === 'true') ? true : false
    id = new mongoose.Types.ObjectId(id)
    console.log(req.body)
    console.log(id)
    await User.findByIdAndUpdate({_id:id},{$set:{isAdmin:value}}).then(async (result)=>{
        res.send(result);
    })
})  
module.exports = router;