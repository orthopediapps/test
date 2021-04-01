// OM3 CALIBRATION TOOL. 

const { clipboard } = require('electron')
const path = require('path');

let Plx = 0,
  Ply = 0,
  Plz = 0;
let start = 0;
let coords, pasted;
let button, loadedStr;
let myStrArr = [];
let refX, refY, refZ, refR, refAngle, greenwich_epoch, now_epoch, ref_epoch, dir, hem;
let texto;
let mapwidth = 800;
let resize = false;
let planet;



function setup() {
  createCanvas(mapwidth, mapwidth/2);
  }

function draw() {
  let time1= millis();
 autopasteCoords()
 ref_epoch = now_epoch - (millis()-start)
 draw1()
}
   
function draw1() {
    background(10);
    push()
    fill(255)
    noStroke()
    push()
    fill(255, 0, 0);
    textSize(40);
    tw = textWidth(planet) / 2;
    text(planet, width / 4 - tw, 80);
    pop()

    push()
    fill(0,255,0)
    textSize(20)
    text("Current Coords", 130, 150)
    fill(250)
    textSize(17)
    text("OM3 x coord"+ Plx, 30, 150+80)
    text("OM3 y coord" + Ply , 30, 200+80)
    text("OM3 reference Epoch time" + ref_epoch , 30, 250+80)
    pop()
    
  }

function autopasteCoords() {
  pasted = clipboard.readText();
  if (pasted != previousCoords){
  independ()  
  previousCoords = pasted;
  }}

function independ() {

  myStrArr = splitTokens(pasted, "xyz:. ")
  Plx = int(myStrArr[1]);
  Ply = int(myStrArr[3]);
  Plz = int(myStrArr[5]);
  now_epoch = Date.now()
  start = millis();
  
  if (Plx < 12850457090 + 2000000 && Plx > 12850457090 - 2000000 && Ply < 0 + 2000000 && Ply > 0 - 2000000) {
    planet = 'Hurston'
  } else if (Plx < 12892693309 + 2000000 && Plx > 12892653309 - 2000000 && Ply > -31456129 - 2000000 && Ply < -31496129 + 2000000) {
    planet = '   -Arial'
  } else if (Plx < 12905777636 + 2000000 && Plx > 12905737636 - 2000000 && Ply < 40975551 + 2000000 && Ply > 40935551 - 2000000) {
    planet = '   -Aberdeen'
  } else if (Plx < 12792706359 + 2000000 && Plx > 12792666359 - 2000000 && Ply > -74444581 - 2000000 && Ply < -74484581 + 2000000) {
    planet = '   -Magda'
  } else if (Plx < 12830214716 + 2000000 && Plx > 12830174716 - 2000000 && Ply < 114933609 + 2000000 && Ply > 114893609 - 2000000) {
    planet = '   -Ita'
  } else if (Plx > -18962156000 - 2000000 && Plx < -18962196000 + 2000000 && Ply > -2664940000 - 2000000 && Ply < -2664980000 + 2000000) {
    planet = 'Crusader'
  } else if (Plx > -18987591119 - 2000000 && Plx < -18987631119 + 2000000 && Ply > -2708989661 - 2000000 && Ply < -2709029661 + 2000000) {
    planet = '   -Cellin'
  } else if (Plx > -18930519540 - 2000000 && Plx < -18930559540 + 2000000 && Ply > -2610138765 - 2000000 && Ply < -2610178765 + 2000000) {
    planet = '   -Daymar'
  } else if (Plx > -19022896799 - 2000000 && Plx < -19022936799 + 2000000 && Ply > -2613976152 - 2000000 && Ply < -2614016152 + 2000000) {
    planet = '   -Yela'
  } else if (Plx < 18587684740 + 2000000 && Plx > 18587644740 - 2000000 && Ply > -22151896920 - 2000000 && Ply < -22151936920 + 2000000) {
    planet = 'Arccorp'
  } else if (Plx < 18703627172 + 2000000 && Plx > 18703587172 - 2000000 && Ply > -22121630134 - 2000000 && Ply < -22121670134 + 2000000) {
    planet = '   -Lyria'
  } else if (Plx < 18379669310 + 2000000 && Plx > 18379629310 - 2000000 && Ply > -22000446768 - 2000000 && Ply < -22000486768 + 2000000) {
    planet = '   -Wala'
  } else if (Plx < 22462236306 + 2000000 && Plx > 22461896306 - 2000000 && Ply < 37185625646 + 2000000 && Ply > 37185625646 - 2000000) {
    planet = 'Microtech'
  } else if (Plx < 22398389308 + 2000000 && Plx > 22398349308 - 2000000 && Ply < 37168860679 + 2000000 && Ply > 37168820679 - 2000000) {
    planet = "   -Calliope"
  } else if (Plx < 22476748221 + 2000000 && Plx > 22476708221 - 2000000 && Ply < 37091040074 + 2000000 && Ply > 37091000074 - 2000000) {
    planet = '   -Clio'
  } else if (Plx < 22488129736 + 2000000 && Plx > 22488089736 - 2000000 && Ply < 37081143565 + 2000000 && Ply > 37081103565 - 2000000) {
    planet = '   -Euterpe'
  } else(planet = "Deep Space")

  
}


