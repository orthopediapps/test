var m = {x:0, y:0};
var touchX = 0;
var touchY = 0;
var touchIsDown;
var value =0;
let a = 0;
let b = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(25, 150, 45);


  //disable default touch events for mobile
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", pdefault, false);
  el.addEventListener("touchend", pdefault, false);
  el.addEventListener("touchcancel", pdefault, false);
  el.addEventListener("touchleave", pdefault, false);
  el.addEventListener("touchmove", pdefault, false);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function pdefault(e){
  e.preventDefault()
}

function draw() {
  update();
   fill(value)
ellipse (100, 100, a, b);
 
}

function update(){
  //normalize interaction
  m.x = max(touchX, mouseX);
  m.y = max(touchY, mouseY);
  m.pressed = mouseIsPressed || touchIsDown;

}

function touchIsMoved(){
   a = mouseX;
  b = mouseY;
  
}
 
