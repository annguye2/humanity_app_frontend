var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var session = require('express-session');

// var User = require('../models/users.js');

router.get('/new', function(req, res){
  res.render('sessions/new.ejs');
});

router.post('/', function(req, res){
  User.findOne({ username: req.body.username }, function(err, foundUser){
    if (!foundUser){
      res.render('sessions/tryagain.ejs');
    }
    else if (foundUser){
      if (bcrypt.compareSync(req.body.password, foundUser.password)){
        req.session.currentuser = foundUser;
        res.redirect('/');
      } else {
        // res.send('wrong username or password');
        res.render('sessions/tryagain.ejs');
      }
    }
  });
});

router.delete('/', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

module.exports = router;
