var gamePanel = document.getElementById('canvas');
var gamePanelColumns = gamePanel.width / 9;
var blockHeight = gamePanel.height / 16;
var context = gamePanel.getContext('2d');
var number = document.getElementById('score');
var enemies = [];
var opponents = [];
var step = 1000;
var score = 0;
var interval;
var stopGame;

var userCar = {
  points : {x:1, y:12}
}

var firstOpponentCar = {
  points : {x: 1, y: -3}
}

var secondOpponentCar = {
  points : {x: 7, y: -3}
}

var moveCarLeft = function() {
  userCar.points.x -= 3;
  if(userCar.points.x < 0){
    userCar.points.x += 3;
  }
  renderBoard();
}

var moveCarRight = function() {
  userCar.points.x += 3;
  if(userCar.points.x > 9){
    userCar.points.x -= 3;
  }
  renderBoard();
}

var moveOpponentCarDown = function(){
  let firstCar = firstOpponentCar.points;
  let secondCar = secondOpponentCar.points;
  firstCar.y += 1;
  secondCar.y += 1;
  if(firstCar.y > 15) {
    randomOpponentCarLine();
    firstCar.y = -3;
    secondCar.y = -3;
  }
  speed();
  renderBoard();
  getScore();
}

var renderBoard = function() {
  clearBoard();
  enemies.concat([userCar],[firstOpponentCar],[secondOpponentCar]).forEach(car => drawCar(car));
  opponents.concat([firstOpponentCar],[secondOpponentCar]).forEach(car => collision(car));
}

var clearBoard = function() {
  context.clearRect(0, 0, gamePanel.width, gamePanel.height);
}

var drawCar = function(car) {
  drawPoints(car.points);
}

var drawPoints = function(points) {
  let dots = [points,
    {x: points.x, y: points.y + 1},
    {x: points.x - 1, y: points.y + 1},
    {x: points.x + 1, y: points.y + 1},
    {x: points.x, y: points.y + 2},
    {x: points.x - 1, y: points.y + 3},
    {x: points.x + 1, y: points.y + 3}
  ];
  dots.forEach(point => drawPoint(point));
}

var drawPoint = function(point) {
  context.fillRect(gamePanelColumns * point.x, blockHeight * point.y, gamePanelColumns, blockHeight);
}

document.addEventListener('keydown', event => {
  if(stopGame){
    return false;
  }
  switch(event.keyCode){
    case 37:       //left arrow
    moveCarLeft();
    break;
    case 39:        //right arrow
    moveCarRight();
    break;
    case 40:        //down arrow
    moveOpponentCarDown();
    break;
  }
});

var randomOpponentCarLine = function() {
  var carOne = Math.floor((Math.random() * 10) % 3);
  var carTwo = Math.floor((Math.random() * 10) % 3);
  firstOpponentCar.points.x = 1 + (3 * carOne);
  secondOpponentCar.points.x = 1 + (3 * carTwo);
}

var start = function() {
  speed();
  stopGame = false;
  step = 1000;
  score = 0;
  clearBoard();
  firstOpponentCar = {
    points : {x: 1, y: -3}
  }

  secondOpponentCar = {
    points : {x: 7, y: -3}
  }
}

var speed = function(stopGame) {
    clearInterval(interval);
    var step = getStep();
    interval = setInterval(moveOpponentCarDown, step);
    if(stopGame){
      clearInterval(interval);
    }
}

var getStep = function() {
    step = step - 3;
    if (step <= 40)
    {
      return 40;
    }
    return step;
}

var collision = function(car) {
    var left = car.points.x - 1;
    var right = car.points.x + 1;
    var bottom = car.points.y + 3;

    if((left >= userCar.points.x - 1 && bottom >= userCar.points.y) && (right <= userCar.points.x + 1 && bottom >= userCar.points.y)){
      gameOwer();
    }
}

var gameOwer = function() {
    stopGame = true;
    speed(stopGame);
}

var getScore = function() {
    score +=1;
    number.innerHTML = score;
}
