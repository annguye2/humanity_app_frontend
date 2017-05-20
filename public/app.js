console.clear();

var app = angular.module('CAHApp', []);
app.service('sharedProperties', function () {
        var playerId = "";
        this.playerId = playerId;

    });
app.controller('UsersController', ['$http', '$scope', function($http, $scope, sharedProperties){
  this.player = {};

  //console.log("username: ", this.name);
  this.domainurl1 = "http://localhost:3000";
  this.loginUser = function(userPass) {

    //console.log(userPass);
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
      //console.log(response.data);
      // controller.user = response.data;
      // controller.logInUsername = controller.logInPassword = "";
      if(response.data.token){
        //console.log( "login success: ");
        this.player=response.data.player;



        //console.log("player :", this.player);
        //console.log('token ' ,response.data.token);
        localStorage.setItem('token', JSON.stringify(response.data.token));
        localStorage.setItem('playerId', this.player.id);

        var mainpage = "http://localhost:8000/app.html";
        window.location.href = mainpage;

        //console.log('currrent player: ', player);
        //  console.log(response);
        console.log(JSON.parse(localStorage.getItem('token')));
      }
      else{
        //console.log("failed to login ");
      }

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


app.controller('CardsController', ['$http', '$scope', function($http, $scope,sharedProperties ,$timeout){



  var domainurl2 = "http://localhost:3000";
  this.whitecards = [];   // get all white cards
  this.blackcards = [];   // get all black cards
  //this.answers    = [];
  this.isSelected = false;
  this.computerAnswer = '';
  this.selectedBlackCard = {};
  //this.selectedWhiteCard1 = {};
  //this.selectedWhiteCard2 = {};
  this.playerScore = 0;
  this.computerScore = 0;
  this.gameCount = 0 ;
  this.gameIsOver = false;
  //  GET ALL WHITE CARDS

  //An Nguyen added
  this.dealtBlackcard;   // dealt black cards
  this.dealtWhitecards = [];   // dealt whitecards
  this.playerSelectedWhiteCard;
  this.showAnswers = false;
  //  end

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
    //this.random = this.getRandomArbitrary(this.blackcards.length - 1, 0);
    //this.question = this.blackcards[this.random].question;
    //this.blackcards.splice(this.random, 1);
    //this.selectedBlackCard = this.blackcards[this.random].id;
    //An added
    this.random = this.getRandomArbitrary(this.blackcards.length - 1, 0);
    this.dealtBlackcard  = this.blackcards[this.random];
    this.blackcards.splice(this.random, 1);
    //console.log("dealt black card ",this.dealtBlackcard );
    // end
  };

  this.dealWhite= function (){
    for (var i = 0 ; i < 4; i ++ ){
      //this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
      //this.answers.push(this.whitecards[this.random]);
      //this.whitecards.splice(this.whitecards[this.random], 1);  // An commented out : splice by position not by object
      // do we need to remove white card here or have to wait when the card selected?

      //An added : get dealt whitecards total is 4 cards
      console.log("this initial dealtWhitecards ", this.dealtWhitecards);
      this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
      this.dealtWhitecards.push(this.whitecards[this.random]);
      this.whitecards.splice(this.random, 1) // wait for the answer of question above
      //this.answers.push(this.whitecards[this.random]);

      // end
    }
    // check dealt white cards WORKED
     //console.log(" dealt white cards, ", this.dealtWhitecards);
     //console.log("white cards left ", this.whitecards);
  };

  this.computerTurn = function () {
    //console.log(" computerTurn is starting");
    this.computerEachRoundScore = 0;      //each round score for computer
    this.playerEachRoundScore = 0 ;       //each round score for player
    this.computerRandom = this.getRandomArbitrary(this.whitecards.length - 1, 0);
    this.computerAnswer = this.whitecards[this.computerRandom];  //get computer answer object
    //console.log("computer answer : ", this.computerAnswer);

    $http({
      method: 'GET',
      url: domainurl2 + '/blackcards/' + this.dealtBlackcard.id //query black card by black card ID
    }).then(function(result){
       //console.log("computer turn result  ", result);
      this.scores = result.data.scores;
      // console.log("score ", this.scores);
      for (var i = 0; i < this.scores.length; i ++){
        //  console.log('in the for loop');
        if (this.playerSelectedWhiteCard.id == this.scores[i].whitecard_id ){  // get player Score on a round
          //this.score = this.scores[i].score;   // this can be removed
          // An  added : get player score locally
            this.playerEachRoundScore = this.scores[i].score;
            console.log("this.playerEachRoundScore: " ,this.playerEachRoundScore );
          //end
        }
        if (this.computerAnswer.id == this.scores[i].whitecard_id ){  // get computer score on a round
          //this.score2 = this.scores[i].score;  // this can be removed
           //An added: get computer score locally
           this.computerEachRoundScore = this.scores[i].score;
           console.log("this.computerEachRoundScore: ", this.computerEachRoundScore );
           //end
        }
      }
     //An added: get total computer and player score
     this.computerScore += this.computerEachRoundScore;
     this.playerScore += this.playerEachRoundScore;
     //End
      // if(this.score  > this.score2){
      //   // console.log("player is a winner ");
      //   this.playerScore +=  this.score;
      // }
      if (this.playerEachRoundScore > this.computerEachRoundScore ){
        console.log("Player is a winner ");

      }
      else  {
         console.log("computer is a winner ");
      }
      if (this.gameCount > 9 ){
        this.gameIsOver = true;
        // console.log("computer total scores: ", this.computerScore);
        // console.log("player total scores: ", this.playerScore);

         this.highScore();


        //window.location.reload(true);
      }else {
        this.gameCount += 1;
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
        this.nextRound();
      }

    }.bind(this));

  }

  //==========================
   this.highScore = function(){
     this.currentPlayerId = localStorage.getItem('playerId');
     console.log("localStorage.getItem('playerid'):  ", localStorage.getItem('playerId'));
     $http({ // Makes HTTP request to server
       method: 'PUT',
       url: domainurl2+ '/players/' + this.currentPlayerId,
       headers: {
         Authorization: 'Bearer' + JSON.parse(localStorage.getItem('token'))
       },
        data: {
          high_score: 10
        }
     }).then(function(response){
        console.log("user response", response);
     })
   }
  //============================
  this.nextRound = function (){
    // this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
    // this.answers.push(this.whitecards[this.random]);
    // console.log("Next Round - answer ", this.answer);
    // this.dealBlack();
    //

    // this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
    // this.dealtWhitecards.push(this.whitecards[this.random]);
    // this.whitecards.splice(this.random, 1) // wait for the answer of question abov
    this.isSelected = true;
    //console.log(' deal white again, check dealtWhitecards: ', this.dealtWhitecards );
    this.dealBlack();
    //console.log('deal black again check dealtBlackcard: ', this.dealtBlackcard);
    console.log( "game count: " , this.gameCount, "  next round");
  //  this.showAnswers = false; //testing
      this.isSelected = false;
  }

  //============================
  this.playAgain = function (){
    location.reload(true);
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
  }


  //============================
  this.getRandomArbitrary = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  //============================
  this.selectCard = function(selectedWhiteCard, index){  // and added index in

    //this.selectedAnswer = answer.answer;
    //this.selectedWhiteCard1 = answer.id;
    //this.isSelected = true;
    //this.whitecards.splice(this.selectedWhiteCard1 - 1, 1);  //why we have to splice again?
    // console.log("white card: ", this.whitecards);
    //this.answers.splice(this.selectedWhiteCard1 - 1, 1);
    // console.log("answer: ", this.answers);

     //An added
     console.log("show computer answer : ", this.showAnswers);
     //console.log("selected selectedWhiteCard: ", selectedWhiteCard);  //test selected card from html
      this.isSelected = true;
      this.showAnswers = true;                   //set isSelected to true
      this.playerSelectedWhiteCard = selectedWhiteCard;     // get selected white card info
      this.dealtWhitecards.splice(index, 1);           // remove selected white card from white dealt cards
      //console.log(" check this.playerSelectedWhiteCard", this.playerSelectedWhiteCard);  //worked
      this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
      this.dealtWhitecards.push(this.whitecards[this.random]);
      this.whitecards.splice(this.random, 1) // wait for the answer of question abov
     // end
  }

  //============================
  this.timeOut = function(){
    console.log("white cards " , this.whitecards );
    (this.computerTurn(), 5000);
    $timeout(this.computerTurn, 5000);
  }


}]); // end of controler
