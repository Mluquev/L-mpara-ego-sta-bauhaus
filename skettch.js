class Lamparaegoistabauhaus {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  show() {
   // acá pegar todas las líneas que crean el dibujo que ya tienen
   const pupilOffsetX = sin(frameCount * 0.05) * 4;
  const pupilOffsetY = cos(frameCount * 0.05) * 2;

  fill(280, 200, 20);
  quad(340, 200, 130, 200, 200, 130, 270, 130);
  line(236, 200, 236, 400);

  fill(255, 255, 255);
  ellipse(236, 176, 40, 40);
  ellipse(236, 156, 40, 40);

  fill(0, 0, 0);
  ellipse(236 + pupilOffsetX, 186 + pupilOffsetY, 20, 20);
  }
  

}function setup() {
  createCanvas(640, 480);
  lamparaegoistabauhaus = new Lamparaegoistabauhaus (width /2 , height / 2, 100);
}
function draw() {
  background(100, 149, 237);
  lamparaegoistabauhaus .show();
}