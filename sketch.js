let capture;


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
 background(0);

 image(capture, 0, 0, windowWidth, windowHeight);
 stroke (20);
 srokeWeight (20);
 fill (255);
 line (a, b, 0,0)
 
 
}
function touchStarted(){
a = mouseX;
 b = mouseY;
}
