
//require modules and models
var express = require('express');
var app = express();
// var session = require('express-session');
// var methodOverride = require ('method-override');
// app.use(bodyParser.json());
// var bcrypt= require('bcrypt');


app.use(express.static('public'));
var port = 8000 || process.env.PORT;

//
//
// app.use(methodOverride('_method'));
// app.use(bodyParser.urlencoded({extended:false}));
// app.use(session({
//     secret: "feedmeseymour", //some random string
//     resave: false,
//     saveUninitialized: false
// }));
//
// var usersController = require('./controllers/users.js');
// app.use('/users', usersController);
//
// var sessionsController = require('./controllers/sessions.js');
// app.use('/sessions', sessionsController);
//
// app.get('/', function(req, res){
//     res.render('index.ejs', {
//         currentUser: req.session.currentuser
//     });
// });
//
// app.get('/app', function(req, res){
//     if(req.session.currentuser){
//         res.send('the party');
//     } else {
//         res.redirect('/sessions/new');
//     }
// });

app.listen(port, function(){
  console.log('=================================================');
  console.log('Humanity App frontend server runs on port: ', port);
  console.log('=================================================');
});
