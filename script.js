// Define HTML element 
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables 
const gridSize = 20;
let snake = [{ x: 10, y: 10 }] // snake is an array and there is only one element inside the array which is an object
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeeDelay = 200;
let gameStarted = false;

// Draw game Map, snake and food 
function draw(){
board.innerHTML = '';
drawSnake();
drawFood();
updateScore();
}

// Draw snake 
function drawSnake(){
snake.forEach((element) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, element);
    board.appendChild(snakeElement);
});
}

// Create a snake or food cube/div
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of snake or food 
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Testing draw function 
// draw();

// Draw food function 
function drawFood(){
    if(gameStarted){
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}
}

// Generate Food 
function generateFood(){
const x = Math.floor(Math.random() * gridSize) + 1;
const y = Math.floor(Math.random() * gridSize) + 1;
return { x, y };
}

// Moving the snake 
function move(){
     const head = { ...snake[0] }; //This is will make a copy of object which is at index 0 inside the snake array
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'right':
            head.x++;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
    
        
    }
     snake.unshift(head); //This will push the head object that we created inside the snake array with the new modified values of x and y 
     
     if(head.x === food.x && head.y === food.y){
         food = generateFood();
         increaseSpeed();
         clearInterval(gameInterval); // Clear past interval
         gameInterval = setInterval(() => {
             move();
             checkCollision();
             draw();
            }, gameSpeeDelay);
        }
        else{
            snake.pop(); //This will remove the last element of array which is the previous object which was at the beginning of game with positions x: 10, y:10 
            
      }
}
// // Test moving 
// setInterval(() => {
//      move(); // Move first
//      draw(); // Then draw gain new position
// }, 200);

// Start game function 
function startGame(){
 gameStarted = true; // Keep track of a running game 
 instructionText.style.display = 'none';
 logo.style.display = 'none';
 gameInterval = setInterval(() =>{
    move();
    checkCollision();
    draw();
 }, gameSpeeDelay);
}

// Keypress event listner
function handleKeyPress(event) {
    if( (!gameStarted && event.code === 'Space') || (!gameStarted && event.code === '')){
        startGame();
    }else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    // console.log(gameSpeeDelay);
    if(gameSpeeDelay > 150){
    gameSpeeDelay -= 5;
}
else if (gameSpeeDelay > 100 ){
   gameSpeeDelay -= 3;
}
else if (gameSpeeDelay > 50 ){
   gameSpeeDelay -= 2;
}
else if (gameSpeeDelay > 25 ){
   gameSpeeDelay -= 1;
}
}

function checkCollision() {
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize ){
        resetGame();
    }

    for(let i=1; i<snake.length; i++){
        if( head.x === snake[i].x && head.y === snake[i].y ){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeeDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length-1;
    score.textContent = currentScore.toString().padStart(2, '0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length-1;
    if(currentScore > highScore){
    highScore = currentScore;
highScoreText.textContent = highScore.toString().padStart(3, '0');
}
highScoreText.style.display = 'block';
}
