let k = 0;
let running = false;
let step = 0.01;
let maxKSlider, speedSlider;
let startButton, stopButton, resetButton;
let fadeInCheckbox, fadeOutCheckbox;
let fadingOut = false;
let fadeAlpha = 255;

function setup() {
  createCanvas(600, 600);
  frameRate(30);
  textFont("monospace");

  // Buttons
  startButton = createButton('Start');
  startButton.position(10, height + 10);
  startButton.mousePressed(() => running = true);

  stopButton = createButton('Stop');
  stopButton.position(70, height + 10);
  stopButton.mousePressed(() => running = false);

  resetButton = createButton('Restart');
  resetButton.position(130, height + 10);
  resetButton.mousePressed(() => {
    k = 0;
    running = false;
    fadingOut = false;
    fadeAlpha = 255;
  });

  // Sliders
  maxKSlider = createSlider(10, 200, 100, 1);
  maxKSlider.position(220, height + 10);
  maxKSlider.style('width', '100px');

  speedSlider = createSlider(0.1, 5, 0.5, 0.1);
  speedSlider.position(330, height + 10);
  speedSlider.style('width', '80px');

  // Checkboxes
  fadeInCheckbox = createCheckbox('Fade In', true);
  fadeInCheckbox.position(420, height + 5);

  fadeOutCheckbox = createCheckbox('Fade Out', false);
  fadeOutCheckbox.position(500, height + 5);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  // Display equation and k info
  noStroke();
  fill(255);
  textAlign(CENTER);
  textSize(12);
  text("y = x^(2/3) + 0.9·sin(kx)·√(3 − x²)", 0, -height / 2 + 20);
  text("k = " + nf(k, 1, 2) + "   |   max k = " + maxKSlider.value() + "   |   speed = " + speedSlider.value(), 0, -height / 2 + 40);

  // Opacity control
  let alpha = 255;

  // Fade in
  if (fadeInCheckbox.checked()) {
    alpha *= constrain(map(k, 0, maxKSlider.value() / 2, 0, 1), 0, 1);
  }

  // Trigger fade out
  if (!running && k >= maxKSlider.value() && fadeOutCheckbox.checked()) {
    fadingOut = true;
  }

  if (fadingOut) {
    fadeAlpha -= 1.5; // slower fade
    fadeAlpha = max(fadeAlpha, 0);
    alpha *= fadeAlpha / 255;

    // Slight reverse of k during fade
    k -= 0.15;
    k = max(0, k);
  }

  // Draw heart
  stroke(180, 0, 60, alpha);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let x = -sqrt(3); x <= sqrt(3); x += step) {
    let y = pow(abs(x), 2 / 3) + 0.9 * sin(k * x) * sqrt(3 - x * x);
    let sx = x * 100;
    let sy = -y * 100;
    vertex(sx, sy);
  }
  endShape();

  // Signature
  resetMatrix();
  fill(255);
  textAlign(RIGHT, BOTTOM);
  textSize(12);
  text("@matematikteozgurles", width - 10, height - 10);

  // Animate k
  if (running && k < maxKSlider.value()) {
    k += speedSlider.value();
    if (k >= maxKSlider.value()) {
      k = maxKSlider.value();
      running = false;
    }
  }
}
