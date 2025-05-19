let img;

let path = [];

let forier = [];

let time = 0;

let drawing = [];

let skipSlider;
let skipLabel;
let skip = 5; // lower = more detail, slower

function preload() {
  img = loadImage("ata.jpeg");
}

function setup() {
  createCanvas(img.width, img.height);

  img.loadPixels();

  skipSlider = createSlider(1, 20, 5, 1);

  skipSlider.position(10, img.height + 10);

  skipSlider.style("width", "200px");

  extractAndTransform(); // Custom function below

  // Create label

  skipLabel = createDiv(`Skip: ${skip}`);

  skipLabel.position(220, img.height + 5);

  skipLabel.style("font-family", "monospace");

  skipLabel.style("font-size", "16px");

  // extract dark pixels from image

  for (let y = 0; y < img.height; y += skip) {
    for (let x = 0; x < img.width; x += skip) {
      let i = (x + y * img.width) * 4;

      let r = img.pixels[i];

      let g = img.pixels[i + 1];

      let b = img.pixels[i + 2];

      let bright = (r + g + b) / 3;

      if (bright < 100) {
        // only dark areas

        path.push(new Complex(x - width / 2, y - height / 2));
      }
    }
  }

  path = sortPoints(path); // Optional: improves coherence

  fourier = dft(path);

  fourier.sort((a, b) => b.amp - a.amp);
}

function extractAndTransform() {
  skip = skipSlider.value();

  path = [];

  for (let y = 0; y < img.height; y += skip) {
    for (let x = 0; x < img.width; x += skip) {
      let i = (x + y * img.width) * 4;

      let r = img.pixels[i];

      let g = img.pixels[i + 1];

      let b = img.pixels[i + 2];

      let bright = (r + g + b) / 3;

      if (bright < 100) {
        path.push(new Complex(x - width / 2, y - height / 2));
      }
    }
  }

  path = sortPoints(path);

  fourier = dft(path);

  fourier.sort((a, b) => b.amp - a.amp);

  time = 0;

  drawing = [];
}

function draw() {
  background(255);

  translate(width / 2, height / 2);

  // If slider changed, re-extract

  let newSkip = skipSlider.value();

  if (newSkip !== skip) {
    skip = newSkip;
    skipLabel.html(`Skip: ${skip}`);
    extractAndTransform();
  }

  let v = epiCycles(0, 0, 0, fourier);

  drawing.unshift(v);

  beginShape();

  noFill();

  stroke(0);

  strokeWeight(1);

  for (let i = 0; i < drawing.length; i++) {
    vertex(drawing[i].x, drawing[i].y);
  }

  endShape();

  time += TWO_PI / fourier.length;

  if (time > TWO_PI) {
    time = 0;

    drawing = [];
  }
}

// ------------------ DFT Section ------------------

class Complex {
  constructor(re, im) {
    this.re = re;

    this.im = im;
  }

  add(c) {
    return new Complex(this.re + c.re, this.im + c.im);
  }

  mult(c) {
    return new Complex(
      this.re * c.re - this.im * c.im,

      this.re * c.im + this.im * c.re
    );
  }
}

function dft(x) {
  const X = [];

  const N = x.length;

  for (let k = 0; k < N; k++) {
    let sum = new Complex(0, 0);

    for (let n = 0; n < N; n++) {
      const phi = (TWO_PI * k * n) / N;

      const c = new Complex(cos(phi), -sin(phi));

      sum = sum.add(x[n].mult(c));
    }

    sum.re /= N;

    sum.im /= N;

    const freq = k;

    const amp = sqrt(sum.re * sum.re + sum.im * sum.im);

    const phase = atan2(sum.im, sum.re);

    X[k] = { re: sum.re, im: sum.im, freq, amp, phase };
  }

  return X;
}

function epiCycles(x, y, rotation, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;

    let prevy = y;

    let freq = fourier[i].freq;

    let radius = fourier[i].amp;

    let phase = fourier[i].phase;

    x += radius * cos(freq * time + phase + rotation);

    y += radius * sin(freq * time + phase + rotation);

    stroke(150, 100);

    noFill();

    ellipse(prevx, prevy, radius * 2);

    stroke(0);

    line(prevx, prevy, x, y);
  }

  return createVector(x, y);
}

// Optional: helps the animation be smoother

function sortPoints(points) {
  let sorted = [points[0]];

  let used = new Array(points.length).fill(false);

  used[0] = true;

  for (let i = 1; i < points.length; i++) {
    let last = sorted[sorted.length - 1];

    let closestIndex = -1;

    let closestDist = Infinity;

    for (let j = 0; j < points.length; j++) {
      if (!used[j]) {
        let d = dist(last.re, last.im, points[j].re, points[j].im);

        if (d < closestDist) {
          closestDist = d;

          closestIndex = j;
        }
      }
    }

    sorted.push(points[closestIndex]);

    used[closestIndex] = true;
  }

  return sorted;
}
