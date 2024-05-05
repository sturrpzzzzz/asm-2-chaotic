class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.symbol = this.getRandomSymbol();
    this.bri = 0;
    this.litTimer = 0;
  }

  //Method to get a random symbol from a list of symbols, divided by split.
  getRandomSymbol() {
    return random("FAKE".split(""));
  }

  //Method to change the brightness value of the text colour.
  brighten() {
    this.bri = 100;
  }

  update() {
    //random() without any parameters returns a value between 0 and 1. The equation is basically 0 < 0.02 < 1, which means there is a 2% chance for each cell to change symbol each frame. If the value returned by random() is less than the value of symbolSwapProb, the symbol is going to change.
    if (random() < symbolSwapProb) {
      this.symbol = this.getRandomSymbol();
    }
    
    //As long as the brightness is > 0, or the word is visible on the black background, the brightness is 70 by default. this.litTimer keeps incrementing until the remainder of (this.litTimer + 1) % brightTime equals 0, then this.bri goes back to 0.
    if (this.bri > 0) {
      this.bri = 70;
      this.litTimer = (this.litTimer + 1) % brightTime;

      if (this.litTimer === 0) {
         this.bri = 0;
      }
    }
  }

  draw() {
    push();
      //I need to change the colorMode here because the whole brighness related methods are dependent on HSB.
      translate(-width/2,-height/2);
      colorMode(HSB);
      fill(0, 100, this.bri);
      //Text has 3 arguments: the random symbol taken from getRandomSymbol(), and the position of the symbol.
      text(this.symbol, this.x, this.y);
    pop();
  }
}


class Drop {
  constructor(col) {
    this.row = 0;
    this.col = col;
    this.dropTimeout = 0;
    //offscreenTimeout is a rounded down number of the random value returned by maxOffscreen.
    this.offscreenTimeout = floor(random(maxOffscreen));
    this.offscreen = true;
  }

  update() {
    //When this.offscreen is true, this.offscreenTimeout keeps incrementing until the remainder of (this.offscreenTimeout + 1) % maxOffscreen equals 0, then this.offscreen becomes false and the drop starts moving in the canvas.
    if (this.offscreen) {
      this.offscreenTimeout = (this.offscreenTimeout + 1) % maxOffscreen;
      if (this.offscreenTimeout === 0) {
        this.offscreen = false;
        }
      } else {
        //this.dropTimeout keeps incrementing until the remainder of (this.dropTimeout + 1) % dropTimeout equals 0, then the drop moves down one cell.
        this.dropTimeout = (this.dropTimeout + 1) % dropTimeout;
        if (this.dropTimeout === 0) {
          this.row++;
      }
      //When this.row reaches the max amount of rows, a.k.a when it reaches the bottom of the screen, this.offscreen becomes true again for that drop and the offscreenTimeout starts again with another random value.
      if (this.row === numRows) {
        this.row = 0;
        this.offscreen = true;
        this.offscreenTimeout = floor(random(maxOffscreen));
      }
    }
  }

  brightenCell() {
    //When this.offscreen is false, the brighten method is applied.
    if (!this.offscreen) 
    cells[this.row][this.col].brighten();
  }
}
