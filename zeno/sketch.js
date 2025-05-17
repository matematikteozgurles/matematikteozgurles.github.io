let dotPos = 0;    // current position of the dot (0 to 1)
let target = 1;    // fixed target position (1)
let zoomBase = 1;  // base zoom level
let fractionSteps = []; // array to hold fractions for display

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  dotPos = 0;
  fractionSteps = [];
  textAlign(CENTER, CENTER);
  textFont('Segoe UI, Tahoma, Geneva, Verdana, sans-serif');
  textSize(16);
}

function draw() {
  background(34);

  // Smoothly move dot halfway towards target every frame
  dotPos += (target - dotPos) * 0.05;

  // Calculate zoom: more zoom as dotPos nears 1, but limited
  let zoom = map(1 - dotPos, 0, 1, 50, 1);
  zoom = constrain(zoom, 1, 50);

  // Coordinates for line start and end (fixed length)
  let lineStartX = width / 2 - 200;
  let lineEndX = width / 2 + 200;
  let lineY = height / 2;

  // Draw base line
  push();
  translate(width / 2, height / 2);
  scale(zoom);

  stroke(200);
  strokeWeight(2 / zoom);
  line(-200, 0, 200, 0);

  // Draw 0 and 1 labels
  noStroke();
  fill(200);
  textSize(16 / zoom);
  text("0", -200, 20 / zoom);
  text("1", 200, 20 / zoom);

  // Draw fractions from previous steps
  fill(150, 180, 255);
  noStroke();
  for (let i = 0; i < fractionSteps.length; i++) {
    let fracX = lerp(-200, 200, fractionSteps[i]);
    text(fractionSteps[i].toFixed(3), fracX, -20 / zoom);
  }

  // Draw the moving dot
  let dotX = lerp(-200, 200, dotPos);
  fill(255, 100, 100);
  noStroke();
  ellipse(dotX, 0, 12 / zoom, 12 / zoom);

  pop();

  // Store fractions as the dot moves past them (approx every 30 frames)
  if (frameCount % 30 === 0 && dotPos < 1) {
    // Calculate next fraction for the step: 1 - 1/(2^steps)
    let nextFraction = 1 - 1 / Math.pow(2, fractionSteps.length + 1);
    // Avoid duplicates due to float precision
    if (!fractionSteps.includes(nextFraction)) {
      fractionSteps.push(nextFraction);
    }
  }

  // Draw handle in bottom-right corner
  fill(200, 150);
  textSize(18);
  textAlign(RIGHT, BOTTOM);
  text("@matematikteozgurles", width - 15, height - 15);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
