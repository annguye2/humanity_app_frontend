// console.clear();
// this is updating for Biren
// var app_domain = "http://localhost:8000/";
// var api_domain = "http://localhost:3000/";
var api_domain = 'https://humanity-app-api-1.herokuapp.com/';//'https://humanity-app-api.herokuapp.com/';
var app_domain = 'https://humanity-app-frontend.herokuapp.com/'
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

  this.gameIsOver = localStorage.getItem('gameIsOver');
  this.player = {};
  this.isRegistered = true;
  this.isLoggedIn = true;
  // this.showLoginError = false;
  this.logInMessage = 'Invalid Login Attempt, please try again.'

  //this.domainurl1 = "http://localhost:3000";
  //this.url1 = "http://localhost:8000/";


this.resetLoginMsg = function(){
  this.isLoggedIn  = true;
}
  //=============================
  //-------User Login User-------
  //=============================
  this.loginUser = function(userPass) {

      if (!userPass) {
        console.log("missing all filds", this.isLoggedIn);
        this.isLoggedIn = !this.isLoggedIn;
      }
      else{
        if ((userPass.username == '' || userPass.username == undefined)
        || (userPass.password == '' || userPass.password == undefined )){
           console.log('missing field(s)');
           this.isLoggedIn = false;
        }
        else{
             console.log('Checking Player' , userPass.password);

             if ((userPass.username != '' || userPass.username != undefined)
             && (userPass.password != '' || userPass.password != undefined )){
                console.log('EVerything is looking good, checking user ');
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
                    localStorage.setItem('high_score', this.player.high_score);
                    localStorage.setItem('playerId', this.player.id);
                    localStorage.setItem('playerName',this.player.name);
                    window.location.href = this.mainpage;
                    console.log(JSON.parse(localStorage.getItem('token')));
                    this.isLoggedIn = true;
                  }
                  else {
                  console.log("can't find player in the database!!!");
                  this.isLoggedIn = false;

                  }
                }.bind(this));
             }

        }
      }
  }; // end of login


  //=============================
  //-------User Get Players------
  //=============================
  this.getPlayers = function() {
  console.log('loading when game is over ');
    $http({ // Makes HTTP request to server
      method: 'GET',
      // url: this.domainurl1 + '/players/',
      url: api_domain + '/players',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      if(response.data.status == 401) {
        this.error = "Unauthorized";
      } else {
        this.players = response.data; //get all players
        console.log("get all players ", this.players);
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
  // this.updatePlayerName="";
  // this.updatePlayerPassword ="";
  // this.updatePlayerImg ="";
  // this.updatePlayerEmail = "";
  this.updateProfileError = "Invalid input for name/password";
  this.showErrorOnUpdate  = false;
  this.updateProfile = function(){
  this.currentPlayerId = localStorage.getItem('playerId');
  console.log(' this is current player profile ', this.playerProfile);
  if ((this.playerProfile.name == "" || this.playerProfile.name == undefined) ||
       (this.playerProfile.password == "" || this.playerProfile.password == undefined))
       {
         console.log(" invalid input ");
         this.showErrorOnUpdate = true;
       }
  else{
    console.log('alow to update ');
    $http({ // Makes HTTP request to server
      method: 'PUT',
      url: api_domain + '/players/' + this.currentPlayerId,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      },
       data: {
          name:      this.playerProfile.name,
          password:  this.playerProfile.password,
          high_score:this.playerProfile.high_score,
          email:     this.playerProfile.email,
          img:       this.playerProfile.img
       }
    }).then(function(response){
       console.log("user response", response);
       window.location.href="/app.html"
    })
  }


  }; //end of update profile

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

console.log("start the if ", localStorage.getItem('token'));
 if (localStorage.getItem('token') == null)
 {
   //console.log('check this each time app.html loads');
   window.location.href = "/";
 }



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
  this.currentPlayerName = localStorage.getItem('playerName');
  this.winnerPlayer = false;
  this.winnerComp = false;
  this.diplay = false;
  this.winner ='';
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

      // if (this.playerEachRoundScore > this.computerEachRoundScore ){
      //   console.log("Player is a winner ");
      //
      // }
      // else  {
      //   console.log("computer is a winner ");
      //
      //   this.winner = 'CAH Bot!'
      //   //this.display = true;
      // }
      if(this.gameCount == 10){
          this.highScore();
        if(this.playerScore > this.computerScore){
          console.log('the winner is Player ');
          this.winnerPlayer = true;
        }else{
          this.winner = 'CAH Bot!'
          this.winnerComp = true;
          console.log('the winner is computer ');
        }
      }
      if (this.gameCount > 9 ){
        console.log( " when the game is not equal to 10");
        this.gameIsOver = true;
        localStorage.setItem('gameIsOver', this.gameIsOver);
        // this.highScore();
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
     var lastScore = localStorage.getItem('high_score');
     console.log("last score : ", lastScore );
     if(lastScore < this.playerScore)  {
       console.log('log: update the high_score');
       console.log( "high score setting ", this.playerScore);
       this.currentPlayerId = localStorage.getItem('playerId');
       console.log("localStorage.getItem('playerid'):  ", localStorage.getItem('playerId'));
       $http({ // Makes HTTP request to server
         method: 'PUT',
         url: api_domain + '/players/' + this.currentPlayerId,
         headers: {
           Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
         },
         data: {
           high_score: this.playerScore
         }
       }).then(function(response){
         console.log("user response", response);
       })
     }
     else{
       console.log("the current score isn't got update");
     }
   }// end of high_score

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

   //  console.log("white cards " , this.whitecards );
   //  (this.computerTurn(), 5000);
   //  $timeout(this.computerTurn, 5000);
//    $timeout(computerTurn(){
//
// }, 3000);

  }

  //=======================
  //---Cards Log out   ---
  //=======================
  this.logout = function(){
    console.log('logout from Card');
    localStorage.clear();
    window.location.href='/';
  };

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
