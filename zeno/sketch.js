let previousPosition, targetPosition, currentPosition, progress;
let stepCount = 0;
let speed = 0.05;
let positionHistory = [];
let fractionLabels = [];

let playPauseButton, restartButton, speedSlider;
let isPaused = false;

const colors = {
  background: '#000000',
  line: '#ffffff',
  trail: '#888888',
  dot: '#00ff00',
  zoomDot: '#00ff00',
  fraction: '#cccccc',
  zoomFraction: '#00ffff',
  graphLine: '#00ffff',
  text: '#ffffff'
};

function setup() {
  createCanvas(720, 1280);
  frameRate(30);
  textFont('monospace');
  smooth();

  previousPosition = 0;
  targetPosition = 0.5;
  currentPosition = 0;
  progress = 0;
  positionHistory.push(previousPosition);

  createCustomUI();
}

function draw() {
  background(colors.background);
  speed = speedSlider.value();

  if (!isPaused) {
    currentPosition = lerp(previousPosition, targetPosition, progress);
    progress += speed;

    if (progress >= 1) {
      progress = 0;
      positionHistory.push(targetPosition);
      stepCount++;

      let numerator = Math.pow(2, stepCount) - 1;
      let denominator = Math.pow(2, stepCount);
      fractionLabels.push({
        value: targetPosition,
        label: `${numerator}/${denominator}`
      });

      previousPosition = targetPosition;
      let remaining = 1 - previousPosition;
      if (remaining > 1e-10) {
        targetPosition = previousPosition + remaining / 2;
      }
    }
  }

  drawMainLine();
  drawMovingDot();
  drawFractionLabels();
  drawZoomView();
  drawGraph();
  drawOverlayText();
}

function drawMainLine() {
  let x1 = 80, x2 = width - 80, y = 200;
  stroke(colors.line);
  line(x1, y, x2, y);
  fill(colors.text);
  noStroke();
  textAlign(CENTER);
  text("0", x1 - 10, y + 20);
  text("1", x2 + 10, y + 20);

  stroke(colors.trail);
  for (let i = 0; i < positionHistory.length - 1; i++) {
    let a = map(positionHistory[i], 0, 1, x1, x2);
    let b = map(positionHistory[i + 1], 0, 1, x1, x2);
    line(a, y, b, y);
  }
}

function drawMovingDot() {
  let x = map(currentPosition, 0, 1, 80, width - 80);
  fill(colors.dot);
  noStroke();
  ellipse(x, 200, 20);
}

function drawFractionLabels() {
  fill(colors.fraction);
  noStroke();
  textAlign(CENTER);
  for (let f of fractionLabels) {
    let x = map(f.value, 0, 1, 80, width - 80);
    text(f.label, x, 180);
  }
}

function drawZoomView() {
  let zx = 110, zy = 330, zw = 500, zh = 160;
  let zoomFactor = 3;
  let remaining = 1 - currentPosition;
  let minX = max(0, 1 - zoomFactor * remaining);
  let maxX = 1;
  let centerY = zy + zh / 2;

  stroke(colors.line);
  noFill();
  rect(zx, zy, zw, zh);
  fill(colors.text);
  noStroke();
  textAlign(CENTER);
  text("Dynamic Zoom", zx + zw / 2, zy - 10);
  text(nf(minX, 1, 5), zx - 10, zy + zh + 15);
  text("1", zx + zw + 10, zy + zh + 15);

  stroke(colors.line + '55');
  line(zx, centerY, zx + zw, centerY);

  for (let f of fractionLabels) {
    if (f.value >= minX) {
      let fx = map(f.value, minX, maxX, zx, zx + zw);
      stroke(colors.zoomFraction);
      line(fx, centerY - 5, fx, centerY + 5);
      noStroke();
      fill(colors.fraction);
      textAlign(CENTER);
      text(f.label, fx, centerY + 20);
    }
  }

  if (currentPosition >= minX) {
    let dotX = map(currentPosition, minX, maxX, zx, zx + zw);
    fill(colors.zoomDot);
    noStroke();
    ellipse(dotX, centerY, 14);
  }
}

function drawGraph() {
  let gx = 80, gy = 550, gw = width - 160, gh = 160;
  stroke(colors.line);
  noFill();
  rect(gx, gy, gw, gh);
  fill(colors.text);
  noStroke();
  text("Position Over Time", gx + gw / 2, gy - 10);
  text("0", gx - 15, gy + gh);
  text("1", gx - 15, gy);

  stroke(colors.graphLine);
  noFill();
  beginShape();
  for (let i = 0; i < positionHistory.length; i++) {
    let x = map(i, 0, positionHistory.length - 1, gx, gx + gw);
    let y = map(positionHistory[i], 0, 1, gy + gh, gy);
    vertex(x, y);
  }
  let x = map(positionHistory.length, 0, positionHistory.length, gx, gx + gw);
  let y = map(currentPosition, 0, 1, gy + gh, gy);
  vertex(x, y);
  endShape();
}

function drawOverlayText() {
  fill(colors.text);
  noStroke();
  textAlign(CENTER);
  textSize(24);
  text("Zeno's Paradox", width / 2, 40);

  textSize(16);
  textAlign(LEFT);
  text("Step: " + stepCount, 30, 80);
  text("pos = " + nf(currentPosition, 1, 10), 30, 110);

  textAlign(RIGHT);
  textSize(18);
  text("@matematikteozgurles", width - 20, height - 130);
}

function createCustomUI() {
  // Play/Pause Button
  playPauseButton = createButton('Pause');
  playPauseButton.position(30, height - 80);
  playPauseButton.mousePressed(() => {
    isPaused = !isPaused;
    playPauseButton.html(isPaused ? 'Play' : 'Pause');
  });

  // Restart Button
  restartButton = createButton('Restart');
  restartButton.position(140, height - 80);
  restartButton.mousePressed(() => {
    previousPosition = 0;
    targetPosition = 0.5;
    currentPosition = 0;
    progress = 0;
    stepCount = 0;
    positionHistory = [previousPosition];
    fractionLabels = [];
  });

  // Speed Slider
  createSpan('Speed: ').style('color', colors.text).position(260, height - 83);
  speedSlider = createSlider(0.001, 0.2, speed, 0.001);
  speedSlider.position(320, height - 80);
  speedSlider.style('width', '300px');

  // Shared Button Styling
  [playPauseButton, restartButton].forEach(btn => {
    btn.style('background-color', '#1e1e1e');
    btn.style('color', colors.text);
    btn.style('border', '1px solid #444');
    btn.style('padding', '10px 16px');
    btn.style('border-radius', '10px');
    btn.style('font-family', 'monospace');
    btn.style('font-size', '16px');
    btn.mouseOver(() => btn.style('background-color', '#333'));
    btn.mouseOut(() => btn.style('background-color', '#1e1e1e'));
  });
}
