function trialiterate() {

  //planet center
  x0 = 0;
  y0 = 0;
  z0 = 0;
  //OM1
  x1 = 0;
  y1 = -distOMPC
  z1 = 0;
  //OM2
  x2 = 0;
  y2 = distOMPC;
  z2 = 0;
  //OM3
  x3 = 0;
  y3 = 0;
  z3 = distOMPC;
  //OM4
  x4 = 0;
  y4 = 0;
  z4 = -distOMPC;
  //OM5
  x5 = -distOMPC;
  y5 = 0;
  z5 = 0;
  //OM6
  x6 = distOMPC;
  y6 = 0;
  z6 = 0;
 

  ex1 = x3 - x6
  ey1 = y3 - y6
  ez1 = z3 - z6
  h = sqrt(ex1 * ex1 + ey1 * ey1 + ez1 * ez1)

  ex1 = ex1 / h
  ey1 = ey1 / h
  ez1 = ez1 / h

  i = ex1 * (x1 - x6) + ey1 * (y1 - y6) + ez1 * (z1 - z6)

  ex2 = x1 - x6 - i * ex1
  ey2 = y1 - y6 - i * ey1
  ez2 = z1 - z6 - i * ez1
  t = sqrt(ex2 * ex2 + ey2 * ey2 + ez2 * ez2)

  ex2 = ex2 / t
  ey2 = ey2 / t
  ez2 = ez2 / t

  j = ex2 * (x1 - x6) + ey2 * (y1 - y6) + ez2 * (z1 - z6)

  ex3 = ey1 * ez2 - ez1 * ey2
  ey3 = ez1 * ex2 - ex1 * ez2
  ez3 = ex1 * ey2 - ex2 * ey1

  u = (dOM6 * dOM6 - dOM3 * dOM3 + h * h) / (2 * h)
  v = (dOM6 * dOM6 - dOM1 * dOM1 + i * i + j * j - 2 * i * u) / (j * 2)
  w = sqrt((dOM6 * dOM6 - (u * u) - (v * v)))


  xb = x6 + u * ex1 + v * ex2 + w * ex3;
  yb = y6 + u * ey1 + v * ey2 + w * ey3;
  zb = z6 + u * ez1 + v * ez2 + w * ez3;

  xa = x6 + u * ex1 + v * ex2 - w * ex3;
  ya = y6 + u * ey1 + v * ey2 - w * ey3;
  za = z6 + u * ez1 + v * ez2 - w * ez3;

  let distmn = dist(0, 0, 0, xa, ya, za)
  let distm = dist(0, 0, 0, xb, yb, zb)

  aaa = abs(distmn - discriminate);
  bbb = abs(distm - discriminate)
   console.log(discriminate)

  if (aaa < bbb) {
    xmn = xa
    ymn = ya
    zmn = za
  } else {
    xmn = xb
    ymn = yb
    zmn = zb
  }
  
 
  
  if (customCoordsinput == true) {
    xmn = customx
    ymn = customy
    zmn = customz
   
    displayCoords = false
    if (displayCoords === false) {
      displayCoords = true

    } else {
      displayCoords = false

    }
  }
  
 if (abs(xmn) == abs(ymn) && abs(ymn) == abs(zmn)){
  
  ymn = ymn+".1"
  
  }

}