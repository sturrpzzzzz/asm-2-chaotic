//Draw sine waves going from left to right or right to left of the circle.
class Wave {
  
  
  constructor(shift) {
    //Variable shift changes the starting point of each wave.
    this.shift = shift;
    //Variable angle used to change the degree of the sine wave
    this.angle = 0;
    //Variable movement changes the shift value over time
    this.movement = 0;
    //At first, there is only one set of waves going from 0 to 360. Variable period multiplies the sets of waves playing at once.
    this.period = 2;
    
    
  }
  
  display() {
    push();
    //Angle ranges from 0 to 360
    for (let i = 0; i <=360; i+=5) {
     
      //x value ranges from the left side of the circle (-r) to the right side of the circle (r)
      //map the value of i from (0, 360) to (-r, r)
      let x = map(i, 0, 360, -r, r);
      //amplitude is the distance between the middle point to the peak and the valley of the sine wave
      //We need to calculate the amplitude so that the waves stay inside the circle.
      //Pythagoras theorem: x^2 + y^2 = r^2
      //Rearrange the equation so that y is a function of x and r so that it never goes out of the circle limit:
      //=> y = r * square root of (1 -(x/r)^2)
      let amplitude = r * sqrt ( 1- pow((x/r), 2) );
      //sin(i) returns one set of value, which makes the wave static.
      //sin(i + this.angle) returns the same sets of values, which makes all waves overlap each other.
      //We need a variable that create changes between the waves, using variable shift.
      let y = amplitude * sin( (i + this.angle + this.shift *         this.movement) * this.period );
      
    //For the iris to move in accordance to the position of my cursor.
    let xpos = map(mouseX, 0, width, -r/3, r/3);
    let ypos = map(mouseY, 0, height, -r/3, r/3);  
    
    //For the iris to turn redder as it moves up, because when people overdoes their eyes roll up. Does that make sense?
    let rr = map(mouseY, 0, 255, 0, height);
    let gg = map(mouseY, 0, 255, height, 0);
    stroke(rr, gg, 0);
      
    ellipse(x-xpos, y-ypos, 1, 1);
    
      
    }
    pop();
  }
  
  move() {
    this.angle += 0.28;
    //Variable movement's value is assigned to an oscillating equation, either sin or cos 
    this.movement = cos(this.angle+this.shift);
    this.shift += random(-0.5, 0.5) ;
  }
}