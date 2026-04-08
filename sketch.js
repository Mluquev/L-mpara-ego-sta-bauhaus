function setup() {
  createCanvas(640, 480);

  background(200,0,200);
  
 fill(280,200,20)
  quad(340, 200, 130, 200, 200, 130, 270, 130);
  line(236,200,236,400);
  fill(255,255,255)
  ellipse(236, 176, 40, 40);
  
  describe('A white trapezoid with a black outline drawn on a gray canvas.');
}