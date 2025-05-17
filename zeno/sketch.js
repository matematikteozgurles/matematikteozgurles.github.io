let dotPos = 0;
let target = 1;
let steps = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  dotPos = 0;
  steps = 0;
}

function draw() {
  background(34);

  // Zoom calculation: zoom in more as dotPos approaches 1
  let zoom = map(1 - dotPos, 0, 1, 10, 1);
  zoom = constrain(zoom, 1, 50);

  // Draw base line (from 0 to 1) horizontally centered
  push();
  translate(width / 2, height / 2);
  scale(zoom, zoom);

  stroke(200);
  strokeWeight(2 / zoom);
  line(0, 0, 400, 0);

  // Draw the 0 and 1 marks and labels
  strokeWeight(1 / zoom);
  fill(200);
  textSize(16 / zoom);
  textAlign(CENTER, BOTTOM);
  text("0", 0, 15 / zoom);
  text("1", 400, 15 / zoom);

  // Draw the moving dot
  let dotX = 400 * dotPos;
  fill(255, 100, 100);
  noStroke();
  ellipse(dotX, 0, 12 / zoom, 12 / zoom);

  pop();

  // Update dot position every 30 frames (1 sec)
  if (frameCount % 30 === 0) {
    dotPos = dotPos + (target - dotPos) / 2;
    steps++;
  }
}
