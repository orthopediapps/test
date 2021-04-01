const { clipboard } = require('electron')
const path = require('path');
// DAY NIGHT CYCLE CALCULATOR FOR STAR CITIZEN, @pitapa


let t = 0,
  rot = 0,
  a = 0;
let x1, y1;
let Plx = 0,
  Ply = 0,
  Plz = 0;
let planet, planetX, planetY;
let planetRadius = 200,
  anglefacesun = 0;
let declination, hfullrot;
let bulbx = 136049870,
  bulby = 1294427400,
  bulbz = 2923345368;
let planetdistbulb;
let angVel = 0;
let seconds;
let angleNN, angleDN, angleNS, angleDS;
let anglePL, theta2;
let bulbradius = 696000000;
let dayDuration = 0,
  nightDuration = 0;
let xspacing = 1;
let w, dx, yvalues;
let theta = 0.0,
  amplitude = 70,
  period = 0;
let val = 0,
  horizon = 250,
  m = 0;
var stars = [];
var show;
var num = 50;
let validate;
let start = 0;
let currentX = 0,
  currentY = 0;
let coords, pasted;
let button, loadedStr;
let myStrArr = [];
let refX, refY, refZ, refR, refAngle, greenwich_epoch, now_epoch, ref_epoch, dir, hem;
let passed_angle = 0;
let resulting_angle = 0;
let elevhyp = 0;
let slide = 0;
let elevX = 780,
  elevY = 140;
let destsel;
let texto;
let prex = 0;
let prey = 0;
let zval = 0;
let latitude, longitude;
let control = [];
let merx, mery;
let c = 0;
let showcheck = false;
let pos = 1;
let goto;
let restart;
let cop = false;
let szoom = false;
let startroute = false;
let ap = 0;
let b = 0;
let mapwidth = 800;
let grid = 10;
let fade = 0
let faderate = 0.5;
let resize = false;
let sf1, sf2;
let km = 1000;
let sitesdata;
let destination;
let destinationx = 0;
let destinationy = 0;
let showmap = false;
let showday = false;
let showcoords = true;
let planetID = 16;
let destseltrue=0;
let locradius;
let longdest= 0;
let time2= 0;
let previousCoords = 0;


//THIS IS A FUNCTION THAT PRELOADS A FILE CONTAINING LOCATIONS DATA FOR EACH PLANET (LOCATION NAME AND LAT LONG)
// YOU CAN FIND THIS FILE CLICKING ON THE UPPER LEFT ARROW, IN THE FOLDER "ASSETS", THE FILE NAMED "LOCATIONLIST.JSON
// IN THE DESKTOP VERSION, THIS FILE IS LOCATED ON A SERVER, NOT ON THE PROGRAM. SO IT CAN BE EASILY UPDATED AT WILL

function preload() {
  // upload the JSON file to desired location and change URL
  let url= "https://www.astrolabesc.eu/assets/locationlist.json"
  sitesdata = loadJSON(url);
  
  }

// setup is all the fixed code that will run only once. It contains all the interface buttons and dropdown menus. 
function setup() {
// canvas size
  createCanvas(mapwidth, mapwidth/2);
// INTERFACE BUTTONS///////////////////////////////////////////////////////////////
  mapmodebtn = createButton("Nav_Map mode")
  mapmodebtn.position(285,450)
  mapmodebtn.mouseClicked(mapmode)
  
  cyclebtn = createButton("Day_time mode")
  cyclebtn.position(150, 450)
  cyclebtn.mouseClicked(daymode)
  
  coordsinfo = createButton("Coords info mode")
  coordsinfo.position(5, 450)
  coordsinfo.mouseClicked(coordsmode)

  goto = createButton("Player focus")
  goto.position(415,420)
  goto.mouseClicked(centeronplayer)

  izoom = createButton("Smart zoom")
  izoom.position(516,420)
  izoom.mouseClicked(smartZoom)

  restart = createButton("Reset view")
  restart.position(615,420)
  restart.mouseClicked(resetView)

  startrecord = createButton("Start Route")
  startrecord.position(710,420)
  startrecord.mouseClicked(start_route)

  eraseroute = createButton("Erase Route")
  eraseroute.position(710,420)
  eraseroute.mouseClicked(erase_route)

// hides the erase route on start, so it appears the start route button instead. 
  eraseroute.hide()
  
  
  
  // PLANET SELECTION FOR POIs////////////////////////////////
  sel = createSelect();
  sel.position(5,420);
  sel.option('Sel. Planet');
  sel.option('Crusader');
  sel.option('   -Cellin');
  sel.option('   -Daymar');
  sel.option('   -Yela');
  sel.option('Hurston');
  sel.option('  -Aberdeen');
  sel.option('   -Arial');
  sel.option('   -Ita');
  sel.option('   -Magda');
  sel.option('Arccorp');
  sel.option('   -Lyria');
  sel.option('   -Wala');
  sel.option('Microtech');
  sel.option('   -Calliope');
  sel.option('   -Clio');
  sel.option('   -Euterpe');
  
  
  // When you select a planet, a new dropdown menu spawns containing list with locations for each planet
  // this list takes the names from the sitesdata.json file. Checks which planet is selected and creates the corresponding location lists
  sel.changed(locationSelect);






// this code creates a text input for manually pasting coordinates from /showlocation. 
//It automatically splits the text into independent x, y and z coordinates, so just directly right click and paste after /showlocation. 
//This code is unuseful, as it depends on the time it takes the user to change windows and paste the coords. 
//The planet keeps rotating, so when you finally paste it the coords are offset. 
//In desktop version this is substituted by a script that continuously listens to the system clipboard and grabs the coords from 
// there without need of user interaction. But in this version that is not allowed due to security reasons. So this code
// is just for testing purposes. 
  
  

  
  
// These are some values for the sine curve for sun path graph. 
  period = 600;
  w = 600;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));

/// FOR DRAWING A FANCY STAR FIELD BACKGROUND in day/night graph ////////////////////
  for (i = -num; i < num; i++) {
    stars[i] = new star();
  }

  function star() {

    this.a = random(5, 605);
    this.b = random(10, 210);
    this.show = function() {
      strokeWeight(0.9);
      stroke(0);
      xstar = this.a;
      ystar = this.b;
      stroke(255, 255, 0)
      point(xstar, ystar);

    }
  }
  
////////////DO NOT SHOW NAVIGATION BUTTONS ON FIRST PROGRAM RUN/////////////////////////////////////  
goto.hide()
izoom.hide()
restart.hide()
startrecord.hide()
eraseroute.hide()

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////      MAIN SKETCH LOOP       /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// THIS PART OF THE CODE MAKES THE MAIN CALCULATIONS FOR EVERYTHING. AT THE END IT EXECUTES THE DRAWING FUNCTIONS
// USING THE CALCULATED VALUES. 

function draw() {
  let time1= millis();
 autopasteCoords()
  // IN FINAL VERSION THE "AUTOPASTE" METHOD WOULD COME HERE. UNCOMMENT NEXT CODE LINE
  // autopaste()
  //IN FINAL VERSION THE "AUTOPASTE" METHOD WOULD COME above HERE. 
  
  
  planetData();// Grabs data for each planet (radius, rotation speed, declination, coordinates, etc...)
  planetRadius = planetRadius;
  
  // CALCULATES "HOW BIG" IS THE SUN SEEN FROM EACH PLANET SURFACE//////////////////
  disc = atan(bulbradius / elevhyp);

  
  // ANGULAR VELOCITY FOR PLANETS, CONVERT FROM TIME IN HOURS TO SECONDS. SETUP FOR HOW LONG PROGRAM HAS BEEN RUNNING///////
  angVel = 2 * PI / (hfullrot * 3600000);// in radians per milisecond. (multiply *300 and input some coordinates if you want to see the sunrise graph accelerated for testing purposes or fun)
  angVelDeg =360 / (hfullrot * 3600000);// in degrees per milisecond
  mseconds = (millis() - start)-time2;//miliseconds passed since last coordinates input. 

// MAKES BULB  COORDINATES CENTER OF REFERENCE, AND REFERENCES PLAYER TO PLANET CENTER. 
  currentX = Plx - planetX - bulbx;
  currentY = Ply - planetY - bulby;
  latx = currentX;
  laty = currentY;
  latz = Plz;

  
  // ANGULATION OF PLANET ACCORDING TO BULB, IN XY AXIS. In the x plane, angle where the planet is located according to bulb. 
  rot = anglefacesun;
  startangle = atan2(currentY, currentX);
  if (startangle < 0) {
    startangle = startangle + (2 * PI)
  }
  
  
  // The terminator line is a circle. Due to declination, when you project this circle on a plane it is seen as an ellipse. 
  // according to player latitude, the circular motion has a radius equal to planet radius at equator but smaller on higher latitudes.
  // This code calculates the ellipse, and how it is oriented towards the sun. 
  // it calculates then when the player (point moving on a circle), will intersect the terminator line (ellipse) according to latitude
  
  t = ((mseconds * angVel) + startangle) % (2 * PI); // adjust for revolutions>1
  a = planetRadius * sin(declination) / sin(PI / 2) // calculates ellipse minor axis according
  r = sqrt((planetRadius * planetRadius) - (Plz * Plz)) // smaller radius at higher altitudes
  x1 = a * cos(t) * cos(rot) - planetRadius * sin(t) * sin(rot);
  y1 = a * cos(t) * sin(rot) + planetRadius * sin(t) * cos(rot);
  intx = abs(a * sqrt((r * r - planetRadius * planetRadius) / (a * a - planetRadius * planetRadius)))
  inty = abs(planetRadius * sqrt((a * a - r * r) / (a * a - planetRadius * planetRadius)))
  
  //TERMINATOR POINTS coordinates on ellipse, day and night, FOR NORTH AND SOUTH HEMISPHERES
  
  sunsouthx = intx * cos(rot) - inty * sin(rot)
  sunsouthy = intx * sin(rot) + inty * cos(rot)
  sunnorthx = -intx * cos(rot) - inty * sin(rot) 
  sunnorthy = -intx * sin(rot) + inty * cos(rot) 
  nightsouthx = intx * cos(rot) + inty * sin(rot)
  nightsouthy = intx * sin(rot) - inty * cos(rot)
  nightnorthx = -intx * cos(rot) + inty * sin(rot)
  nightnorthy = -intx * sin(rot) - inty * cos(rot)
  DN = createVector(sunnorthx, sunnorthy)
  DS = createVector(sunsouthx, sunsouthy)
  NN = createVector(nightnorthx, nightnorthy)
  NS = createVector(nightsouthx, nightsouthy)
  if (t > PI) {
    t = t - 2 * PI
  }
  PL = createVector(r * cos(t), r * sin(t))
  angleNN = atan2(NN.y, NN.x, 0, 0)
  angleDN = atan2(DN.y, DN.x, 0, 0)
  angleNS = atan2(NS.y, NS.x, 0, 0)
  angleDS = atan2(DS.y, DS.x, 0, 0)
  anglePL = atan2(PL.y, PL.x, 0, 0)
  degNN = angleNN * 180 / PI;
  degDN = angleDN * 180 / PI;
  degNS = angleNS * 180 / PI;
  degDS = angleDS * 180 / PI;
  degPL = anglePL * 180 / PI;

  if (degNN < 0) {
    degNN = degNN + 360
  }
  if (degDN < 0) {
    degDN = degDN + 360
  }
  if (degNS < 0) {
    degNS = degNS + 360
  }
  if (degDS < 0) {
    degDS = degDS + 360
  }
  if (degPL < 0) {
    degPL = degPL + 360
  }

  // change this code if (Plz > 0) to > to display inverted times to hemisphere, testing
  if (Plz < 0) {
    angleSunset = degNN - degPL;
    if (angleSunset < 0) {
      angleSunset = 360 + angleSunset
    }
    angleSunrise = degDN - degPL;
    if (angleSunrise < 0) {
      angleSunrise = 360 + angleSunrise
    }
  } else {
    angleSunset = degNS - degPL;
    if (angleSunset < 0) {
      angleSunset = 360 + angleSunset
    }
    angleSunrise = degDS - degPL;
    if (angleSunrise < 0) {
      angleSunrise = 360 + angleSunrise
    }
  }
  
  
  //ADJUSTS TIMES OF SUNSET FOR UPPER BORDER DISAPPEARING BELOW HORIZON, AND SUNRISE FOR UPPER BORDER SHOWING ABOVE HORIZON
  //INSTEAD OF SHOWING WHERE SUN MIDDLE POINT IS (PRIOR CALCULATION OF "HOW BIG SUN IS SEEN FROM EACH PLANET")
  //ADDS OR SUBSTRACT TIME ACCORDING TO ELEVATION OF HORIZON LINE. 
  
  horizonAngle = -slide * 20 / 120;// by manually setting horizon line elevation, it adds or substract time. 
  bordertime = (disc / angVel)/1000;// this adds or substract time to see upper border of star appearing or dissapearing above horizon.Depending on how big is the sun seen from this planet. 
  timeTosunset = (((angleSunset - horizonAngle) / (angVel * 180 / PI)) + bordertime)/1000;
  timeTosunrise = (((angleSunrise + horizonAngle) / (angVel * 180 / PI)) - bordertime)/1000;
let horizonSeconds= (horizonAngle/angVelDeg)/1000
  
  //SET TIME FOR NORTH/SOUTH HEMISPHERE AND CONVERSION FROM SECS TO HOURS MIN AND SECS. 
  
  let timetofullrot = (360 / angVelDeg)/1000;
  if (Plz >= 0) {
    if ((planetX > 0 && planetY < 0) || (planetX > 0 && planetY > 0)) {
      nightDuration = ((degNN - degDN) / angVelDeg)/1000;
      dayDuration = timetofullrot - nightDuration;

    }
    if ((planetX < 0 && planetY > 0) || (planetX < 0 && planetY < 0)) {
      nightDuration = ((degDN - degNN) / angVelDeg)/1000;
      dayDuration = timetofullrot - nightDuration;
    }
  }
  if (Plz < 0) {
    if ((planetX > 0 && planetY < 0) || (planetX > 0 && planetY > 0)) {
      nightDuration = ((degNS - degDS) / angVelDeg)/1000;
      dayDuration = timetofullrot - nightDuration;

    }
    if ((planetX < 0 && planetY > 0) || (planetX < 0 && planetY < 0)) {
      nightDuration = ((degDS - degNS) / angVelDeg)/1000;
      dayDuration = timetofullrot - nightDuration;
    }
  }

  let risehour = int(timeTosunrise / 3600);
  let risemindec = ((timeTosunrise / 3600) - risehour) * 60;
  let risemin = int(risemindec);
  let risesec = int((risemindec - risemin) * 60);
  let sethour = int(timeTosunset / 3600);
  let setmindec = ((timeTosunset / 3600) - sethour) * 60;
  let setmin = int(setmindec);
  let setsec = int((setmindec - setmin) * 60);
  let dayhour = int(dayDuration / 3600);
  let daymindec = ((dayDuration / 3600) - dayhour) * 60;
  let daymin = int(daymindec);
  let daysec = int((daymindec - daymin) * 60);
  let nighthour = int(nightDuration / 3600);
  let nightmindec = ((nightDuration / 3600) - nighthour) * 60;
  let nightmin = int(nightmindec);
  let nightsec = int((nightmindec - nightmin) * 60);


  calcWave();// Executes a function with a moving sine wave and sun representing daycycle in a fancy graph. 

  
  // THIS IS THE MAIN CODE TO CONVERT GLOBAL COORDS TO LOCAL COORDS. 
  // it checks "where was OM3 at a specific time". Then calculates which global coords has OM3 NOW, by checking in real time how many miliseconds has passed since then.  
  
  now_epoch = Date.now()
  ref_epoch = now_epoch -  greenwich_epoch;//(time now minus time from a reference value)
  greenwichNow = ((angVelDeg * ref_epoch) + refAngle) % 360;//which angle is OM3 now. 

  r1 = sqrt(PL.x * PL.x + PL.y * PL.y);
  let direction;
  if (greenwichNow > 180) {
    greenwichNow = greenwichNow - 360
  }
  greenwichNowrad = greenwichNow * PI / 180;
  greenwichcurrentx = refR * cos(greenwichNowrad)
  greenwichcurrenty = refR * sin(greenwichNowrad)
  let green = createVector(greenwichcurrentx, greenwichcurrenty)
  longitude = (green.angleBetween(PL)) * 180 / PI;//respect to planet center, which angle is player and which angle is OM3, then you have longitude. 
  if (longitude < 0) {
    direction = "W"
  } //twisted due to p5.js canvas orientation (x is right positive, y is down positive, z is positive towards user)
  else(direction = "E")
  latitude = atan(latz / r1) * 180 / PI;
  plheight = int((dist(0, 0, 0, latx, laty, latz)) - planetRadius);
 
  //This convert degrees to deg, min sec. 
  let latdeg = int(latitude);
  let latmindec = (latitude - latdeg) * 60;
  let latmin = int(latmindec);
  let latsec = int((latmindec - latmin) * 60);
  let longdeg = int(abs(longitude));
  let longmindec = (abs(longitude) - longdeg) * 60;
  let longmin = int(longmindec);
  let longsec = int((longmindec - longmin) * 60);
  if (latz >= 0) {
    hem = "N  "
  } else {
    hem = "S  ";
  }


// It displays tabs according to button pressed. Coords mode, day cycle mode or navigation mode. 
// ONLY DRAWING CODE, NOT CALCULUS, SO DATA IS CALCULATED ON BACKGROUND DESPITE WHICH "WINDOW" IS ACTIVATED, no delays. 

  if (showcoords == true) {
    draw1()
  } else {
    if (showday == true) {
      draw3()
    } else(draw2())
  }
   storecoords()
time2= millis()-time1;
  
  ///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////     DRAW 1     COORDINATES    //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//This code just tells you which planet and latitude, longitude and height you are.   
// I didn´t code showing coordinates for selected destination. Only current player position coords.   
  function draw1() {

    background(10);
  textSize(10)
  fill(255,0,0)
  text("WARNING: Only for testing purposes, coords need to be manually pasted on field below. hit Submit button. Results correspond to the time when those coords where obtained", 5, 10)

   push()
    fill(255)
    noStroke()
    push()
    fill(255, 0, 0);
    textSize(40);
    tw = textWidth(planet) / 2;
    text(planet, width / 4 - tw, 80);
    tw2 = textWidth(sel.value()) / 2;
    text(sel.value(), width*3/4 - tw2, 80);
    pop()




    push()
    fill(0,255,0)
    textSize(20)
    text("Current Coords", 130, 150)
    text("Destination Coords", 30+500, 150)
    fill(250)
    textSize(17)
    text("lat: " + hem  +"  " + latdeg + "º" + "  " + latmin + "'  " + latsec + "''", 30, 150+80)
    text("long: " + direction + "  " + longdeg + "º" + "  " + longmin + "'  " + longsec + "''", 30, 200+80)
    text("height: " + plheight + "  mts. ASL", 30, 250+80)
    text("local X: " + round(r * sin(-green.angleBetween(PL)) / 1000, 2), 230,150+80)
    text("local Y: " + round(r * cos(green.angleBetween(PL)) / 1000, 2), 230, 200+80)
    text("local Z: " + Plz / 1000, 230, 250+80)
    stroke(0,255,0)
    strokeWeight(0.5)
    line(width/2, 210, width/2, 250+85)
    pop()
    
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////      DRAW 2    MAP MODE     //////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  // This is the navigation tab. It draws a generic mercator projection. It adjusts automatically according to planet radius.
  // Once user has input some coords, a line representing distance scale is drawn. It adjusts to planet radius and screen zoom. 
  // blinking dots appear on player position (green) and selected destination (red). Once planet is selected, sites appear as orange dots. 
  // It offers several options: 
  // player focus centers the screen at players position. You can zoom and pan. 
  // smart zoom centers the screen in the mid point between player and selected destination (selecting a destination is needed for this to work)
  // it automatically zoom to offer the maximum field of view between both positions. 
  // reset view does that. It zooms out to initial view. 
  // start route: It stores checkpoints everytime /showlocation is called. It displays dots and a line representing the players path
  // WARNING!!! THIS FUNCTION SLOWS THE PROGRAM DOWN THE MORE CHECKPOINTS ARE ADDED. UP TO 700 ms. so it can generate offset coords. 
  // erase route is obvious what it does. 
  
function draw2() {
  
    background(80);
  
  textSize(10)
  fill(255,0,0)
  text("WARNING: Only for testing purposes, coords need to be manually pasted on field below. hit Submit button. Results correspond to the time when those coords where obtained", 5, 10)

  
  
    latrad1 = latitude * PI / 180;
    longrad1 = longitude * PI / 180;
    fade = fade + faderate;
    sf = pos;
    latradius= sqrt(pow(locradius,2)-pow(locradius*sin(latrad1), 2))//adjusts radius to distortion due to latitude, to show distance reference line accordingly. 

  // Once input some coords, it draws a yellow line indicating scale in km or mts. autoadjusts according to screen zoom and planet radius.
    line1000km = sf * km * width / (latradius / 1000 * 2 * PI)
    if (line1000km > width - 100) {
      km /= 10
    }
    if (line1000km < 50) {
      km *= 10
    }

    if (fade > 15) {
      fade = 0
    }
      
//translates lat and long to X Y coords on a mercator projection. In this case map width is double the height. 
    merx = mapwidth / (2 * PI) * longrad1;
    mery = -(mapwidth / 2 / (2 * PI) * (log(tan((PI / 4) + (latrad1 / 2))))) + 1;
  
// renders the scale reference line in km or mts. 
    push()
    stroke(255, 255, 0)
    strokeWeight(1)
    line(width / 2 - line1000km / 2, height - 20, width / 2 + line1000km / 2, height - 20)
    textSize(10)
    fill(255, 255, 0)
    noStroke()
    if (km >= 1) {
      text(km + " km", width / 2 - line1000km / 2, height - 30)
    } else(text(km * 1000 + " mts", width / 2 - line1000km / 2, height - 30))
    pop()
  
  
  // This code manages zoom (scroll wheel), pan and options for centering screen. See functions at the end of sketch
    translate(mapwidth / 2, mapwidth / 4)

    translate(-ap, -b)
    if (cop == true) {
      translate(-mapwidth / 2, -mapwidth / 2 / 2)
      translate((width / 2 - merx * sf), (height / 2 - mery * sf));
    } else if (szoom == true) {

      smartZoom()
      translate(-mapwidth / 2, -mapwidth / 2 / 2)

      translate((width / 2 - ix * sf), (height / 2 - iy * sf));

      sf1 = (mapwidth - 150) / abs(destinationx - merx)
      sf2 = ((mapwidth / 2) - 150) / abs(destinationy - mery)
      if (sf1 > sf2) {
        pos = abs(sf2)
      } else(pos = abs(sf1));
    }

    push()
    scale(sf)
// this code draws a generic mercator map. draws lines for latitude and longitude. According to zoom shows lines in intervals of 10, 5 or 1 degrees. 
    strokeWeight(0.7 / sf)
    if (sf < 10) {
      grid = 10
    } else if (sf > 10 && sf < 25) {
      grid = 5
    } else if (sf >= 25) {
      grid = 1
    }
// draws latitude lines
    for (let i = -90; i <= 90; i = i + grid) {
      lats = i;
      latrad = lats * PI / 180;

      y = mapwidth / (2 * PI) * (log(tan(PI / 4 + latrad / 2))) + 1;

      if (i % 10 == 0) {
        stroke(200);
        strokeWeight(0.7 / sf)
      } else if (i % 5 == 0) {
        stroke(200);
        strokeWeight(0.4 / sf)
      } else if (i % 1 == 0) {
        stroke(200);
        strokeWeight(0.2 / sf)
      }
      line(-mapwidth / 2, y, mapwidth / 2, y)
    }
  
  //draws longitude lines
    for (let i = -180; i <= 180; i = i + grid) {

      longs = i
      longrad = longs * PI / 180;
      x = mapwidth / (2 * PI) * longrad;
      if (i % 10 == 0) {
        stroke(200);
        strokeWeight(0.7 / sf)
      } else if (i % 5 == 0) {
        stroke(200);
        strokeWeight(0.4 / sf)
      } else if (i % 1 == 0) {
        stroke(200);
        strokeWeight(0.2 / sf)
      }
      line(x, mapwidth / 2, x, -mapwidth / 2)
    }
  //draws a red line at lat 0, long 0
    push()
    strokeWeight(1 / sf)
    stroke(255, 0, 0)
    line(-mapwidth / 2, 1, mapwidth / 2, 1)

    stroke(255, 0, 0)
    line(0, -mapwidth / 2, 0, mapwidth / 2)

    pop()
  
  // gets number of locations for selected planet, to display them properly
    let locn = sitesdata.sites[planetID].locations_n;


// if start route is selected, this will draw a green dot each time /showlocation is called, and connect the dots with a line. 
  
  
  
 
  ////////////CODE BETWEEN THESE BARS IS THE REASON FOR HIGHEST DELAY IN PROGRAM RUN///////////////
    
  
 // if start route is selected, this will draw a green dot each time /showlocation is called, and connect the dots with a line. 
// getItem() function is known to produce delays. 
  for (let i = 0; i < zval; i++) {
      c = i + 1;
      strokeWeight(0.5 / sf)
      x = float(getItem("checkpointx" + str(c)))
      y = float(getItem("checkpointy" + str(c)))
      push()
      fill(0, 200, 0)
      noStroke()
      ellipse(x, y, 4 / sf)
      pop()
     if (c > 1) {
        push()
        stroke(0)
        line(float(getItem("checkpointx" + c)), float(getItem("checkpointy" + c)), float(getItem("checkpointx" + (c - 1))), float(getItem("checkpointy" + (c - 1))))
        pop()
      }
    }
  // LEFT TO DO: What happens when player crosses meridian 180?, a continuous route line would cross the screen
  // I thought on something like if distance from actual checkpoint to previous is > than width/2, make a line from previous to screen border
  //and another line from actual to screen border. Adjusting slope or mimicking it. 
  
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  
  
  //draws a blinking dot on current player location (green) and origin(if start route was selected, red color). 
    push()

    noStroke()
    fill(0, 255, 0)
    ellipse(merx, mery, 5 / sf)
    fill(0, 255, 0, 100 - (fade * 2))
    ellipse(merx, mery, fade*2 / sf, fade*2 / sf);
    fill(255, 0, 0)
    if (startroute == true) {
      ellipse(float(getItem("checkpointx1")), float(getItem("checkpointy1")), 5 / sf)
    }


    pop()

    pop()
  
  // draws an orange dot on each location and displays its name. 
  // it takes data from the JSON file. Checks latitude and longitude, and converts them to proper X Y coords for mercator projection. 
    for (let i = 0; i < locn; i++) {
      textSize(15)
      fill(255, 255, 255)
      destname = (sitesdata.sites[planetID].properties[i].name);
      longdest = (sitesdata.sites[planetID].properties[i].longitude) * PI / 180;
      latdest = (sitesdata.sites[planetID].properties[i].latitude) * PI / 180;
      destx = mapwidth / (2 * PI) * longdest;
      desty = (mapwidth / 2 / (2 * PI) * (log(tan((PI / 4) + (latdest / 2))))) + 1;
      text(destname, destx * sf, (desty - 0.1) * sf)
      fill(255, 100, 0)
      ellipse(destx * sf, desty * sf, 5, 5)
      fill(255, 0, 0, 100 - (fade * 2))
// draws a red blinking dot on selected destination. 
      if (destination == destname) {
        destinationx = destx;
        destinationy = desty;
        fill(255, 0, 0, 130 - (fade * 2))
        noStroke()
        ellipse(destx * sf, desty * sf, fade*2, fade*2);
      }
    }
  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////      DRAW 3   DAY/NIGTH CYCLES         ///////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  // tells you sunset and sunrise times according to latitude. 
  // you must input manually horizon line elevation by dragging the blue arrows on the left to mimick in game hud. 
  // the graph shows a sine wave of sun´s position. the sky in background darkens and shows starfield when night comes. Sun color changes as well. 
  // only works once user has input some coordinates. 
  // didn´t code sunset/sunrise for selected destination, but should not be too difficult. just duplicate code with selected coords instead of player coords. 
  
    function draw3() {

 
      background(10);
     // this is to draw the elevation line graph. Pretty long code for such a simple drawing!
      beginShape();
      push()
      fill(0, 150, 255)
      noStroke()
      translate(elevX, elevY)// just change these values if you want to position the graph on other coordinates of screen. 
      if (slide < -120) {
        slide = -120;
      } else if (slide > 120) {
        slide = 120;
      }
      vertex(-30, slide - 5)
      vertex(-50, slide - 5)
      vertex(-60, slide);
      vertex(-50, slide + 5)
      vertex(-30, slide + 5)
      vertex(-30, slide - 5)
      vertex(-30, slide - 5)
      endShape(CLOSE);
      beginShape();
      vertex(-160, slide - 5)
      vertex(-180, slide - 5);
      vertex(-180, slide + 5)
      vertex(-160, slide + 5)
      vertex(-150, slide)
      endShape(CLOSE);
      strokeWeight(3)
      stroke(0, 150, 255)
      line(-150, slide, -60, slide)
      stroke(255, 255, 255)
      strokeWeight(1)
      line(-130, 2, -80, 2)
      line(-130, -2, -80, -2)
      line(-130, 5 * 120 / 20, -80, 5 * 120 / 20)
      line(-130, 10 * 120 / 20, -80, 10 * 120 / 20)
      line(-130, 15 * 120 / 20, -80, 15 * 120 / 20)
      line(-130, 20 * 120 / 20, -80, 20 * 120 / 20)
      line(-130, -5 * 120 / 20, -80, -5 * 120 / 20)
      line(-130, -10 * 120 / 20, -80, -10 * 120 / 20)
      line(-130, -15 * 120 / 20, -80, -15 * 120 / 20)
      line(-130, -20 * 120 / 20, -80, -20 * 120 / 20)
      noStroke()
      textSize(12)
      text("0", -142, 3)
      text("0", -72, 3)
      text("-5", -145, 3 + 5 * 120 / 20)
      text("-5", -74, 3 + 5 * 120 / 20)
      text("-10", -147, 3 + 10 * 120 / 20)
      text("-10", -78, 3 + 10 * 120 / 20)
      text("-15", -147, 3 + 15 * 120 / 20)
      text("-15", -78, 3 + 15 * 120 / 20)
      text("-20", -147, 3 + 20 * 120 / 20)
      text("-20", -78, 3 + 20 * 120 / 20)
      text("5", -145, 3 - 5 * 120 / 20)
      text("5", -74, 3 - 5 * 120 / 20)
      text("10", -147, 3 - 10 * 120 / 20)
      text("10", -78, 3 - 10 * 120 / 20)
      text("15", -147, 3 - 15 * 120 / 20)
      text("15", -78, 3 - 15 * 120 / 20)
      text("20", -147, 3 - 20 * 120 / 20)
      text("20", -78, 3 - 20 * 120 / 20)
      fill(255)
      text(round(-slide * 20 / 120, 1), -45, slide - 8)
      textSize(12)
      text("Elevation of horizon line", -180, 150)
      pop()
      
      // displays time to sunset and sunrise. 
      push()
      textSize(30)
      fill(0, 255, 0)
      if (timeTosunrise>0 && timeTosunrise < timeTosunset) {
        text("Sunrise in: " + risehour + " H  " + risemin + " M  " + risesec + " S", 100, 250);

      } else {
        text("Sunset in: " + sethour + " H  " + setmin + " M  " + setsec + " S", 100, 250);
      }
      pop()
      push()
      textSize(15)
      fill(255)
      
      // additional info, uncomment and adjust screen coordinates if needed. 
    /*  if (Plz > 10) {
        text("North hemisphere", 10, 900);
      } else if (Plz < -10) {
        text("South hemisphere", 10, 900);
      } else {
        text("At equator", 10, 900);
      }*/
      
      text("Day duration for current latitude:   " + dayhour + " Hrs  " + daymin + " Min  " + daysec + " Sec", 100, 300);
      text("Night duration for current latitude: " + nighthour + " Hrs  " + nightmin + " Min  " + nightsec + " Sec",100, 340);
      pop()
      
      // this draws the sine wave graph showing moment of day, sunpath. 
      push()
      noStroke()
      fill(0, 0, 0)
      rect(5, 10, 605, 200)
      //draws a starfield background. 
      for (var i = -num; i < num; i++) {
        stars[i].show();
      }
      
      //maps values of horizon and sky height according to time. 
      let skyheight = map(dayDuration-horizonSeconds-bordertime, 0, timetofullrot, 10, 210)
      let trans = map(yvalues[600/2]+50, 0, 100, 0, 250)
      noStroke()
      
      
     // Draws the horizon line, that rises or sinks according to elevation of horizon line input. 
      //also draws the sky, blue for day, and it becomes transparent as time passes to show a black sky with stars. 
    
      fill(52, 190, 224, trans)//sky blue
      rect(5, 10, 605, skyheight)
      stroke(255)
      strokeWeight(1)
    line(5, skyheight, 605, skyheight )//horizon line
      pop()
      
      fill(10,0, 0)// ground, black
      rect(5, skyheight, 605, 210-skyheight) 
     push()
      translate(5, 100)
  
      renderWave();
      pop()


    }


  
}
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// FUNCTIONS 
// these are several additional functions that are called within the previous code 




// calculates and renders the sine wave for day night cycle
function calcWave() {

  theta = anglePL - rot + PI / 2;


  let x = theta;
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * amplitude;

    x += dx;
  }
}

function renderWave() {
//draws a moving sinewave according to time passed and planet rotation. It draws a cool sun that changes color according to time of day. 

  stroke(250);
  for (let x = 0; x < yvalues.length; x++) {
    point(x * xspacing, -yvalues[x]);
  }
 noStroke();

  let h = 0.1;
  for (let rsun = 200; rsun > 0; rsun= rsun-1.1) {
    fill(255+rsun-yvalues[20], 230-rsun-yvalues[20], 223/rsun-yvalues[20], h/rsun);
    ellipse(600 / 2 * xspacing, -yvalues[600 / 2], rsun, rsun);
    h = (h + 1);
   
  }
}

/////////////////////////////      END OF RENDERWAVE        /////////////////////////////////////////

// this takes the pasted coordinates from the text field, and splits it into separate xyz coords, and feeds them to the program. 


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
  start = millis();
  

  
  // all of this is to tell you which planet you are automatically once coords are pasted. Checks if you are within 20 km limit from planet center. 
  // it should be changed to ROTATION GRID CONTAINER values, instead of 2000000
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


// contains planet data, such as radius, declination, and the referenece value for OM3. should be updated to more precise readings in msec. 
// all this function planetData() should be converted to a JSON file, and uploaded to a server, just like locationlist. Just to be 
// able to change values easily in case CIG changes parameters. 
// see data explained on first one (ARCCORP)

function planetData() {
// see description for first planet. 

  if (planet == 'Arccorp') {
    planetRadius = 800000;//IN METERS. 
    planetX = (18587664740 - bulbx);// Converts planet coordinates to a system where the bulb (source of light, stanton) is X= 0, Y= 0.
    planetY = (-22151916920 - bulby);
    hfullrot = 3.1099999; //full rotation in hours. 
    anglefacesun = atan2(planetY, planetX); //angle facing the sun, terminator line projection orientation. 
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY) //distance from planet center to bulb. 
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb) //distance in Z plane, to calculate declination
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    
    // this is the value of reference for OM3. Just flew with my aurora to an OM3, and got its /showlocation with a timestamp. 
    // should be made again for all planets, as I made it manually with a chronometer very innacurately. 
    refX = 18586528588 - bulbx - planetX;
    refY = -22151781403 - bulby - planetY;
    refZ = 0;// not needed, can be erased. 
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612573354000; // timestamp (UNIX or EPOCH time, in miliseconds) for those OM3 coordinates. 
    refAngle = (atan2(refY, refX)) * 180 / PI; //angle between OM3 and planet center. 
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Lyria') {
    planetRadius = 223000;
    planetX = 18703607172 - bulbx;
    planetY = -22121650134 - bulby;
    hfullrot = 6.4299998;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 18703882943 - bulbx - planetX;
    refY = -22121828088 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612574065000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Wala') {
    planetRadius = 283000;
    planetX = 18379649310 - bulbx;
    planetY = -22000466768 - bulby;
    hfullrot = 6.3200002;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 18379277917 - bulbx - planetX;
    refY = -22000285983 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612574554000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == 'Crusader') {
    planetRadius = 7450000;
    planetX = -18962176000 - bulbx;
    planetY = -2664960000 - bulby;
    hfullrot = 0;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = -18962176000 - bulbx - planetX;
    refY = -2653226253 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612575271000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Cellin') {
    planetRadius = 260000;
    planetX = -18987611119 - bulbx;
    planetY = -2709009661 - bulby;
    hfullrot = 4.4499998;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = -18987958826 - bulbx - planetX;
    refY = -2708855063 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612575790000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Daymar') {
    planetRadius = 295000;
    planetX = -18930539540 - bulbx;
    planetY = -2610158765 - bulby;
    hfullrot = 2.4800000;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = -18930539540 + 295000 - bulbx - planetX;
    refY = -2610158765 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 0;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Yela') {
    planetRadius = 313000;
    planetX = (-19022916799) - bulbx;
    planetY = (-2613996151) - bulby;
    hfullrot = 1.8200001;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = -19022485475 - bulbx - planetX;
    refY = -2614142523 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612576067000;

    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle

    }
  } else if (planet == 'Hurston') {
    planetRadius = 1000000;
    planetX = 12850457090 - bulbx;
    planetY = 0 - bulby;
    hfullrot = 2.4800000;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)

    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 12849698850 - bulbx - planetX;
    refY = -1208937 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612569846000;

    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Aberdeen') {
    planetRadius = 274000;
    planetX = 12905757640 - bulbx;
    planetY = 40955551 - bulby;
    hfullrot = 2.5999999;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 12905394244 - bulbx - planetX;
    refY = 41123505 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612570370000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Arial') {
    planetRadius = 344500.06;
    planetX = 12892673309 - bulbx;
    planetY = -31476129 - bulby;
    hfullrot = 5.5100002;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 12892224018 - bulbx - planetX;
    refY = -31256656 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612571022000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Ita') {
    planetRadius = 325000;
    planetX = 12830194716 - bulbx;
    planetY = 114913609 - bulby;
    hfullrot = 4.8499999;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 12830035843 - bulbx - planetX;
    refY = 115358548 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612571338000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Magda') {
    planetRadius = 340833;
    planetX = 12792686360 - bulbx;
    planetY = -74464581 - bulby;
    hfullrot = 1.9400001; //game files say rot 0;

    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 12792593512 - bulbx - planetX;
    refY = -73978529 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612570700000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == 'Microtech') {
    planetRadius = 1000000;
    planetX = 22462016306 - bulbx;
    planetY = 37185625646 - bulby;
    hfullrot = 4.1199999;

    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 22460998034 - bulbx - planetX;
    refY = 37186625440 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612566249000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle

    }
  } else if (planet == '   -Calliope') {
    planetRadius = 240000.05;
    planetX = 22398369308 - bulbx;
    planetY = 37168840679 - bulby;
    hfullrot = 4.5900002;

    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 22488419694 - bulbx - planetX;
    refY = 37081174138 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612566506000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Clio') {
    planetRadius = 337166.59;
    planetX = 22476728221 - bulbx;
    planetY = 37091020074 - bulby;
    hfullrot = 3.2500000;

    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 22476260818 - bulbx - planetX;
    refY = 37090874132 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612567422000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == '   -Euterpe') {
    planetRadius = 213000.05;
    planetX = 22488109736 - bulbx;
    planetY = 37081123565 - bulby;
    hfullrot = 4.2800002;

    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));
    refX = 22488419694 - bulbx - planetX;
    refY = 37081174138 - bulby - planetY;
    refZ = 0;
    refR = sqrt(refX * refX + refY * refY)
    greenwich_epoch = 1612566838000;
    refAngle = (atan2(refY, refX)) * 180 / PI;
    if (refAngle < 0) {
      refAngle = 360 + refAngle
    }
  } else if (planet == "Somewhere in deep space") {
    planetRadius = 800000;
    planetX = 0 - bulbx;
    planetY = 0 - bulby;
    hfullrot = 0;
    anglefacesun = atan2(planetY, planetX);
    planetdistbulb = sqrt(planetX * planetX + planetY * planetY)
    elevhyp = sqrt(bulbz * bulbz + planetdistbulb * planetdistbulb)
    declination = acos((elevhyp * elevhyp + planetdistbulb * planetdistbulb - bulbz * bulbz) / (2 * elevhyp * planetdistbulb));

  }
}


// the code below is the functions for the buttons on navigation tab. 
function storecoords() {

// adds a checkpoint. 
  if (startroute == true) {
    zval = zval + 1;
    storeItem(str('checkpointx' + zval), nfc(merx, 8));
    storeItem(str('checkpointy' + zval), nfc(mery, 8));

  }


}


// zoom in and out according to mouse wheel. 
function mouseWheel(event) {

  if (event.delta > 0) {
    pos = pos + 2;

  } else {
    if (sf >= 1.1) {
      pos = pos - 2

    }
  }
  return false;
}

function resetView() {
  pos = 1;
  cop = false;
  szoom = false;
  ap = 0;
  b = 0;
}


//centers view on players position. zooms over player, you can pan. 
function centeronplayer() {

  cop = true;
  szoom = false;
  ap = 0;
  b = 0;



}
// centers view in a midpoint between player and selected destination. Auto zooms to get optimum FOV. PAN disabled. 
// if not destination selected it will show weird result. 
function smartZoom() {

  cop = false;
  szoom = true;
  ap = 0;
  b = 0;
  ix = merx + ((destinationx - merx) / 2);
  iy = mery + ((destinationy - mery) / 2);


}
// starts storing checkpoints every time /showlocation is called.
function start_route() {
  if (startroute == false) {

    startroute = true
    zval = 0;
    clearStorage()
  }
  eraseroute.show()
  startrecord.hide()
}
// erases all checkpoints and route. 
function erase_route() {

 clearStorage()
  startroute = false;
 

  startrecord.show()
  eraseroute.hide()
  
  centeronplayer()



}




// pan function
function mouseDragged() {
  if (showmap == true){
  ap = ap + pmouseX - mouseX;
  b = b + pmouseY - mouseY;
}
  // THIS PIECE OF CODE MAKES THE BLUE ARROWS ON HORIZON LINE ELEVATION SELECTOR DRAGGABLE. It must be here to not get in conflict with pan of map. 
else{ if (((mouseX <= -30 + elevX && mouseX >= -60 + elevX) || (mouseX <= -160 + elevX && mouseX >= -180 + elevX)) && (mouseY >= slide - 30 + elevY && mouseY <= slide + 30 + elevY)) {
    slide = mouseY - elevY;}}

}



// generates a dropdown menu once planet is selected. Basically it tells which locations must take according to planet selected. 
function siteid() {
  
  destination = destsel.value()

}
// it tells the program where to look on the JSON file according to selected destination. Added redundantly the planet radius, needed to work. 
function locationSelect() {
  if (sel.value() == 'Arccorp') {
    planetID = 0;
    locradius= 800000;
  } else if (sel.value() == '   -Lyria') {
    planetID = 1
     locradius= 223000;
  } else if (sel.value() == '   -Wala') {
    planetID = 2
     locradius= 283000;
  } else if (sel.value() == 'Crusader') {
    planetID = 3
     locradius= 7450000;
  } else if (sel.value() == '   -Cellin') {
    planetID = 4
     locradius= 260000;
  } else if (sel.value() == '   -Daymar') {
    planetID = 5
     locradius= 295000;
  } else if (sel.value() == '   -Yela') {
    planetID = 6
     locradius= 313000;
  } else if (sel.value() == 'Hurston') {
    planetID = 7
     locradius= 1000000;
  } else if (sel.value() == '  -Aberdeen') {
    planetID = 8
     locradius= 274000;
  } else if (sel.value() == '   -Arial') {
    planetID = 9
     locradius= 344500.06;
  } else if (sel.value() == '   -Ita') {
    planetID = 10
     locradius= 325000;
  } else if (sel.value() == '   -Magda') {
    planetID = 11
     locradius= 340833;
  } else if (sel.value() == 'Microtech') {
    planetID = 12
     locradius= 1000000;
  } else if (sel.value() == '   -Calliope') {
    planetID = 13
     locradius= 240000.05;
  } else if (sel.value() == '   -Clio') {
    planetID = 14
     locradius= 337166.59;
  } else if (sel.value() == '   -Euterpe') {
    planetID = 15
     locradius= 213000.05;
  } 
  else if (sel.value() == 'Sel. Planet') {
    planetID = 16
     locradius= 213000.05;
  } 
  displayloc()


  function displayloc() {
    destseltrue = destseltrue+1;
    if (destseltrue>1){
destsel.remove()}// this is to ERASE the previous dropdown menu as user selects a new planet. If not, several dropdown menus appear. 
    destsel = createSelect("Destination")
    destsel.position(116,420)
    
    destsel.option("Select Destination")
    destsel.option("Custom POI")
    let locn = sitesdata.sites[planetID].locations_n;
    for (let i = 0; i < locn; i++) {

      destsel.option(sitesdata.sites[planetID].properties[i].name)
      destsel.changed(siteid)
    }

  }
}


// tells the program which window must render; coords, day cycle or navigation. 
function mapmode() {

  showmap = true;
  showday = false;
  showcoords = false;

goto.show()
izoom.show()
restart.show()
   if (startroute == false){
startrecord.show()}
  else(eraseroute.show())



}

function daymode() {
  showmap = false;
  showday = true;
  showcoords = false;

goto.hide()
izoom.hide()
restart.hide()
startrecord.hide()
eraseroute.hide()


}

function coordsmode() {
  showmap = false;
  showday = false;
  showcoords = true;

goto.hide()
izoom.hide()
restart.hide()
startrecord.hide()
eraseroute.hide()


}
////////////////////END OF SKETCH/////////////////////////