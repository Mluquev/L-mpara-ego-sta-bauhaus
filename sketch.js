let video;
let camera;
let faceMesh;

let targetX = 0;
let targetY = 0;
let smoothX = 0;
let smoothY = 0;
let hasFace = false;

const trail = [];
const MAX_TRAIL_POINTS = 28;
const TRAIL_MIN_DISTANCE = 14;
const TRAIL_ADD_EVERY_N_FRAMES = 2;

const SMOOTHING = 0.18;

function setup() {
  createCanvas(windowWidth, windowHeight);

  targetX = width * 0.5;
  targetY = height * 0.5;
  smoothX = targetX;
  smoothY = targetY;

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  setupFaceMesh();
}

function draw() {
  background(200, 0, 350);

  if (hasFace) {
    smoothX = lerp(smoothX, targetX, SMOOTHING);
    smoothY = lerp(smoothY, targetY, SMOOTHING);
    maybeAddTrailPoint(smoothX, smoothY);
  }

  drawTrail();

  if (trail.length === 0) {
    drawLamp(smoothX, smoothY, 1, 255);
  }

  noStroke();
  fill(255);
  textSize(14);
  text('Mueve tu rostro para repetir el dibujo', 12, 24);

  if (!hasFace) {
    fill(255, 220, 220);
    text('Sin rostro detectado: estado congelado', 12, 46);
  }
}

function maybeAddTrailPoint(x, y) {
  if (frameCount % TRAIL_ADD_EVERY_N_FRAMES !== 0) {
    return;
  }

  if (trail.length > 0) {
    const last = trail[trail.length - 1];
    const d = dist(last.x, last.y, x, y);
    if (d < TRAIL_MIN_DISTANCE) {
      return;
    }
  }

  trail.push({ x, y });
  if (trail.length > MAX_TRAIL_POINTS) {
    trail.shift();
  }
}

function drawTrail() {
  for (let i = 0; i < trail.length; i++) {
    const point = trail[i];
    const t = (i + 1) / trail.length;
    const alpha = 70 + 185 * t;
    const lampScale = 0.68 + 0.32 * t;
    drawLamp(point.x, point.y, lampScale, alpha);
  }
}

function drawLamp(x, y, lampScale, alpha) {
  const pupilOffsetX = sin(frameCount * 0.05) * 4;
  const pupilOffsetY = cos(frameCount * 0.05) * 2;

  push();
  translate(x, y);
  scale(lampScale);

  stroke(0, alpha);
  strokeWeight(2);
  fill(255, 200, 20, alpha);
  quad(104, 0, -106, 0, -36, -70, 34, -70);
  line(0, 0, 0, 180);

  noStroke();
  fill(255, 255, 255, alpha);
  ellipse(0, -24, 40, 40);
  ellipse(0, -44, 40, 40);

  fill(0, 0, 0, alpha);
  ellipse(pupilOffsetX, -14 + pupilOffsetY, 20, 20);

  pop();
}

function setupFaceMesh() {
  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults(onFaceResults);

  camera = new Camera(video.elt, {
    onFrame: async () => {
      await faceMesh.send({ image: video.elt });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}

function onFaceResults(results) {
  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
    hasFace = false;
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];
  const nose = landmarks[1];

  hasFace = true;
  targetX = (1 - nose.x) * width;
  targetY = nose.y * height;
}

function windowResized() {
  const prevWidth = width;
  const prevHeight = height;

  resizeCanvas(windowWidth, windowHeight);

  const scaleX = prevWidth > 0 ? width / prevWidth : 1;
  const scaleY = prevHeight > 0 ? height / prevHeight : 1;

  targetX *= scaleX;
  targetY *= scaleY;
  smoothX *= scaleX;
  smoothY *= scaleY;

  for (const point of trail) {
    point.x *= scaleX;
    point.y *= scaleY;
  }
}
