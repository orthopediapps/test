p5.disableFriendlyErrors = true;
let x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, x5, y5, z5, x6, y6, z6;
let PC, TG, OM1, OM2, OM3, OM4, OM5, OM6;
let near, middle, far, vnear, Trav1, TGln, goto, goto2, goto3, firstdist, seconddist;
let travelto1, travelto2, travelto3, travelto4;
let distancePCTG, distancebump2PC;
let distOMPC = 1150;
let planetRadius = 1000;
let OMSize = 50;
let scaleFactor
let angVel, fullRotTime;
let x, y, z, xmas, ymas, zmas;
let dOM1, dOM3, dOM6, pdOM1, pdOM3, pdOM6;
let ex1, ex2, ex3, ey1, ey2, ey3, ez1, ez2, ez3;
let u, v, w;
let distance, repeat, cxmn, cymn, czmn;
let stars = []
let show
let num = 1000;
let p = 1
let distan;
let dataInput;
let kd1, kd2, kd3;
let xmn = 0;
let ymn = 0;
let zmn = 0;
let check;
let display = false
let displayCoords = false
let displayIndications = false
let displayInputHeight = false
let customCoordsinput = false
let loadedJSON = null;
let coordFile;
let a, b, c, d;
let texr;
let img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15,img16, img17, img18, logo;
let filename;
let discriminate;
let myFont;
let OCPan = 1;
let customx, customy, customz;
let planet = "Choose Planet";
let lplanet;
let orbitpos;
let filestring;







function preload() {
  arcim = loadImage("assets/arccorp.jpg")
  wal = loadImage("assets/wal.jpg")
  lyr = loadImage("assets/lyr.jpg")
  mic = loadImage("assets/microtech.jpg")
  clio = loadImage("assets/clio.jpg")
  cal = loadImage("assets/cal.jpg")
  eut = loadImage("assets/eut.jpg")
  cru = loadImage("assets/cru.jpg")
  yel = loadImage("assets/yel.jpg")
  cel = loadImage("assets/cel.jpg")
  daym = loadImage("assets/daym.jpg")
  hur = loadImage("assets/hur.jpg")
  abe = loadImage("assets/abe.jpg")
  ari = loadImage("assets/ari.jpg")
  ita = loadImage("assets/ita.jpg")
  magda = loadImage("assets/mag.jpg")
  del = loadImage("assets/del.jpg")
  cho = loadImage("assets/yel.jpg")
  plogo = loadImage("assets/logo.png")
  pmyFont = loadFont("assets/Roboto-Regular.ttf")
  fondo = loadImage("assets/fondo.jpg")

  for (i = -num; i < num; i++) {
    stars[i] = new star()
  }

  function star() {

    this.a = random(-1200, 1200)
    this.b = random(-1200, 1200)
    this.c = random(-1200, 1200)
    this.show = function() {
      strokeWeight(0.9)
      stroke(255)
      xstar = this.a
      ystar = this.b
      zstar = this.c
      point(xstar, ystar, zstar)

    }
  }
}


function setup() {

  myFont = pmyFont

  img1 = arcim 
  img3 = wal 
  img2 = lyr 
  img13 = mic 
  img15 = clio 
  img14 = cal 
  img16 = eut 
  img4 = cru 
  img7 = yel 
  img5 = cel 
  img6 = daym 
  img8 = hur 
  img9 = abe 
  img10 = ari 
  img11 = ita 
  img12 = magda 
  img17 = del 
  img18 = cho 
  pfondo = fondo

  logo = plogo
  logo.resize(170, 0)
  texr = img1
  let inp = createInput('name your file');
  inp.input(myInputEvent);
  inp.position(1150, 650);
  inp.id("file name");
  let JSONinput = createFileInput(loadData);
  JSONinput.position(1000, 720);
  

  dataInput = function(di) {
    di.setup = function() {
      let canvas1 = di.createCanvas(1400, 800);
      canvas1.position(0, 0);

      sel = di.createSelect();
      sel.position(45, 200);
      sel.size(200,25)
      sel.option('Choose Planet');
      sel.option('Arccorp');
      sel.option('   -Lyria');
      sel.option('   -Wala');
      sel.option('Crusader');
      sel.option('   -Cellin');
      sel.option('   -Daymar');
      sel.option('   -Yela');
      sel.option('Hurston');
      sel.option('   -Aberdeen');
      sel.option('   -Arial');
      sel.option('   -Ita');
      sel.option('   -Magda');
      sel.option('Microtech');
      sel.option('   -Calliope');
      sel.option('   -Clio');
      sel.option('   -Euterpe');
      sel.option('Delamar');
      sel.changed(planetSelect);
    }

    function planetSelect() {
      clearJSONFields()
      planet = sel.value();
    }


    di.draw = function() {
      di.background(pfondo);
      
      di.textSize(15)
      di.fill(0,255,0)
     di.text("Input distance in km. to", 65, 250)
      di.text("OM1", 65, 285)
      di.text("OM3", 65, 335)
      di.text("OM6", 65, 385)
      di.text("X", 70, 607)
      di.text("Y", 70, 657)
      di.text("Z", 70, 707)
      di.text("Coordinates manual input", 70, 540)
      di.text("(Optional)", 115, 560)
      di.textSize(25)
      di.text(filestring, 1000, 775)
      di.image(logo, 60, 20)
     
      if (displayCoords === true) {
        di.textSize(30)
        di.text("COORDINATES", 700, 650)
        di.text("X : " + nfc(xmn, 2), 750, 690)
        di.text("Y : " + nfc(ymn, 2), 750, 730)
        di.text("Z : " + nfc(zmn, 2), 750, 770)
      
      }

      if (displayIndications === true) {
        di.push()
        di.fill(255,255,255,100)
        di.rect(340, 80, 450, 480)
        di.pop()
        di.fill(0,200,25)
        di.textSize(30)
        di.text("ROUTE PLAN " , 450, 120)
        if (loadedJSON != null){
          di.textSize(20)
       di.text("to "+ filestring , 450, 145) }
        di.textSize(25)
        di.fill(0)
        di.text("1-> Go to : " + planet, 360, 180)
        di.text("2-> Fly to : " + goto, 360, 220)
        di.text("3-> Aim at : " + goto2, 360, 260)
        di.text("4-> Fly to " + travelto1 + " km far from  " + goto2, 360, 300)
        di.text("5-> Aim at center of planet (COP)", 360, 340)
        di.text("6-> Fly at " + travelto2 + "km far from COP", 360, 380)
        di.text("7-> Aim at " + goto3, 360, 420)
        di.text("8-> Fly at " + travelto3 + " km. far from " + goto3, 360, 460)
        di.text("8-> Aim at COP", 360, 500)
        if (orbitpos > (planetRadius+5)) {
          di.text("10 -> Get " + travelto4 + " km. away from it", 360, 540)
        } else {
          di.text("10-> Aim at COP. Go to surface", 360, 540)

        }
      }
      
    }
  }

  let canvas2 = createCanvas(600, 600, WEBGL);
  var first_sketch = new p5(dataInput, "datacontainer");
  canvas2.position(800, 0);
  button = createButton('SHOW / HIDE ROUTE');
  button.size(200, 80)
  button.style('font-size', "20px");
  button.style('background-color', '#03fc07');
  button.position(450, 650);
 
  buttonSave = createButton('Save Location');
  buttonSave.position(1000, 650);
  buttonSave.size(150, 25);
  /**/

  buttonCalc = createButton('Confirm distances');
  buttonCalc.position(80, 420);

  buttonCoords = createButton('Confirm coordinates');
  buttonCoords.position(80, 745);


  //DISTANCE TO OM1
  let inpz = createInput('');
  inpz.input(myInputEventZ);
  inpz.position(100, 270);
  inpz.size(100, 15);
  inpz.id("dist to OM1")
  //DISTANCE TO OM3
  let inpy = createInput('');
  inpy.input(myInputEventY);
  inpy.position(100, 320);
  inpy.size(100, 15);
  inpy.id("dist to OM3")
  //DISTANCE TO OM6
  let inpx = createInput('');
  inpx.input(myInputEventX);
  inpx.position(100, 370);
  inpx.size(100, 15);
  inpx.id("dist to OM6")

  let coordsx = createInput('');
  coordsx.input(mycoordsX);
  coordsx.position(100, 590);
  coordsx.size(100, 15);
  coordsx.id("customX")

  let coordsy = createInput('');
  coordsy.input(mycoordsY);
  coordsy.position(100, 640);
  coordsy.size(100, 15);
  coordsy.id("customY")

  let coordsz = createInput('');
  coordsz.input(mycoordsZ);
  coordsz.position(100, 690);
  coordsz.size(100, 15);
  coordsz.id("customZ")

}

function myInputEventX() {
  pdOM6 = this.value()
}

function myInputEventY() {
  pdOM3 = this.value()
}

function myInputEventZ() {
  pdOM1 = this.value()
}

function mycoordsX() {
  customx = this.value()
}

function mycoordsY() {
  customy = this.value()
}

function mycoordsZ() {
  customz = this.value()
}




function draw() {
  
  button.mousePressed(check);
  buttonSave.mousePressed(saveCoords);
  buttonCalc.mousePressed(inputDistances);
  buttonCoords.mousePressed(inputCoordinates);
  PC = createVector(x0, y0, z0);
  OM1 = createVector(x1, y1, z1);
  OM2 = createVector(x2, y2, z2);
  OM3 = createVector(x3, y3, z3);
  OM4 = createVector(x4, y4, z4);
  OM5 = createVector(x5, y5, z5);
  OM6 = createVector(x6, y6, z6);
  TG = createVector(xmn, ymn, zmn);
  
  planetData()
  trialiterate()
  
  if (loadedJSON != null) {

    /* stplanet = storeItem("planet", (loadedJSON.aa));
     stxmn = storeItem("xmn", (loadedJSON.bb));
     stymn = storeItem("ymn", (loadedJSON.cc));
     stzmn = storeItem("zmn", (loadedJSON.dd));
     planet = getItem("planet")
     xmn = getItem("xmn")
     ymn = getItem("ymn")
     zmn = getItem("zmn")*/
    planet = lplanet
    xmn = lxmn
    ymn = lymn
    zmn = lzmn
    
      discriminate = ldiscriminate
     
  }
  
  
  scaleFactor = 100 / distOMPC

  orbitControl(OCPan, OCPan, 0.53)
  background(0);

  for (var i = -num; i < num; i++) {
    stars[i].show();
  }
  push()
  scale(scaleFactor)
  fill(0, 150, 100)
  translate(PC)
  noStroke()
  texture(texr)
  sphere(planetRadius)
  pop()
  push()
  scale(scaleFactor)
  noStroke()
  fill(255, 0, 0)
  translate(OM1)
  sphere(OMSize)
  textSize(OMSize * 2)
  textFont(myFont)
  text("OM1", -OMSize * 2, -OMSize * 2)
  pop()
  push()
  scale(scaleFactor)
  noStroke()
  fill(255, 0, 0)
  translate(OM2)
  sphere(OMSize)
  textSize(OMSize * 2)
  textFont(myFont)
  text("OM2", -OMSize * 2, -OMSize * 2)
  pop()
  push()
  scale(scaleFactor)
  noStroke()
  fill(255, 0, 0)
  translate(OM3)
  sphere(OMSize)
  textSize(OMSize * 2)
  textFont(myFont)
  text("OM3", -OMSize * 2, -OMSize * 2)
  pop()
  push()
  scale(scaleFactor)
  noStroke()
  fill(255, 0, 0)
  translate(OM4)
  sphere(OMSize)
  textSize(OMSize * 2)
  textFont(myFont)
  text("OM4", -OMSize * 2, -OMSize * 2)
  pop()
  push()
  scale(scaleFactor)
  noStroke()
  fill(255, 0, 0)
  translate(OM5)
  sphere(OMSize)
  textSize(OMSize * 2)
  textFont(myFont)
  text("OM5", -OMSize * 2, -OMSize * 2)
  pop()
  push()
  scale(scaleFactor)
  noStroke()
  fill(255, 0, 0)
  translate(OM6)
  sphere(OMSize)
  textSize(OMSize * 2)
  textFont(myFont)
  text("OM6", -OMSize * 2, -OMSize * 2)
  pop()
  push()
  scale(scaleFactor)
  translate(xmn, ymn, zmn)
  noStroke()
  fill(0, 255, 0, 100)
  sphere(OMSize)
  pop()
  

  if (xmn > 0 && ymn < 0 && zmn > 0 && displayInputHeight == false) {

    discriminate = prompt("Enter distance to planet center\r\rCancel if below athmosphere");
    displayInputHeight = true
    if (discriminate == null) {
      discriminate = planetRadius;
    }
  }

  coordsArray = [planet, xmn, ymn, zmn]

  if (display === true) {
    displayRoute()
    //orbitpos = distancePCTG
  }

  function check() {

    if (display === false) {
      display = true
      displayIndications = true
    } else {
      display = false
      displayIndications = false
    }
  }
}

function saveCoords() {

  let json = {};
  json.aa = planet;
  json.bb = float(xmn);
  json.cc = float(ymn);
  json.dd = float(zmn);
  json.ee = float(discriminate);

  if (filename == "" || filename == null) {
    alert("Name must be filled out");
    return false;
  }
  saveJSON(json, '' + filename, true);
  clearNameFields();

}

function loadData(file) {

  loadedJSON = loadJSON(file.data, onFileLoad);
  filestring1 = str(file.name)
let splitString = split(filestring1, '.');
  filestring = splitString[0]
}

function onFileLoad() {
  clearDistFields()
  clearManualCoords()
  customCoordsinput = false
  displayInputHeight = true
  display = false
  displayIndications = false
  lplanet = (loadedJSON.aa);
  lxmn = (loadedJSON.bb);
  lymn = (loadedJSON.cc);
  lzmn = (loadedJSON.dd);
  ldiscriminate = (loadedJSON.ee);
  clearNameFields()
  displayCoords = true

}

function myInputEvent() {

  filename = this.value();
}

function clearDistFields() {

  document.getElementById("dist to OM1").value = "";
  document.getElementById("dist to OM3").value = "";
  document.getElementById("dist to OM6").value = "";

}

function clearManualCoords() {

  document.getElementById("customX").value = "";
  document.getElementById("customY").value = "";
  document.getElementById("customZ").value = "";

}

function clearNameFields() {

  document.getElementById("file name").value = 'name your file';

}

function clearJSONFields() {
  loadedJSON = null
  // clearStorage()
  filestring = "No file loaded"

}

function inputDistances() {
  if (pdOM1 == "" || pdOM1 == null || pdOM3 == null || pdOM3 == null || pdOM6 == null || pdOM6 == null) {
    alert("Complete all distance fields");
    return false;
  }
  if (pdOM1 == pdOM3 && pdOM1 == pdOM6){
  
  pdOM3 = pdOM6+".01"
  
  }
  clearJSONFields()
  displayInputHeight = false
  customCoordsinput = false
  display = false
  displayIndications = false
  discriminate = 10000
  clearManualCoords()
  displayCoords = false
  dOM1 = pdOM1
  dOM3 = pdOM3
  dOM6 = pdOM6
  if (displayCoords === false) {
    displayCoords = true
  } else {
    displayCoords = false
  }

}

function inputCoordinates() {
  if (customx == "" || customx == null || customy == null || customy == null || customy == null || customy == null) {
    alert("Complete all coordinate fields");
    return false;
  }
  clearJSONFields()
  displayInputHeight = false
  discriminate = 10000
  clearDistFields()
  display = false
  displayIndications = false
  if (customCoordsinput == false) {
    customCoordsinput = true
  }

}

function mouseDragged() {
  if (mouseButton === RIGHT) {
    OCPan = 0
  } else {
    OCPan = 1
  }
}