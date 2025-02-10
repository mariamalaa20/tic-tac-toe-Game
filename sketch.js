let wid ;// width of a single cell==(width/3)
let  heigh;// height of a single cell==(height-100/3)
let player1 = 'O';
let player2 = 'X';
let currentPlayer;//to keep track of the current player
let player1Score = 0;//to keep track of the score
let player2Score = 0;//to keep track of the score
let currentTurn = 1;//to keep track of the number of the turn
let trail = [];//An array stores information about the mouse's location over time(tracks the user's mouse movement) 

// Initializes a 3x3 array with empty cells
let gameFloor = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' ']
];

//declaration of the audio tracks
let song1;
let song2;
let song3;

let winnerPosition = [];//initializing an empty array to store the winner position
let winnerBoolean = false; //initializing a boolean variable to check if there is winner

// Start the game
function setup() {
  
  createCanvas(600, 700); //giving extra space for the canvas's height for the score table
  
  wid = width / 3;//Assigning the calculated cell width  height based on canvas dimensions
  heigh = (height - 100) / 3; //Assigns the calculated cell height
  
  //lines prompt the user to enter names for Player 1 and Player 2 
  //If no name is entered, it defaults to "Player 1" and "Player 2"
  playera = prompt("Enter Player 1's name : ") || 'Player 1';
  playerb = prompt("Enter Player 2's name : ") || 'Player 2';
  //loading the sound files
  song1 = loadSound('assets/Süper Mario Zıplama Ses Efekti.mp3');
  song2 = loadSound('assets/claps.mp3');
  song3 = loadSound('assets/pop-up-something.mp3');

// Randomly select the first player for the initial game every player have the same probability in starting the game
  currentPlayer =(random() <0.5 ) ? player1 : player2;
}

// Checks if a, b and c are the same and not an empty spaces
function winningLine(cell1, cell2, cell3) {
 return cell1 == cell2 && cell2 == cell3 && cell1 != ' ';
}

// Check if there is a winning line or a tie situation
function checkWinner() {
  //Initializing(null) a variable winner to store the winning player's symbol
  let winner = null;
  
  // Horizontal checks(x axis)
  for (let i = 0; i < 3; i++) {
    
    //check after calling the winningLine function ,gameFloor[rowIndex][columnIndex]
    if (winningLine(gameFloor[i][0], gameFloor[i][1], gameFloor[i][2])) {
      
    //sets 'winner' to the symbol (x or o)at the first cell of the current row
    winner = gameFloor[i][0];
      
    //1 stands for drawing horizontal line & i for the current row,for tracking the winner position 
    winnerPosition = [1, i];
      
    winnerBoolean = true;//there is winner
    }
  }

  // Vertical checks(y axis)
  for (let i = 0; i < 3; i++) {
    
    if (winningLine(gameFloor[0][i], gameFloor[1][i], gameFloor[2][i])) {
      
      winner = gameFloor[0][i];
      
      winnerPosition = [2, i];//2 stands for drawing vertical line 
      
      winnerBoolean = true;
    }
  }

  // Diagonal(top-left to the bottom-right)
  if (winningLine(gameFloor[0][0], gameFloor[1][1], gameFloor[2][2])) {
    
    winner = gameFloor[0][0];
    
    winnerPosition = [3, 0];//3 stands for diagonal  line
    
    winnerBoolean = true;
  }
  
  // Diagonal(top-left to the bottom-right)
  if (winningLine(gameFloor[2][0], gameFloor[1][1], gameFloor[0][2])) {
    
    winner = gameFloor[2][0];
    
    winnerPosition = [4, 0];//3 stands for diagonal line
    
    winnerBoolean = true;
  }
  
  // Check if we have any open cells on the grid
  let emptyCells = 0;//Initializing an emptyCells variable to 0
  
  //2 for Loops through the gameFloor to count empty cells
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (gameFloor[i][j] == ' ') {
        emptyCells++;
      }
    }
  }

  // Determine if the game is over
  //check TIE sitiuation 
  if (winner == null && emptyCells == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

// Handle mouse clicks
function mousePressed() {
  //taking the coordinates of the cell by mouseX and mouseY
  //floor calculates the closest integer value that is less than or equal to the value of a number.
  
  let i = floor((mouseY - 100) / heigh);//i is used as the row index.
  
  let j = floor(mouseX / wid); //j is used as the column index.
  
  // Only allow clicks when it's the player's turn
  if (currentPlayer == player1 || currentPlayer == player2) {
    
    // check if the cell is empty 
    if (gameFloor[i][j] == ' ') {
      
        //places the current player's symbol into the cell 
        gameFloor[i][j] = currentPlayer;
      
        song3.play();//play song 3 in every mouse click
      
       //to switch between player1 and player2 
       //check who is the currentPlayer and switch him
        currentPlayer = (currentPlayer == player1) ? player2 : player1;
      
      // Check for winner after each move
      let result = checkWinner();
      if (result != null) {
        if (result == 'tie') {
          console.log('Tie!');
          song1.play();
          player1Score++;
          player2Score++; 
        }
        
        else {
          console.log(result + ' wins!');
          
          //we used these parameters inorder to play just 1sec from song2
          //play(startTime,rate,amplitude,cueStart,duration)
          song2.play(0, 1, 1, 1, song2.duration() / 4);
          
          if (result == player1) {
            player1Score += 3;
          } 
          else if (result == player2) {
            player2Score += 3;
          }
        }
        //setTimeout is built in function in js executing resetGame function after 1000 milliseconds delayment
        // Wait for 1 second before resetting the game 
        setTimeout(resetGame, 1000); 
      }
    }
  }
}

// Reset the game
function resetGame() {
  
  gameFloor = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ];
  currentTurn++;
  winnerBoolean = false;//intializing winnerBoolean agin to false to start new game
  
}

function drawWinnerLine() {
  
  push();
  stroke(0);
  strokeWeight(10);
  
  if (winnerBoolean) { //checks if there is winner
    
    // if the first index=1 draw horizontal line
    if (winnerPosition[0] == 1) {  
    let y = (winnerPosition[1] + 0.5) * heigh + 100; // Middle of the row
    line(25, y, width - 25, y);
    } 
    
      // if the first index=2 draw vertical line
      else if (winnerPosition[0] == 2) {
      let x = (winnerPosition[1] + 0.5) * wid; // Middle of the column
      line(x, 125, x, height - 25);
    } 
    
    // if the first index=3 draw diagonal from top-left to bottom-right
      else if (winnerPosition[0] == 3) {
      line(50, 150, width - 50, height - 50);
    } 
    
    //  if the first index=4 draw diagonal from top-right to bottom-left
      else if (winnerPosition[0] == 4) {
      line(width - 50, 150, 50, height - 50);
    }
  }
  pop();
}

function displayWinner() {
  let result = checkWinner(); // Get the game result
  
  if (result != null) {
    textAlign(CENTER, CENTER);
    textSize(100);
    noStroke();
    fill(0);
    
      if (result == 'tie') {
      text("Tie Game!", width / 2, height / 2); //print "Tie Game!"
      } else { 
      text(result + " Wins!", width / 2, height / 2); // o Wins || x Wins
    }
  }
}

// Draw the gameFloor
function draw() {
  
  background(255);
  strokeWeight(4);
  
  //mouseX and mouseY coordinates are captured
  trail.push(createVector(mouseX,mouseY));//push line adds this vector object containing the mouse's x and y coordinates to the trail array
  
//An if statement checks if the trail array length is greater than 12
  if (trail.length > 12){//if statement checks if the trail array length > 12
    
      trail.shift();//If the length exceeds 12, shift() method removes the oldest element (the first position) from the array
    // This keeps the trail array from getting too long and affecting performance
  }
  
  for (let i=0; i<trail.length; i++){
  const curr =trail[i];//assigns the current element (vector object) to the variable curr
    stroke(255, 105, 180);// Set stroke color (pink)
    fill(255, 105, 180);// Set fill color (pink)
    circle(curr.x, curr.y, i/2); // Draw circle at current position with size i/2 ,the circles gets smaller  
  
  noStroke();
  fill(0);
  rect(0, 0, width, 100); // Score table background
  textAlign(CENTER, CENTER);
  
  textSize(18);
  fill(255);
  text("Score Table", width / 2, 25);
  
  
  fill(255, 105, 180);
  textSize(26);
  text(playera + " : " + player1Score, 35 + width / 8, 65);
  
  textSize(26);
  fill(153, 153, 255);
  text(playerb + " : " + player2Score, 45 + 6 * width / 8, 65);
 
  textSize(18);
  fill(255);
  text("Current Player: " + (currentPlayer === player1 ? playera : playerb), 300, 80);
    
  // print the number of the current turn
  fill(255);
  text("Turn: " + currentTurn, 300, 55);
    
  // Draw the gameFloor
  stroke(0);
  line(wid, 100, wid, height);
  line(wid * 2, 100, wid * 2, height);
  line(0, heigh + 100, width, heigh + 100);
  line(0, heigh * 2 + 100, width, heigh * 2 + 100);
  line(0, 0, 0, height);
  line(0, height, width, height);
  line(width, height, width, 0);
    
//drawing x and o symbols
  for (let i = 0; i < 3; i++) {
   for (let j = 0; j < 3; j++){
     
        let y = heigh * i + heigh / 2 + 100;//centering the y in the cell vertically
     
          let x = wid * j + wid / 2;//centering the y in the cell horizontally
     
          let cell = gameFloor[i][j];
      
          strokeWeight(10);
          textSize(32);
          let rad = wid / 4;//rad==radius
          if (cell == player1) {
          push();
          stroke(255, 153, 204);
          ellipse(x, y, rad * 2);//(rad*2==diameter)
          pop();
          } 
          else if (cell == player2) {
          push();
          stroke(153, 153, 255);
          line(x - rad, y - rad, x + rad, y + rad);
          line(x + rad, y - rad, x - rad, y + rad);
          pop();
      }
    }
  }
  drawWinnerLine();
  displayWinner();
}
}
