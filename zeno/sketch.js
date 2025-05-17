let prevPos, nextPos, pos, t;
let step = 0;
let dt = 0.05;
let history = [];
let fractions = [];

function setup() {
  createCanvas(720, 1280);
  textFont('monospace');
  frameRate(30);
  prevPos = 0;
  nextPos = 0.5;
  pos = 0;
  t = 0;
  history.push(prevPos);
}

function draw() {
  background(0);
  pos = lerp(prevPos, nextPos, t);

  drawMainLine();
  drawDot();
  drawFractions();
  drawZoom();
  drawGraph();
  drawOverlay();

  t += dt;
  if (t >= 1) {
    t = 0;
    history.push(nextPos);
    step++;
    let n = Math.pow(2, step) - 1;
    let d = Math.pow(2, step);
    fractions.push({ value: nextPos, label: `${n}/${d}` });
    prevPos = nextPos;
    let rem = 1 - prevPos;
    if (rem > 1e-10) nextPos = prevPos + rem / 2;
  }
}

function drawMainLine() {
  let x1 = 80, x2 = width - 80, y = 200;
  stroke(255);
  line(x1, y, x2, y);
  fill(255);
  noStroke();
  textAlign(CENTER);
  text("0", x1 - 10, y + 20);
  text("1", x2 + 10, y + 20);

  stroke(180);
  for (let i = 0; i < history.length - 1; i++) {
    let a = map(history[i], 0, 1, x1, x2);
    let b = map(history[i + 1], 0, 1, x1, x2);
    line(a, y, b, y);
  }
}

function drawDot() {
  let x = map(pos, 0, 1, 80, width - 80);
  fill(0, 255, 0);
  noStroke();
  ellipse(x, 200, 20);
}

function drawFractions() {
  fill(200);
  noStroke();
  textAlign(CENTER);
  for (let f of fractions) {
    let x = map(f.value, 0, 1, 80, width - 80);
    text(f.label, x, 180);
  }
}

function drawZoom() {
  let zx = 110, zy = 330, zw = 500, zh = 160;
  let zoomFactor = 3;
  let rem = 1 - pos;
  let minX = max(0, 1 - zoomFactor * rem);
  let maxX = 1;
  let centerY = zy + zh / 2;

  stroke(255);
  noFill();
  rect(zx, zy, zw, zh);
  fill(255);
  noStroke();
  textAlign(CENTER);
  text("Dynamic Zoom", zx + zw / 2, zy - 10);
  text(nf(minX, 1, 5), zx - 10, zy + zh + 15);
  text("1", zx + zw + 10, zy + zh + 15);

  stroke(150);
  line(zx, centerY, zx + zw, centerY);

  for (let f of fractions) {
    if (f.value >= minX) {
      let fx = map(f.value, minX, maxX, zx, zx + zw);
      stroke(0, 255, 255);
      line(fx, centerY - 5, fx, centerY + 5);
      noStroke();
      fill(180);
      textAlign(CENTER);
      text(f.label, fx, centerY + 20);
    }
  }

  if (pos >= minX) {
    let dotX = map(pos, minX, maxX, zx, zx + zw);
    fill(0, 255, 0);
    noStroke();
    ellipse(dotX, centerY, 14);
  }
}

function drawGraph() {
  let gx = 80, gy = 550, gw = width - 160, gh = 160;
  stroke(255);
  noFill();
  rect(gx, gy, gw, gh);
  fill(255);
  noStroke();
  text("Position Over Time", gx + gw / 2, gy - 10);
  text("0", gx - 15, gy + gh);
  text("1", gx - 15, gy);

  stroke(0, 255, 255);
  noFill();
  beginShape();
  for (let i = 0; i < history.length; i++) {
    let x = map(i, 0, history.length - 1, gx, gx + gw);
    let y = map(history[i], 0, 1, gy + gh, gy);
    vertex(x, y);
  }
  let x = map(history.length, 0, history.length, gx, gx + gw);
  let y = map(pos, 0, 1, gy + gh, gy);
  vertex(x, y);
  endShape();
}

function drawOverlay() {
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(24);
  text("Zeno's Paradox", width / 2, 40);

  textSize(16);
  textAlign(LEFT);
  text("Step: " + step, 30, 80);
  text("pos = " + nf(pos, 1, 10), 30, 110);

  textAlign(RIGHT);
  textSize(18);
  text("@matematikteozgurles", width - 20, height - 30);
}
