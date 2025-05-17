let x = 0;
let step = 0;
let dotPath = [];
let zoomScale = 1;
let zoomOffset = 0;

function setup() {
  createCanvas(720, 1280); // Reel-friendly dimensions (9:16)
  frameRate(1); // 1 step per second for clear visualization
}

function draw() {
  background(255);
  stroke(0);
  strokeWeight(4);

  // Draw the main line from 0 to 1
  let startX = 100;
  let endX = width - 100;
  let lineY = height / 3;
  line(startX, lineY, endX, lineY);

  // Update dot position
  x = x + (1 - x) / 2;
  dotPath.push(x);

  // Draw all past positions
  fill(255, 0, 0);
  for (let i = 0; i < dotPath.length; i++) {
    let px = lerp(startX, endX, dotPath[i]);
    circle(px, lineY, 20);

    // Fraction label
    if (i < 6) {
      let frac = `${Math.pow(2, i + 1) - 1}/${Math.pow(2, i + 1)}`;
      noStroke();
      fill(0);
      textSize(16);
      text(frac, px - 20, lineY - 15);
    }
  }

  // --- Zoom window ---
  push();
  let zoomW = width * 0.8;
  let zoomH = 200;
  let zoomX = width * 0.1;
  let zoomY = height * 0.65;

  stroke(0);
  noFill();
  rect(zoomX, zoomY, zoomW, zoomH);

  // Increase zoom as x approaches 1
  zoomScale *= 1.15;
  zoomOffset = lerp(startX, endX, x) - zoomW / (2 * zoomScale);

  for (let i = 0; i < dotPath.length; i++) {
    let px = lerp(startX, endX, dotPath[i]);
    let zx = (px - zoomOffset) * zoomScale;
    if (zx > zoomX && zx < zoomX + zoomW) {
      fill(255, 0, 0);
      circle(zx, zoomY + zoomH / 2, 20);

      // Dynamic label
      if (i < 6) {
        let frac = `${Math.pow(2, i + 1) - 1}/${Math.pow(2, i + 1)}`;
        noStroke();
        fill(0);
        textSize(16);
        text(frac, zx - 20, zoomY + zoomH / 2 - 25);
      }
    }
  }
  pop();
}
