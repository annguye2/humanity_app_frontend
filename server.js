var express = require('express');
var app = express();
var port = 8000 || process.env.PORT;

app.use(express.static('public'));

app.listen(port, function(){
  console.log('=================================================');
  console.log('Humanity App frontend server runs on port: ', port);
  console.log('=================================================');
});
