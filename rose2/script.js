let petals = [];
let maxTheta;
let isPaused = false;
let drawing = false;
let fadeCheckbox, spinCheckbox, glowCheckbox;
let pulseCheckbox, floatCheckbox, fadeSelect;
let pauseButton, resumeButton, clearButton, restartButton;
let speedSlider, speedLabel;

function setup() {
  createCanvas(900, 600);
  angleMode(RADIANS);
  colorMode(HSB, 360, 100, 100);
  maxTheta = TWO_PI * 6;
  background(0);

  // Controls
  createP("Number of Roses:");
  let roseCountSlider = createSlider(1, 6, 3, 1);
  roseCountSlider.input(() => createPetals(roseCountSlider.value()));
  createPetals(3);

  createP("Animation Speed:");
  speedSlider = createSlider(0.01, 0.2, 0.02, 0.01);
  speedLabel = createDiv("Speed = 0.02");

  pauseButton = createButton("Pause");
  pauseButton.mousePressed(() => isPaused = true);

  resumeButton = createButton("Resume");
  resumeButton.mousePressed(() => isPaused = false);

  restartButton = createButton("Restart");
  restartButton.mousePressed(() => {
    for (let p of petals) {
      p.theta = 0;
      p.points = [];
    }
    drawing = true;
    background(0);
  });

  clearButton = createButton("Clear");
  clearButton.mousePressed(() => {
    drawing = false;
    background(0);
  });

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

  drawing = true;
}

function createPetals(count) {
  petals = [];
  selectAll('.sliderLabel').forEach(el => el.remove());
  selectAll('.kSlider').forEach(el => el.remove());

  for (let i = 0; i < count; i++) {
    let kLabel = createDiv(`Petal ${i + 1} - k:`).class('sliderLabel');
    let kSlider = createSlider(1, 10, random(2, 6), 0.1);
    kSlider.class('kSlider');

    petals.push({
      kSlider,
      kLabel,
      a: random(100, 160),
      theta: 0,
      points: [],
      hueOffset: random(0, 360),
    });
  }

  background(0);
  drawing = true;
}

function draw() {
  if (!drawing) return;

  backgroundFade();
  let step = speedSlider.value();
  speedLabel.html("Speed = " + step.toFixed(2));

  let cols = 3;
  let spacingX = width / cols;
  let spacingY = height / ceil(petals.length / cols);

  for (let i = 0; i < petals.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let cx = spacingX * (col + 0.5);
    let cy = spacingY * (row + 0.5);

    let p = petals[i];
    p.k = p.kSlider.value();
    p.kLabel.html(`Petal ${i + 1} - k = ${p.k.toFixed(2)}`);

    if (!isPaused && p.theta <= maxTheta) {
      let r = p.a * cos(p.k * p.theta);
      let x = r * cos(p.theta);
      let y = r * sin(p.theta);
      let hue = (map(p.theta, 0, maxTheta, 0, 360) + p.hueOffset) % 360;
      p.points.push({ x, y, hue });
      p.theta += step;
    }

    push();
    translate(cx, cy);
    if (spinCheckbox.checked()) rotate(frameCount / 200.0);

    noFill();
    beginShape();
    for (let pt of p.points) {
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

    drawFormulaLabel(cx, cy - spacingY / 2 + 20, p);
  }

  drawSignature();
}

function backgroundFade() {
  if (fadeCheckbox.checked()) {
    let speed = fadeSelect.value();
    let fadeAlpha = speed === "Slow" ? 0.03 : speed === "Medium" ? 0.1 : 0.3;
    background(0, fadeAlpha * 255);
  } else {
    background(0);
  }
}

function drawFormulaLabel(x, y, p) {
  push();
  let formula = `r(θ) = ${p.a.toFixed(0)}·cos(${p.k.toFixed(2)}θ)`;
  let pulse = pulseCheckbox.checked() ? 1 + 0.05 * sin(frameCount * 0.1) : 1;
  let floatOffset = floatCheckbox.checked() ? 5 * sin(frameCount * 0.05 + p.k) : 0;
  translate(x, y + floatOffset);
  scale(pulse);
  textAlign(CENTER, CENTER);
  textSize(14);
  fill(255);
  noStroke();
  text(formula, 0, 0);
  pop();
}

function drawSignature() {
  push();
  resetMatrix();
  textAlign(RIGHT, BOTTOM);
  textSize(12);
  fill(255, 100);
  text("@matematikteozgurles", width - 10, height - 10);
  pop();
}
