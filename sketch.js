let capture;
let a = 0;
let b = 0;


function setup() {
 createCanvas(windowWidth, windowHeight);
   capture = createCapture(VIDEO);
  capture.size = (windowWidth, windowHeight);
 capture.hide();
  //disable default touch events for mobile
 var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", pdefault, false);
  el.addEventListener("touchend", pdefault, false);
  el.addEventListener("touchcancel", pdefault, false);
  el.addEventListener("touchleave", pdefault, false);
  el.addEventListener("touchmove", pdefault, false);
  
  
 
 
}



function pdefault(e){
  e.preventDefault()

}
function draw() {
 background(255);

 image(capture, 0, 0, windowWidth, windowHeight);
 stroke (20);
 srokeWeight (20);
 line (0, 0, a, b)
 
 
}
function touchStarted(){ if (touchStarted == true){
a = mouseX;
 b = mouseY;
}
}
