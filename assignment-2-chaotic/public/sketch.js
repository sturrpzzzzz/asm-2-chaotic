//Reference: 
//Oscillating sphere: https://www.youtube.com/watch?v=atNUa7MdhYs&t=130s
//Pulse: https://editor.p5js.org/enickles/sketches/BJFD1cuRQ
//Matrix effect: https://www.youtube.com/watch?v=13Ip2brYPto
//Noise background: https://editor.p5js.org/andreiongd/sketches/Fit4bu_Z4

let r = 110; //Circle radius

let size = 110; //Starting size
let minSize = 100; //Minimum size
let maxSize = r; //Maximum size

let waves = []; 
let num = 22; //Amount of waves
let step = 60; //Changes the steps of the shift

let cells = []; //Array for the changing text
let drops = []; //Array for the dropping animation
let cellSize = 20; //Size of each cell. The bigger the number, the more sparse the cells are.
let numRows; //Number of rows.
let numCols; //Number of columns.

//Variable used in an equation so that every frame has a 2% chance for each letter to switch its symbol.
//I changed it to 0.05 because I wanted it to change a little faster. It was originally 0.02.
let symbolSwapProb = 0.05;

//Amount of frames before the drops move down one cell.
let dropTimeout = 6;

//Amount of frames between when each drop starts again and when it goes out of the screen, so that not all drops start dropping at once.
let maxOffscreen = 100;

//Amount of frames that each cell is going to have lighter colour for.
let brightTime = 70;

let textSpeed = 0.003; //Noise speed.
let chars = "%#!? %#!? %#!? %#!?";


function setup() {
  createCanvas(innerWidth, innerHeight);
  angleMode (DEGREES);
  textAlign(CENTER, CENTER);
  
  
  for (let j = 0; j < num; j+=2) {
    waves[j] = new Wave(j * step);
  }
  
  textFont("monospace");
  textSize(17);
  
  //Using ceil to get the extra row/column so it goes on the edge of the screen if necessary.
  numRows = ceil(innerHeight / cellSize);
  numCols = ceil(innerWidth / cellSize);
  
  //For each row, we are making a newRow array, filling each item in the array with a Cell with (x, y) co-ords of (k * cellSize, i * cellSize), so that for each pair of k and i values, we get a different cell position. 
  //I don't know if I explained it well LOL.
  for (let i = 0; i < numRows; i++) {
    let newRow = [];
    for (let k = 0; k < numCols; k++) {
      newRow.push(new Cell(k * cellSize, i * cellSize));
    }
    cells.push(newRow);
  }
  
  //Similarly, for each k value, a new Drop is created.
  for (let k = 0; k < numCols; k++) {
      drops.push(new Drop(k));
  }
}


function draw() {
  background(0);
  
  //Make (0,0) the middle of the canvas
  translate (width/2, height/2);
  
  push();
  translate(-width/2,-height/2);
  colorMode(HSB);
    //  let xSpace = 30;
    // let ySpace = 30;
    let rows = height/cellSize;
    let columns = width/cellSize;
  
    let noiseScale= 0.03;
    for(let i  = 0; i <= columns; i++){
        for(let j = 0; j <= rows; j++){
             
            push();
          
            translate(i*cellSize,j*cellSize)
            let noiseVal = noise(j*noiseScale, i*noiseScale, frameCount*textSpeed);

            let ch2 = map(noiseVal,0,1,0,chars.length);
      
            textSize(20);
            let c1 = map(mouseY, 0, 80, 0, innerHeight);
            fill(0,c1,c1);
            
            text(chars[round(ch2)],0,0);
            
            pop();
        }
    }
  pop();
  
  //Call the methods defined in class Drop for each drop element created in the drops array.
  drops.forEach(drop => {
    drop.update();
    drop.brightenCell();
  });
  
  //Same thing but with class Cell.
  cells.forEach(row => {
    row.forEach(cell => {
      cell.draw();
      cell.update();
    });
  });
  
  //Draw eyes. I used push and pop here so that it wouldn't affect the text.
  push();
  let rControl;
let gControl;
let bControl;
  
    noFill();
    stroke(255);
    strokeWeight(3);
    beginShape();
      vertex(-300, 0);
      bezierVertex(-100, -200, 100, -200, 300, 0);
      bezierVertex(100, 200, -100, 200, -300, 0);
    endShape();
  
    //The cosine function is used for this because the value goes up and down, suitable for a pulsing animation. -1 and 1 are the limits of the value returned by cosine, which is translated to the value between minSize and maxSize, and the result is applied to cos(i * frameCount). I added `* mouseY` so that the pulsing gets faster the higher the mouseY value is, a.k.a when the iris turns red, implying a condition when overdosage causes the iris to pulsate and also the heart to beat faster. `/230` is only there to make the pulse slower.
    for (i = 0; i < 15; i++) {
       r = map(cos(i * frameCount * mouseY/230), -1, 1, minSize, maxSize);
    }
 pop();
  
  //Basically setting the amount of waves being drawn on the canvas.
  for (let j = 0; j < num; j+=2) {
    waves[j].display();
    waves[j].move();
  }
  
}

