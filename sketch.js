let video;
let camera;
let faceMesh;

let targetX = 236;
let targetY = 200;
let smoothX = 236;
let smoothY = 200;

const BASE_X = 236;
const BASE_Y = 200;

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  setupFaceMesh();
}

function draw() {
  background(200, 0, 350);

  smoothX = lerp(smoothX, targetX, 0.18);
  smoothY = lerp(smoothY, targetY, 0.18);

  drawLamp(smoothX - BASE_X, smoothY - BASE_Y);

  noStroke();
  fill(255);
  textSize(14);
  text('Mueve tu rostro para mover el dibujo', 12, 24);
}

function drawLamp(offsetX, offsetY) {
  const pupilOffsetX = sin(frameCount * 0.05) * 4;
  const pupilOffsetY = cos(frameCount * 0.05) * 2;

  push();
  translate(offsetX, offsetY);

  stroke(0);
  strokeWeight(2);
  fill(280, 200, 20);
  quad(340, 200, 130, 200, 200, 130, 270, 130);
  line(236, 200, 236, 400);

  fill(255, 255, 255);
  ellipse(236, 176, 40, 40);
  ellipse(236, 156, 40, 40);

  fill(0, 0, 0);
  ellipse(236 + pupilOffsetX, 186 + pupilOffsetY, 20, 20);

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
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];
  const nose = landmarks[1];

  targetX = (1 - nose.x) * width;
  targetY = nose.y * height;
}