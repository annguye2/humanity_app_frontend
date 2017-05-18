console.clear();

//$(funtion(){
///   console.log('Jquery Loaded');

   // Get the modal
// var modal = document.getElementById('myModal');
//
// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");
//
// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];
//
// // When the user clicks on the button, open the modal
// btn.onclick = function() {
//     modal.style.display = "block";
// };
//
// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// };
//
// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

//});

var app = angular.module('CAHApp', []);

app.controller('CardsController', ['$http', function($http){

  this.whitecards =[];
  this.blackcards = [];
  this.answers    = [];
  //  GET ALL WHITE CARDS

  $http({
     method: 'GET',
     url: 'http://localhost:3000/blackcards'
  }).then(function(result){
     this.blackcards = result.data;
    //  console.log(this.blackcards);
  }.bind(this));

  $http({
     method: 'GET',
     url: 'http://localhost:3000/whitecards'
  }).then(function(result){
     this.whitecards = result.data;
    //  console.log(this.whitecards);
  }.bind(this));




this.dealBlack = function (){
    this.random = this.getRandomArbitrary(this.blackcards.length - 1, 0);
    this.question = this.blackcards[this.random].question;
    this.blackcards.splice(this.random, 1);
    // console.log("dealt black card ",this.dealtBlackcards );
    // console.log("black cards: ", this.blackcards);
}

this.dealWhite= function (){
  for (var i = 0 ; i < 4; i ++ ){
    this.random = this.getRandomArbitrary(this.whitecards.length - 1, 0);
    this.answers.push(this.whitecards[this.random].answer);
  }
  console.log('answers: ', this.answers);

}


this.getRandomArbitrary = function (min, max) {
 return Math.floor(Math.random() * (max - min)) + min;
}


}]);

// app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
//    $locationProvider.html5Mode({enabled:true});
//    $routeProvider.when('/url1', { //route would come from controller file with routes
//       template: '<h2>This is the the URL1 Section</h2>',
//       controller: function(){
//          this.foo = 'bar';
//       },
//       controllerAs: 'main'
//    });
// }]);
