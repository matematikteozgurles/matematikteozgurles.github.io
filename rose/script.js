let kSlider, aSlider, drawButton;
let kLabel, aLabel;
let fadeCheckbox, spinCheckbox, glowCheckbox;
let pulseCheckbox, floatCheckbox;
let fadeSelect;
let pauseButton, resumeButton;
let isPaused = true;
let drawing = false;
let theta = 0;
let maxTheta;
let a, k;
let points = [];

function setup() {
  createCanvas(600, 600);
  angleMode(RADIANS);
  colorMode(HSB, 360, 100, 100);
  background(0);
  
  pauseButton = createButton("Pause");
  pauseButton.mousePressed(() => isPaused = true);
  resumeButton = createButton("Resume");
  resumeButton.mousePressed(() => isPaused = false);

  maxTheta = TWO_PI * 6;

  // Sliders and Labels
  createP("Petal factor (k):");
  kSlider = createSlider(1, 10, 4, 0.1);
  kLabel = createDiv("k = 4");

  createP("Radius (a):");
  aSlider = createSlider(50, 250, 150, 1);
  aLabel = createDiv("a = 150");

  // Checkboxes and Dropdowns
  fadeCheckbox = createCheckbox("Fade Away", false);
  fadeSelect = createSelect();
  fadeSelect.option("Slow");
  fadeSelect.option("Medium");
  fadeSelect.option("Fast");
  fadeSelect.selected("Medium");

  spinCheckbox = createCheckbox("Spin", false);
  glowCheckbox = createCheckbox("Glow Effect", false);
  pulseCheckbox = createCheckbox("Pulse Formula", false);
  floatCheckbox = createCheckbox("Float Formula", false);

  // Button
  drawButton = createButton("Draw from Center");
  drawButton.mousePressed(startDrawing);
}

function startDrawing() {
  background(0);
  theta = 0;
  points = [];
  a = aSlider.value();
  k = kSlider.value();
  drawing = true;
}

function draw() {
  // Update values
  a = aSlider.value();
  k = kSlider.value();
  kLabel.html("k = " + k);
  aLabel.html("a = " + a);

  // Background fade
  if (fadeCheckbox.checked()) {
    let speed = fadeSelect.value();
    let fadeAlpha = speed === "Slow" ? 0.03 : speed === "Medium" ? 0.1 : 0.3;
    background(0, fadeAlpha * 255);
  } else {
    background(0);
  }

  // Add new point
  if (drawing && !isPaused && theta <= maxTheta) {
    let r = a * cos(k * theta);
    let x = r * cos(theta);
    let y = r * sin(theta);
    let hue = map(theta, 0, maxTheta, 0, 360);
    points.push({ x, y, hue });
    theta += 0.02;
  } else if (drawing) {
    drawing = false;
  }

  // Draw the rose with transformations
  push();
  translate(width / 2, height / 2);
  if (spinCheckbox.checked()) {
    rotate(theta / 20);
  }

  noFill();
  beginShape();
  for (let pt of points) {
    if (glowCheckbox.checked()) {
      stroke(pt.hue, 80, 100, 80);
      strokeWeight(4);
      point(pt.x, pt.y);
      strokeWeight(1);
    }
    stroke(pt.hue, 80, 100);
    vertex(pt.x, pt.y);
  }
  endShape();
  pop();

  // Draw formula (on fixed screen position)
  push();
  let formulaText = `r(θ) = ${a} · cos(${k.toFixed(2)}θ)`;
  let pulse = pulseCheckbox.checked() ? 1 + 0.05 * sin(frameCount * 0.1) : 1;
  let floatOffset = floatCheckbox.checked() ? 5 * sin(frameCount * 0.05) : 0;
  translate(width / 2, 30 + floatOffset);
  scale(pulse);
  textAlign(CENTER, CENTER);
  textSize(16);
  fill(255);
  noStroke();
  text(formulaText, 0, 0);
  pop();

  // Draw handle
  push();
  resetMatrix();
  textAlign(RIGHT, BOTTOM);
  textSize(12);
  fill(255, 100);
  text("@matematikteozgurles", width - 10, height - 10);
  pop();
}
