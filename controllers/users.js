var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

// var User = require('../models/users.js');

// router.get('/new', function(req, res){
//     res.render('users/new.ejs');
// });

router.post('/', function(req, res){
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    console.log(req.body);
    User.create(req.body, function(err, createdUser){
        res.redirect('/');
    });
});

module.exports = router;
