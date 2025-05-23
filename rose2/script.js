let petals = [];
let fadeCheckbox, spinCheckbox, glowCheckbox;
let pulseCheckbox, floatCheckbox;
let fadeSelect;
let pauseButton, resumeButton;
let isPaused = false;
let drawing = false;
let maxTheta;

function setup() {
  createCanvas(800, 800);
  angleMode(RADIANS);
  colorMode(HSB, 360, 100, 100);
  background(0);

  pauseButton = createButton("Pause");
  pauseButton.mousePressed(() => isPaused = true);
  resumeButton = createButton("Resume");
  resumeButton.mousePressed(() => isPaused = false);

  createP("Number of Petals:");
  let petalCountSlider = createSlider(1, 6, 3, 1);
  petalCountSlider.input(() => createPetals(petalCountSlider.value()));
  createPetals(petalCountSlider.value());

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

  maxTheta = TWO_PI * 6;

  drawing = true;
}

function createPetals(count) {
  petals = [];
  for (let i = 0; i < count; i++) {
    petals.push({
      k: random(1, 10),
      a: random(100, 200),
      hueOffset: random(0, 360),
      theta: 0,
      points: []
    });
  }
  background(0);
  drawing = true;
}

function draw() {
  if (fadeCheckbox.checked()) {
    let speed = fadeSelect.value();
    let fadeAlpha = speed === "Slow" ? 0.03 : speed === "Medium" ? 0.1 : 0.3;
    background(0, fadeAlpha * 255);
  } else {
    background(0);
  }

  push();
  translate(width / 2, height / 2);
  if (spinCheckbox.checked()) {
    rotate(frameCount / 200.0);
  }

  for (let i = 0; i < petals.length; i++) {
    let p = petals[i];
    if (drawing && !isPaused && p.theta <= maxTheta) {
      let r = p.a * cos(p.k * p.theta);
      let x = r * cos(p.theta);
      let y = r * sin(p.theta);
      let hue = (map(p.theta, 0, maxTheta, 0, 360) + p.hueOffset) % 360;
      p.points.push({ x, y, hue });
      p.theta += 0.02;
    }

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
  }
  pop();

  for (let i = 0; i < petals.length; i++) {
    let p = petals[i];
    push();
    let formulaText = `r(θ) = ${p.a.toFixed(0)}·cos(${p.k.toFixed(2)}θ)`;
    let pulse = pulseCheckbox.checked() ? 1 + 0.05 * sin(frameCount * 0.1) : 1;
    let floatOffset = floatCheckbox.checked() ? 5 * sin(frameCount * 0.05 + i) : 0;
    translate(100, 30 + i * 25 + floatOffset);
    scale(pulse);
    textAlign(LEFT, CENTER);
    textSize(14);
    fill(255);
    noStroke();
    text(`Petal ${i + 1}: ` + formulaText, 0, 0);
    pop();
  }

  push();
  resetMatrix();
  textAlign(RIGHT, BOTTOM);
  textSize(12);
  fill(255, 100);
  text("@matematikteozgurles", width - 10, height - 10);
  pop();
        }
