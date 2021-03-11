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
    // return this.sketch2();
    return this.offsetCurves();
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

  /*
   * [Parallel Curve](https://en.wikipedia.org/wiki/Parallel_curve)
   * [Tubular Neighborhood](https://en.wikipedia.org/wiki/Tubular_neighborhood)
   * https://medium.com/@all2one/computing-offset-curves-for-cubic-splines-d3f968e5a2e0
   */
  offsetCurves() {

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    // Set Control points. p1 and p4 are endpoints. p2 and p3 are control points
    let p1 = [-1, -0.5]
    let p2 = [-1.2, 0.3]
    let p3 = [1.1, 1.1]
    let p4 = [0.9, -0.6]

    // Draw Bezier Control bounds
    /*
    layers.push({
      "color": "cyan",
      "paths": [[p1, p2, p3, p4]]
    })
    //*/

    // Create curve
    let curve = PathHelp.cubicBezierPath(p1, p2, p3, p4, 60)

    // Draw curve
    layers.push({
      "color": "red",
      "paths": [curve]
    })

    // Draw parallel paths
    let num_parallels = 15
    let offset = (1/50)
    let parallel;
    let parallel_segment;
    parallel = new Array();
    parallel_segment = new Array();
    for (let o = 1; o < num_parallels; o++) {

      // Outer
      parallel = new Array();
      for (let i = 0; i < curve.length-1; i++) {
        parallel_segment = PathHelp.parallelPath(curve[i], curve[i+1], o * offset)
        parallel.push(parallel_segment[0])
      }

      // Push the last point
      parallel.push(parallel_segment[1])

      layers.push({
        "color": "blue",
        "paths": [parallel]
      })

      // ---

      // Inner
      //*
      parallel = new Array();
      for (let i = 0; i < curve.length-1; i++) {
        parallel_segment = PathHelp.parallelPath(curve[i], curve[i+1], o * -offset)
        parallel.push(parallel_segment[0])
      }
      // Push the last point
      parallel.push(parallel_segment[1])

      layers.push({
        "color": "green",
        "paths": [parallel]
      })
      //*/
    }

    return layers;
  }

}