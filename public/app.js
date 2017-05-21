// console.clear();
//========================
//-----Angular Module-----
//========================
var app = angular.module('CAHApp', []);

//========================
//---Service Controller---
//========================
app.service('sharedProperties', function () {
        var playerId = "";
        this.playerId = playerId;
});

//========================
//-----User Controller----
//========================
app.controller('UsersController', ['$http', '$scope', function($http, $scope, sharedProperties){
  //=============================
  //----User Initializing Var----
  //=============================
  this.player = {};
  this.isRegistered = true;
  this.isLoggedIn = false;
  this.domainurl1 = "http://localhost:3000";
  this.url1 = "http://localhost:8000/";


  //=============================
  //-------User Login User-------
  //=============================
  this.loginUser = function(userPass) {
     console.log(userPass);
    this.mainpage = "http://localhost:8000/app.html";
    if ((userPass == 'undefined') ||
        (userPass.username == null) ||
        (userPass.username == '') ||
        (userPass.username == 'undefined') ||
        (userPass.password == '') ||
        (userPass.password == 'undefined') ||
        (userPass.password == null)){
           window.location.href = this.url1;
           this.logInMessage = 'Invalid Login Attempt, please try again.'
           return;
    }

    $http({ // Makes HTTP request to server
      method: 'POST',
      // url: this.domainurl1 + '/players/login',
      url: this.domainurl1 + '/players/login',
      data: {
        player: { // Gets turned into req.body
          username: userPass.username,
          password: userPass.password
        }
      }
    }).then(function(response) {
      console.log(response);
      if(response.data.token){
        console.log("Logged in");
        this.player=response.data.player;
        localStorage.setItem('token', JSON.stringify(response.data.token));
        localStorage.setItem('playerId', this.player.id);
        window.location.href = this.mainpage;
        console.log(JSON.parse(localStorage.getItem('token')));
        this.isLoggedIn = true;
      }
      else if(response.data.token == 'undefined'){
        window.location.href = this.url1;
        this.logInMessage = 'Invalid Login Attempt, please try again.'
      }
    }.bind(this));
  };
  //=============================
  //-------User Get Players------
  //=============================
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
  //=============================
  //---------User Logout---------
  //=============================
  this.logout = function(){

     //clear session--check for logout function in routes
   //   $http({ // Makes HTTP request to server
   //    method: 'POST',
   //    url: this.domainurl1 + '/players',
   //    data: { // Gets turned into req.body
   //      name: this.name,
   //      img: this.img,
   //      password: this.password,
   //      email: this.email,
   //      high_score: 0
   //    }
    localStorage.clear('token');
    location.reload();
  };

  //=============================
  //-------User Create User------
  //=============================
  this.createUserMessage = "";
  this.registerErrorMsg = "missing required field(s)"
  this.indexHtml = "http://localhost:8000";
  this.username = "";
  this.password = "";
  this.email = "";
  this.img = "";
  this.name = "";

  this.createUser = function(){

 console.log('create new player');
 // console.log(this.username);
 // console.log(this.password);
 // console.log(this.name);
 // console.log(this.email);
 // console.log(this.img);
 // console.log(this.domainurl1);
   if((this.username == '') ||
      (this.username == 'undefined')||
      (this.name == '') ||
      (this.name == 'undefined') ||
      (this.password == '') ||
      (this.password == 'undefined')){
      this.isRegistered = false;
      this.createUserMessage = "Your registration is incomplete";
      return;
   }

    $http({ // Makes HTTP request to server
      method: 'POST',
      url: this.domainurl1 + '/players',
      data: { // Gets turned into req.body
        username: this.username,
        name: this.name,
        img: this.img,
        password: this.password,
        email: this.email,
        high_score: 0
      }
    }).then(function(response) {
      console.log(response);
      if(response.status == 201)
      {
         window.location.href = this.indexHtml; "http://localhost:8000";
      }
      // }else //Can we do validation?
      // {
      //
      //    this.createUserMessage = "Registration Incomplete";
      // }

  }; // end of creat User
}]); // end of User Controller

//========================
//---Cards Controller---
//========================

app.controller('CardsController', ['$http', '$scope', function($http, $scope,sharedProperties ,$timeout){
   //============================
   //---Cards Initializing Var---
   //============================
  var domainurl2 = "http://localhost:3000";
  this.whitecards = [];   // get all white cards
  this.blackcards = [];   // get all black cards
  this.isSelected = false;
  this.computerAnswer = '';
  this.selectedBlackCard = {};
  this.playerScore = 0;
  this.computerScore = 0;
  this.gameCount = 0 ;
  this.gameIsOver = false;
  this.dealtBlackcard;   // dealt black cards
  this.dealtWhitecards = [];   // dealt whitecards
  this.playerSelectedWhiteCard;
  this.showAnswers = false;
  this.showQuestion = false;
  this.cardPlayed = false;

  //===============================
  //---Cards Get All Black Cards---
  //===============================
  $http({
    method: 'GET',
    url: domainurl2 + '/blackcards'
  }).then(function(result){
    this.blackcards = result.data;
  }.bind(this));

  //===============================
  //--- Card Get All White Cards---
  //===============================
  $http({
    method: 'GET',
    url: domainurl2 + '/whitecards'
  }).then(function(result){
    this.whitecards = result.data;
  }.bind(this));

  //==============================
  //----Cards Deal Black Cards----
  //==============================
  this.dealBlack = function (){

    this.random = this.getRandomArbitrary(this.blackcards.length - 1, 0);
    this.dealtBlackcard  = this.blackcards[this.random];
    this.blackcards.splice(this.random, 1);
    this.showQuestion = true;
    //console.log(this.isDealtBlack);

  };
  //==============================
  //----Cards Deal White Cards----
  //==============================
  this.dealWhite= function (){
    for (var i = 0 ; i < 4; i ++ ){
      this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
      this.dealtWhitecards.push(this.whitecards[this.random]);
      this.whitecards.splice(this.random, 1);
      this.showAnswers = true;
   };
  };
  //=================================
  //---Cards Computer Turn to Play---
  //=================================
  this.computerTurn = function () {

    this.computerEachRoundScore = 0;      //each round score for computer
    this.playerEachRoundScore = 0 ;       //each round score for player
    this.computerRandom = this.getRandomArbitrary(this.whitecards.length - 1, 0);
    this.computerAnswer = this.whitecards[this.computerRandom];  //get computer answer object

    $http({
      method: 'GET',
      url: domainurl2 + '/blackcards/' + this.dealtBlackcard.id //query black card by black card ID
    }).then(function(result){

      this.scores = result.data.scores;
      for (var i = 0; i < this.scores.length; i ++){
      if (this.playerSelectedWhiteCard.id == this.scores[i].whitecard_id ){
      // get player Score on a round
      this.playerEachRoundScore = this.scores[i].score;
      console.log("this.playerEachRoundScore: " ,this.playerEachRoundScore );
      }
      if (this.computerAnswer.id == this.scores[i].whitecard_id ){  // get computer score on a round
      this.computerEachRoundScore = this.scores[i].score;
      }
      }
      if(this.playerEachRoundScore  > this.computerEachRoundScore){
      // console.log("player is a winner ");
      this.playerScore += this.playerEachRoundScore;
      }else{
         this.computerScore += this.computerEachRoundScore;
      }

      if (this.playerEachRoundScore > this.computerEachRoundScore ){
      console.log("Player is a winner ");
      }
      else  {
      console.log("computer is a winner ");
      }
      if (this.gameCount > 9 ){
      this.gameIsOver = true;
      this.highScore();
      }else {
      this.gameCount += 1;
      this.nextRound();
      }
    }.bind(this));
   }

  //========================
  //----Cards High Score----
  //========================
   this.highScore = function(){
     this.currentPlayerId = localStorage.getItem('playerId');
     console.log("localStorage.getItem('playerid'):  ", localStorage.getItem('playerId'));
     $http({ // Makes HTTP request to server
       method: 'PUT',
       url: domainurl2+ '/players/' + this.currentPlayerId,
       headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       },
        data: {
          high_score: 10
        }
     }).then(function(response){
        console.log("user response", response);
     })
   }

   //========================
   //---Cards Player Turns---
   //========================
   this.selectCard = function(selectedWhiteCard, index){

       this.isSelected = true;
       this.cardPlayed = true; //set isSelected to true
       this.playerSelectedWhiteCard = selectedWhiteCard; // get selected white card info
       this.dealtWhitecards.splice(index, 1); // remove selected white card from white dealt cards
       this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
       this.dealtWhitecards.push(this.whitecards[this.random]);
       this.whitecards.splice(this.random, 1)

   }

   //========================
   //----Cards Next Round----
   //========================
  this.nextRound = function (){

    this.isSelected = true;
    this.dealBlack();
    console.log( "game count: " , this.gameCount, "  next round");
    this.isSelected = false;
  }

  //========================
  //----Cards Play Again----
  //========================
  this.playAgain = function (){

    location.reload(true);

  }


  //=============================
  //---Cards Get Random Number---
  //=============================
  this.getRandomArbitrary = function (min, max) {

    return Math.floor(Math.random() * (max - min)) + min;

  };

  //=======================
  //---Cards Set Timeout---
  //=======================
  this.timeOut = function(){

    console.log("white cards " , this.whitecards );
    (this.computerTurn(), 5000);
    $timeout(this.computerTurn, 5000);

  }


}]); // end of controller

//=========================
//-----Grave Yard Code-----
//=========================
//console.log("username: ", this.name);
//console.log(userPass);
//console.log(response.data);
// controller.user = response.data;
// controller.logInUsername = controller.logInPassword = "";
//console.log( "login success: ");
//console.log("player :", this.player);
//console.log('token ' ,response.data.token);
//console.log('currrent player: ', player);
//  console.log(response);
// console.log("username: ", this.name);
// this.logInPassword = controller.newUserPassword;
// controller.newUserName = controller.newUserUsername = controller.newUserPassword = controller.newUserImage = "";
// controller.logIn();
//this.answers    = [];
//this.selectedWhiteCard1 = {};
//this.selectedWhiteCard2 = {};
//  console.log(this.blackcards);
//  console.log(this.whitecards);
//this.random = this.getRandomArbitrary(this.blackcards.length - 1, 0);
//this.question = this.blackcards[this.random].question;
//this.blackcards.splice(this.random, 1);
//this.selectedBlackCard = this.blackcards[this.random].id;
//console.log("dealt black card ",this.dealtBlackcard );
//this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
//this.answers.push(this.whitecards[this.random]);
//this.whitecards.splice(this.whitecards[this.random], 1);
//console.log("this initial dealtWhitecards ", this.dealtWhitecards);
//this.answers.push(this.whitecards[this.random]);
// check dealt white cards WORKED
//console.log(" dealt white cards, ", this.dealtWhitecards);
//console.log("white cards left ", this.whitecards);
//console.log(" computerTurn is starting");
//console.log("computer answer : ", this.computerAnswer);
//console.log("computer turn result  ", result);
// console.log("score ", this.scores);
//  console.log('in the for loop');
//this.score = this.scores[i].score;
//this.score2 = this.scores[i].score;
//console.log("this.computerEachRoundScore: ", this.computerEachRoundScore );
// console.log("computer total scores: ", this.computerScore);
// console.log("player total scores: ", this.playerScore);
//window.location.reload(true);
//  this.isSelected = false;
//this.blackcards.splice(this.dealtBlackcard.id - 1, 1); // remove selected black card from blackcard pool
//console.log('deal white cards remains: ', this.dealtWhitecards);
// this.whitecards.push(this.dealtWhitecards[0]);             // push back remain white cards to whitecard pool
// this.whitecards.push(this.dealtWhitecards[1]);
// this.whitecards.push(this.dealtWhitecards[2]);
//console.log("this dealt whitecare ,", this.dealtWhitecards);
//this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0)
//this.dealtWhitecards.push(this.whitecards[this.random]);
//console.log("this dealt whitecare after ,", this.dealtWhitecards);
//console.log( "blackcard pool remain: ", this.blackcards); //check black card pooll
//console.log( "whitecard pool remain: ", this.whitecards); //check white card pool
//this.dealtWhitecards = [];                                // reset dealtwhitecards
// this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
// this.answers.push(this.whitecards[this.random]);
// console.log("Next Round - answer ", this.answer);
// this.dealBlack();
//

// this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
// this.dealtWhitecards.push(this.whitecards[this.random]);
// this.whitecards.splice(this.random, 1);
//console.log(' deal white again, check dealtWhitecards: ', this.dealtWhitecards );
//console.log('deal black again check dealtBlackcard: ', this.dealtBlackcard);
//  this.showAnswers = false; //testing
//   this.whitecards = [];
//   this.blackcards = [];
//   //this.answers    = [];
//   this.isSelected = false;
//   this.computerAnswer = '';
//   //this.selectedBlackCard = {};
//   this.selectedWhiteCard1 = {};
// //  this.selectedWhiteCard2 = {};
//   this.playerScore = 0;
//   this.computerScore = 0;
//   this.gameCount = 0 ;
//   this.gameIsOver = false;
//this.selectedAnswer = answer.answer;
//this.selectedWhiteCard1 = answer.id;
//this.isSelected = true;
//this.whitecards.splice(this.selectedWhiteCard1 - 1, 1);  //why we have to splice again?
// console.log("white card: ", this.whitecards);
//this.answers.splice(this.selectedWhiteCard1 - 1, 1);
// console.log("answer: ", this.answers);
//console.log("show computer answer : ", this.showAnswers);
//console.log("selected selectedWhiteCard: ", selectedWhiteCard);  //test selected card from html
//console.log(" check this.playerSelectedWhiteCard", this.playerSelectedWhiteCard);  //worked
