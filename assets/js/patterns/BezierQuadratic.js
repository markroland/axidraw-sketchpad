/**
 * Bezier Quadratic
 */
class BezierQuadratic {

  constructor() {

    this.key = "bezierquadratic";

    this.name = "Bezier Quadratic";
  }

  /**
   * Draw path
   */
  draw(p5) {
    // this.p5Draw(p5, 30); return [];
    return this.sketch1();
  }

  p5Draw(p5, segments) {

    let margin = 24;

    // Grid. This is just leftover code
    /*
    let xc = 30;
    let yc = 20;
    for (let x = 1; x < xc; x++) {
      p5.line((x/xc) * (p5.width - margin * 2) + margin, margin, (x/xc) * (p5.width - margin * 2) + margin, p5.height - margin)
    }
    for (let y = 1; y < yc; y++) {
      p5.line(margin, (y/yc) * (p5.height - margin * 2) + margin, p5.width - margin, (y/yc) * (p5.height - margin * 2) + margin)
    }
    //*/

    p5.push();
    p5.translate(p5.width/2, p5.height/2)
    let amount = segments;
    let size_y = p5.height/2 - margin;
    // let size_x = p5.width/2 - margin;
    let size_x = size_y;
    for (let a = 0; a < amount; a++) {
      p5.line(0, (1 - (a/amount)) * size_y, (a/amount) * size_x, 0)
    }
    for (let a = 0; a < amount; a++) {
      p5.line(0, (1 - (a/amount)) * size_y, -(a/amount) * size_x, 0)
    }
    for (let a = 0; a <= amount; a++) {
      p5.line(0, -(1 - (a/amount)) * size_y, -(a/amount) * size_x, 0)
    }
    for (let a = 0; a <= amount; a++) {
      p5.line(0, -(1 - (a/amount)) * size_y, (a/amount) * size_x, 0)
    }
    p5.pop();

    return [];
  }

  sketch1() {

    let PathHelp = new PathHelper;

    let paths = new Array();

    let p1 = [-1, 0.5]
    let p2 = [-0.9, -0.3]
    let p3 = [0.7, -0.1]
    let p4 = [0.9, 0.3]

    paths.push(
      PathHelp.quadraticBezierPath(p1,p2,p3,20)
    );

    paths.push(
      PathHelp.cubicBezierPath(p1,p2,p3,p4,20)
    );

    paths.push([p1, p2])
    paths.push([p2, p3])
    paths.push([p3, p4])

    return paths;
  }

}