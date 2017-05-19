console.clear();
this.player = {};
var app = angular.module('CAHApp', []);

app.controller('UsersController', ['$http', function($http){
console.log("username: ", this.name);
  this.domainurl1 = "http://localhost:3000";
  this.loginUser = function(userPass) {
    // console.log(userPass);
  $http({ // Makes HTTP request to server
    method: 'POST',
    url: this.domainurl1 + '/players/login',
    data: {
      player: { // Gets turned into req.body
        username: userPass.username,
        password: userPass.password
      }
    }
  }).then(function(response) {
    // controller.user = response.data;
    // controller.logInUsername = controller.logInPassword = "";
    this.player=response.data.player;
    localStorage.setItem('token', JSON.stringify(response.data.token));
    var mainpage = "http://localhost:8000/app.html";
    window.location.href = mainpage;
   //  console.log(response);
   console.log(JSON.parse(localStorage.getItem('token')));
   }.bind(this));
   };

   this.getPlayers = function() {
      $http({ // Makes HTTP request to server
        method: 'GET',
        url: this.domainurl1 + '/players/',
        headers: {
          Authorization: 'Bearer' + JSON.parse(localStorage.getItem('token'))
          }
      }).then(function(response) {
       if(response.data.status == 401) {
          this.error = "Unauthorized";
       } else {
          this.players = resonse.data;
       }
      }.bind(this));
   };

   this.logout = function(){
      localStorage.clear('token');
      location.reload();
   };

  this.createUser = function(){
    // console.log("username: ", this.name);

    $http({ // Makes HTTP request to server
        method: 'POST',
        url: this.domainurl1 + '/players',
        data: { // Gets turned into req.body
          name: this.name,
          img: this.img,
          password: this.password,
          email: this.email,
          high_score: 0
        }
      }).then(function(response) {
        // this.logInUsername = controller.newUserUsername;
        // this.logInPassword = controller.newUserPassword;
        // controller.newUserName = controller.newUserUsername = controller.newUserPassword = controller.newUserImage = "";
        // controller.logIn();
      }.bind(this));
  };

  }]);


app.controller('CardsController', ['$http', function($http, $timeout){
  var domainurl2 = "http://localhost:3000";
  this.whitecards = [];
  this.blackcards = [];
  this.answers    = [];
  this.isSelected = false;
  this.computerAnswer = '';
  this.selectedBlackCard = {};
  this.selectedWhiteCard1 = {};
  this.selectedWhiteCard2 = {};
  this.playerScore = 0;
  this.computerScore = 0;
  this.gameCount = 0 ;
  this.gameIsOver = false;
  //  GET ALL WHITE CARDS

  $http({
     method: 'GET',
     url: domainurl2 + '/blackcards'
  }).then(function(result){
     this.blackcards = result.data;
    //  console.log(this.blackcards);
  }.bind(this));

  $http({
     method: 'GET',
     url: domainurl2 + '/whitecards'
  }).then(function(result){
     this.whitecards = result.data;
    //  console.log(this.whitecards);
  }.bind(this));




this.dealBlack = function (){
    this.random = this.getRandomArbitrary(this.blackcards.length - 1, 0);
    this.question = this.blackcards[this.random].question;
    this.blackcards.splice(this.random, 1);
    this.selectedBlackCard = this.blackcards[this.random].id;

    // console.log("dealt black card ",this.dealtBlackcards );
    // console.log("black cards: ", this.blackcards);
};

this.dealWhite= function (){
  for (var i = 0 ; i < 4; i ++ ){
    this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
    this.answers.push(this.whitecards[this.random]);
    this.whitecards.splice(this.whitecards[this.random], 1);
  }
    // this.computerRandom = this.getRandomArbitrary(this.whitecards.length - 1, 0);
    // this.computerAnswers.push(this.whitecards[this.computerRandom].answer);
    //
};

this.computerTurn = function () {
  console.log('computer turn ');
  this.computerRandom = this.getRandomArbitrary(this.whitecards.length - 1, 0);
  this.computerAnswer = this.whitecards[this.computerRandom];
  this.selectedWhiteCard2 = this.computerAnswer.id;

    $http({
       method: 'GET',
         url: domainurl2 + '/blackcards/' + this.selectedBlackCard
    }).then(function(result){
      //  console.log(result);
       this.scores = result.data.scores;
      // console.log("score ", this.scores);
       for (var i = 0; i < this.scores.length; i ++){
        //  console.log('in the for loop');
         if (this.selectedWhiteCard1 == this.scores[i].whitecard_id ){
             this.score = this.scores[i].score;
            //  console.log("score: ", this.score);
         }
         if (this.selectedWhiteCard2 == this.scores[i].whitecard_id ){
             this.score2 = this.scores[i].score;
            //  console.log("score2: ", this.score2);
         }
       }
    if(this.score  > this.score2){
      // console.log("player is a winner ");
      this.playerScore +=  this.score;
    }
    else  {
      //  console.log("computer is a winner ");
       this.computerScore += this.score2;
    }
    if (this.gameCount > 9 ){
          this.gameIsOver = true;

    }else {
        this.gameCount += 1;
        this.isSelected = false;
        this.blackcards.splice(this.selectedBlackCard - 1, 1);
        this.nextRound()

    }

    }.bind(this));

  // console.log(this.selectedWhiteCard1);
  // console.log(this.selectedWhiteCard2);
  // console.log("black card: " , this.selectedBlackCard);
}
//============================
this.nextRound = function (){
  this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
  this.answers.push(this.whitecards[this.random]);
  console.log("Next Round - answer ", this.answer);
  this.dealBlack();

  console.log( "game count: " , this.gameCount);
}

//============================
this.playAgain = function (){
  this.whitecards = [];
  this.blackcards = [];
  this.answers    = [];
  this.isSelected = false;
  this.computerAnswer = '';
  this.selectedBlackCard = {};
  this.selectedWhiteCard1 = {};
  this.selectedWhiteCard2 = {};
  this.playerScore = 0;
  this.computerScore = 0;
  this.gameCount = 0 ;
  this.gameIsOver = false;
}


//============================
this.getRandomArbitrary = function (min, max) {
 return Math.floor(Math.random() * (max - min)) + min;
};
//============================
 this.selectCard = function(answer){
  //  console.log("answer: ", answer);
 this.selectedAnswer = answer.answer;
 this.selectedWhiteCard1 = answer.id;
 this.isSelected = true;
 this.whitecards.splice(this.selectedWhiteCard1 - 1, 1);
 // console.log("white card: ", this.whitecards);
 this.answers.splice(this.selectedWhiteCard1 - 1, 1);
 console.log("answer: ", this.answers);


}

//============================
this.timeOut = function(){
  console.log("white cards " , this.whitecards );
  (this.computerTurn(), 5000);
 $timeout(this.computerTurn, 5000);
}


}]); // end of controler
