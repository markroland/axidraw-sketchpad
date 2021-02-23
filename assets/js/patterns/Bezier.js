/**
 * Bezier Quadratic
 */
class Bezier {

  constructor() {

    this.key = "bezier";

    this.name = "Bezier Curves";
  }

  /**
   * Draw path
   */
  draw(p5) {
    // this.p5Draw(p5, 30); return [];
    // return this.sketch1();
    return this.sketch2();
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

    let p1 = [-1, -0.5]
    let p2 = [-0.9, 0.3]
    let p3 = [1.1, 0.1]
    let p4 = [0.9, -0.6]

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

  sketch2() {

    let PathHelp = new PathHelper;

    let paths = new Array();

    let segmentWidth = 0.4;
    let centerPoint = [-5/3, 0]

    let p1, p2, p3, p4;

    for (let a = 0; a < 7; a++) {

      centerPoint[0] += segmentWidth

      // Anchor points
      if (a == 0) {
        p1 = [
          centerPoint[0] - segmentWidth/2,
          PathHelp.getRandom(0.0, 0.2)
        ]
      } else {
        p1 = p4
      }
      p4 = [
        centerPoint[0] + segmentWidth/2,
        PathHelp.getRandom(0.0, 0.2)
      ]

      // Control points
      p2 = [p1[0], p1[1]]
      p3 = [p4[0], p4[1]]

      // paths.push([p1, p2])
      // paths.push([p2, p3])
      // paths.push([p3, p4])

      // paths.push(
      //   PathHelp.cubicBezierPath(p1,p2,p3,p4,20)
      // );

      for (let i = 0; i < 20; i++) {

        // Adjust X components of control points
        p2[0] = p2[0] * 0.9
        p3[0] = p3[0] * 0.9

        // Adjust Y components of control points
        p2[1] = p2[1] + 0.05
        p3[1] = p3[1] + 0.05

        paths.push(
          PathHelp.cubicBezierPath(p1,p2,p3,p4,20)
        );

        paths.push(
          PathHelp.cubicBezierPath(
            p1,
            [p2[0], p2[1] - i * 2 * 0.05],
            [p3[0], p3[1] - i * 2 * 0.05],
            p4,
            20
          )
        );

        // Debugging
        // paths.push([p1, p2])
        // paths.push([p2, p3])
        // paths.push([p3, p4])

        // paths.push([p1, [p2[0], p2[1] - 0.1]])
        // paths.push([[p2[0], p2[1] - 0.1], [p3[0], p3[1] - 0.1]])
        // paths.push([[p3[0], p3[1] - 0.1], p4])
      }
    }

    return paths;
  }

}