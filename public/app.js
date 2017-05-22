// console.clear();
// this is updating for Biren
var app_domain = "http://localhost:8000/";
var api_domain = "http://localhost:3000/"; //'https://humanity-app-api.herokuapp.com/';
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
  this.mainpage = "/app.html";
  //=============================
  //----User Initializing Var----
  //=============================
  this.player = {};
  this.isRegistered = true;
  this.isLoggedIn = false;
  //this.domainurl1 = "http://localhost:3000";
  //this.url1 = "http://localhost:8000/";
  //=============================
  //-------User Login User-------
  //=============================
  this.loginUser = function(userPass) {
    console.log("ksyfkhsdfhfkdh", userPass);
      // this.isLoggedIn = false;
      // console.log("ksyfkhsdfhfkdh", userPass.userPass);
      // if  {
      //   console.log("can't find user");
      // }
      // else{
        if ((userPass  == undefined) && (userPass.username == '') || (userPass.password == ''))
        {
          // window.location.href = app_domain;
          this.logInMessage = 'Invalid Login Attempt, please try again.'
          this.isLoggedIn=false;
          console.log("wrongggggg");
        }
        else{
              $http({ // Makes HTTP request to server
                method: 'POST',
                // url: this.domainurl1 + '/players/login',
                url: api_domain + 'players/login',
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
                  // window.location.href = app_domain;
                this.isLoggedIn = false;
                  this.logInMessage = 'Invalid Login Attempt, please try again.'
                }
              }.bind(this));
        }
   }; // end of login
  //=============================
  //-------User Get Players------
  //=============================
  this.getPlayers = function() {
    $http({ // Makes HTTP request to server
      method: 'GET',
      // url: this.domainurl1 + '/players/',
      url: api_domain + '/players/',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      if(response.data.status == 401) {
        this.error = "Unauthorized";
      } else {
        this.players = response.data;
      }
    }.bind(this));
  };
  //=============================
  //---------User Logout---------
  //=============================
  this.logout = function(){
     console.log('logout');
    //$localStorage.$reset();
    window.location.href='/';
  };
  //=============================
  //-------User Create User------
  //=============================
  this.createUserMessage = "";
  this.registerErrorMsg = "missing required field(s)"
  //this.indexHtml = "http://localhost:8000";
  this.username = "";
  this.password = "";
  this.email = "";
  this.img = "";
  this.name = "";
  this.createUser = function(){
    //console.log('create new player');
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
      // url: this.domainurl1 + '/players',
      url: api_domain + '/players',
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
        window.location.href = app_domain; //"http://localhost:8000";
      }
      // }else //Can we do validation?
      // {
      //
      //    this.createUserMessage = "Registration Incomplete";
      // }
    })
  }; // end of creat User
  //=============================
  //-------User Update User------
  //=============================
//=============================
//-------User Get a Player  information for update------
//=============================
this.playerProfile ="";
this.loadProfile = function() {
  console.log('get currrent player info');
  $http({ // Makes HTTP request to server
    method: 'GET',
    url: api_domain + 'players/' + localStorage.getItem('playerId'),
    headers: {
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    }
  }).then(function(response) {
    if(response.data.status == 401) {
      this.error = "Unauthorized";
    } else {
      this.playerProfile = response.data;
      console.log("current Player info: ", this.playerProfile);
    }
  }.bind(this));
};
//=============================
//-------User Update User------
//=============================
//update variables
  this.updatePlayerName="";
  this.updatePlayerPassword ="";
  this.updatePlayerImg ="";
  this.updatePlayerEmail = "";
  this.updateProfile = function(){
  this.currentPlayerId = localStorage.getItem('playerId');
    $http({ // Makes HTTP request to server
      method: 'PUT',
     //  url: domainurl2+ '/players/' + this.currentPlayerId,
      url: api_domain + '/players/' + this.currentPlayerId,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      },
       data: {
        //  name:      this.updatePlayerName,  //update name
        //  password:  this.updatePlayerPassword,//testing
          high_score:       this.playerProfile.high_score,
        //  email:     this.updatePlayerEmail
       }
    }).then(function(response){
       console.log("user response", response);
       window.location.href="/app.html"
    })
  }
    //=============================
    //-------User Delete User------
    //=============================
  this.deletePlayer = function(){
    this.currentPlayerId = localStorage.getItem('playerId');
    console.log("localStorage.getItem('playerid'):  ", localStorage.getItem('playerId'));
    $http({ // Makes HTTP request to server
      method: 'DELETE',
     //  url: domainurl2+ '/players/' + this.currentPlayerId,
      url: api_domain + '/players/' + this.currentPlayerId,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       },
    }).then(function(response){
       console.log("user response", response);
      localStorage.clear();
       window.location.href = '/'
    })
  }
this.cancelUpdate = function(){
window.location.href = '/app.html';
}
}]); // end of User Controller
//========================
//---Cards Controller---
//========================
app.controller('CardsController', ['$http', '$scope', function($http, $scope,sharedProperties ,$timeout){
   //============================
   //---Cards Initializing Var---
   //============================
  // var domainurl2 = "http://localhost:3000";
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
  this.isDealtBlack = false;
  this.isDealtWhite = false;
  this.timer = 0;
  //===============================
  //---Cards Get All Black Cards---
  //===============================
  $http({
    method: 'GET',
    url: api_domain + '/blackcards'
    // url: domainurl2 + '/blackcards'
  }).then(function(result){
    this.blackcards = result.data;
  }.bind(this));
  //===============================
  //--- Card Get All White Cards---
  //===============================
  $http({
    method: 'GET',
    // url: domainurl2 + '/whitecards'
    url: api_domain + '/whitecards'
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
    this.isDealtBlack = true;
    //console.log(this.isDealtBlack);
  };
  //==============================
  //----Cards Deal White Cards----
  //==============================
  this.dealWhite= function (){
    this.showAnswers = true;
    //console.log('these whitecards :', this.whitecards);
    if (this.dealtWhitecards.length != 4){  //this prevent the dealtWhitecards pass 4 cards each time this function got called
      for (var i = 0 ; i < 4; i ++ ){
        this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
        this.dealtWhitecards.push(this.whitecards[this.random]);
        this.whitecards.splice(this.random, 1);
        //console.log('loop run???  :' , this.dealtWhitecards);
     }
    }
    this.showAnswers = true;
    this.isDealtWhite =true;
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
      // url: domainurl2 + '/blackcards/' + this.dealtBlackcard.id //query black card by black card ID
      url: api_domain + '/blackcards/' + this.dealtBlackcard.id //query black card by black card ID
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
