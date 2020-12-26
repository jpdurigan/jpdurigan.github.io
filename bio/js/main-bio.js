// cria borda de blob em volta da foto

let centerPoint;
let circlePoints = [];
let offset = 0.0;
let GAP = 20;


function setup() {
  var canvas = createCanvas(300, 300);
  if (windowWidth < 700) {
    resizeCanvas(200, 200);
  }
  canvas.parent('p5-canvas');
  background(0);
  
  centerPoint = createVector(width / 2, height / 2);
  pointZero = createVector(width/2, GAP);
  radius = centerPoint.dist(pointZero);
  INCREMENT = TWO_PI / 8;
 
  stroke(255);
  currentAngle = 0
  while(currentAngle < TWO_PI) {
    newPosition = createVector(radius * sin(currentAngle), radius * cos(currentAngle));
    newPoint = new circlePoint(newPosition);
    circlePoints.push(newPoint);
    currentAngle += INCREMENT;
  }
}


function draw() {
  background(255);
  translate(centerPoint);
  noiseDetail(2, 0.2);
  
  circlePoints.forEach(e => e.update(offset));
  
  fill(0);
  stroke(0);

  for (var i = 0; i < circlePoints.length; i += 1) {
    curve(
      circlePoints[  i   % circlePoints.length].position.x,
      circlePoints[  i   % circlePoints.length].position.y,
      circlePoints[(i+1) % circlePoints.length].position.x,
      circlePoints[(i+1) % circlePoints.length].position.y,
      circlePoints[(i+2) % circlePoints.length].position.x,
      circlePoints[(i+2) % circlePoints.length].position.y,
      circlePoints[(i+3) % circlePoints.length].position.x,
      circlePoints[(i+3) % circlePoints.length].position.y
    );
  }
  
  beginShape();
  circlePoints.forEach(p => vertex(p.position.x, p.position.y));
  endShape(CLOSE);
  
  offset += 0.008;
}


function windowResized() {
    setup();
}


class circlePoint {
  constructor(initialPosition) {
    this.initialPosition = initialPosition;
    this.position = initialPosition;
  }
  
  update(t) {
    let pointNoise = noise(this.initialPosition.x + t, this.initialPosition.y + t)
    pointNoise = map(pointNoise, 0.0, 1.0, 0.85, 1.25);
    this.position = p5.Vector.mult(this.initialPosition, pointNoise);
  }
}