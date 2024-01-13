const express = require("express");
const User = require('../Model/User')
const router = express.Router();
router.get('/', function (req, res) {
    res.render('login')
})
router.post('/getlogin', function (req, res) {
    console.log(req.body)
    User.findOne({username: req.body.username}).then(function (user) {
        console.log(user)
        if(req.body.password === user.password) {
            req.session.user = user;
            return res.send(user)
        }
    })
})
router.post('/register', function (req, res) {
    console.log(req.body)
    User.create(req.body).then(function (user) {
        return res.send(user)
    })
})
module.exports = router;