function displayRoute() {

  side = dist(0, 0, distOMPC, distOMPC, 0, 0)


  a = 30 * PI / 180
  b = 60 * PI / 180
  c = 45 * PI / 180
  d = 90 * PI / 180


  let mid = p5.Vector.lerp(OM3, OM6, 0.5);
  lengthC = side / 2 * sin(a) / sin(b)
  magnB = lengthC / mid.dist(OM1)
  let midT = p5.Vector.lerp(mid, OM1, magnB);
  let Th = midT.dist(PC)
  let v236 = createVector(midT.x, -midT.y, midT.z)
  let v145 = createVector(-midT.x, midT.y, -midT.z)
  let v235 = createVector(-midT.x, -midT.y, midT.z)
  let v136 = createVector(midT.x, midT.y, midT.z)
  let v246 = createVector(midT.x, -midT.y, -midT.z)
  let v135 = createVector(-midT.x, midT.y, midT.z)
  let v146 = createVector(midT.x, midT.y, -midT.z)
  let v245 = createVector(-midT.x, -midT.y, -midT.z)

  d1 = int(TG.dist(OM1))
  d2 = int(TG.dist(OM2))
  d3 = int(TG.dist(OM3))
  d4 = int(TG.dist(OM4))
  d5 = int(TG.dist(OM5))
  d6 = int(TG.dist(OM6))


  da = int(TG.dist(v136))
  db = int(TG.dist(v146))
  dc = int(TG.dist(v145))
  dd = int(TG.dist(v135))
  de = int(TG.dist(v236))
  df = int(TG.dist(v246))
  dg = int(TG.dist(v245))
  dh = int(TG.dist(v235))


  var items = [{
      name: OM1,
      value: d1,
      goto: "OM1"
    },
    {
      name: OM2,
      value: d2,
      goto: "OM2"
    },
    {
      name: OM3,
      value: d3,
      goto: "OM3"
    },
    {
      name: OM4,
      value: d4,
      goto: "OM4"
    },
    {
      name: OM5,
      value: d5,
      goto: "OM5"
    },
    {
      name: OM6,
      value: d6,
      goto: "OM6"
    }
  ];

  items.sort(function(a, b) {
    return a.value - b.value;
  });

  near = items[0].name;
  middle = items[1].name;
  far = items[2].name;

  var vitems = [{
      name: v136,
      value: da
    },
    {
      name: v146,
      value: db
    },
    {
      name: v145,
      value: dc
    },
    {
      name: v135,
      value: dd
    },
    {
      name: v236,
      value: de
    },
    {
      name: v246,
      value: df
    },
    {
      name: v245,
      value: dg
    },
    {
      name: v235,
      value: dh
    }
  ];

  vitems.sort(function(a, b) {
    return a.value - b.value;
  });

  vnear = vitems[0].name;


  let dTGPC = TG.dist(PC) * TG.dist(PC)
  let dPCV = PC.dist(vnear) * PC.dist(vnear)
  let dTGV = TG.dist(vnear) * TG.dist(vnear)
  angleX = abs(acos((dTGPC + dPCV - dTGV) / (2 * TG.dist(PC) * PC.dist(v136))))
  TGlength = Th * sin(d) / sin(PI - PI / 2 - angleX)
  magn = TGlength / TG.dist(PC)
  let TGln = p5.Vector.lerp(PC, TG, magn);

  dTGlnfar = far.dist(TGln) * far.dist(TGln)
  dTGlnnear = near.dist(TGln) * near.dist(TGln)
  let angleY = abs(acos((dTGlnfar - dTGlnnear + side * side) / (2 * far.dist(TGln) * side)))
  travel1 = (side * sin(angleY) / sin(PI - PI / 3 - angleY))
  magn1 = travel1 / side
  let Trav1 = p5.Vector.lerp(near, middle, magn1);
// check code from here
 let distancePCTG = PC.dist(TG)

  let bumplength = TGln.dist(PC)

  bumpmag1 = ((planetRadius+10) / bumplength)
  let bump2 = p5.Vector.lerp(PC, TGln, bumpmag1);
  
  
  // calculate angle between TGbumped, and OM CP
  dfarPC = far.dist(PC)
  dfarbump2 = far.dist(bump2)
  dPCbump2 = PC.dist(bump2)
  angle1 = acos((dfarPC*dfarPC + dfarbump2*dfarbump2 - dPCbump2*dPCbump2)/(2*dfarPC*dfarbump2))
   // calculate angle between Trav1, and OM CP
  dfarTrav1 = far.dist(Trav1)
  dTrav1PC = Trav1.dist(PC)
  angle2 = acos((dfarPC*dfarPC + dTrav1PC*dTrav1PC - dfarTrav1*dfarTrav1)/(2*dfarPC*dTrav1PC))
   // calculate length of height travel
  altitudegain = dfarPC*sin(angle1)/sin(PI-angle1-angle2)
 
  
  magn2 = altitudegain / dTrav1PC
  let finalVector = p5.Vector.lerp(PC, Trav1, magn2)
  
  


  push()
  scale(scaleFactor)
  stroke(0,255,0);
  line(near.x, near.y, near.z, Trav1.x, Trav1.y, Trav1.z)
  stroke(0,255,0);
line(Trav1.x, Trav1.y, Trav1.z, finalVector.x, finalVector.y, finalVector.z)
  stroke(0,255,0);
line(bump2.x, bump2.y, bump2.z, finalVector.x, finalVector.y, finalVector.z)
   stroke(0,255,0);
 line(bump2.x, bump2.y, bump2.z, TG.x, TG.y, TG.z)
    pop()
push()
 scale(scaleFactor)
  translate(Trav1.x, Trav1.y, Trav1.z)
  fill(0,0,255)
  noStroke()
  sphere(OMSize/2)
    pop()
  push()
 scale(scaleFactor)
  translate(finalVector.x, finalVector.y, finalVector.z)
  fill(0,0,255)
  noStroke()
  sphere(OMSize/2)
    pop()
  push()
 scale(scaleFactor)
  translate(bump2.x, bump2.y, bump2.z)
  fill(0,0,255)
  noStroke()
  sphere(OMSize/2)
    pop()
  
goto = str(items[0].goto);
  goto2 = str(items[1].goto);
  goto3 = str(items[2].goto);

  let distanceOM1st = side - near.dist(Trav1)
  let distanceStrafeBW = finalVector.dist(PC)
  let distanceFVbump2 = finalVector.dist(far) - finalVector.dist(bump2)
 
  let distancebump2PC = PC.dist(bump2)
  


  travelto1 = nfc(distanceOM1st, 1)
  travelto2 = nfc(distanceStrafeBW, 1)
  travelto3 = nfc(distanceFVbump2, 1)
  travelto4 = nfc(distancePCTG, 1)
  orbitpos = distancePCTG


  
}