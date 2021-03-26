/**
 * Cassini Oval
 *
 * https://mse.redwoods.edu/darnold/math50c/CalcProj/sp07/ken/CalcPres.pdf
 * https://www.2dcurves.com/higher/highercc.html
 * https://mathworld.wolfram.com/CassiniOvals.html
 */
class CassiniOval {

  constructor() {

    this.key = "cassinioval";

    this.name = "Cassini Oval";

    this.constrain = false
  }

  /**
   * Draw path
   */
  draw(p5) {

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    let path = new Array();

    let segments = 120;

    let n = 2
    let a = 0.6;
    let b = 1;
    let r = 1;
    let increment = 0.04
    let sign = new Array();

    // b/a < 1
    //*
    // Set the +/- signs. Left lobe is first, Right lobe is second
    let lobe_signs = [
      [
        [-1, -1],
        [-1, +1]
      ],
      [
        [+1, -1],
        [+1, +1]
      ]
    ]
    for (let lobe = 0; lobe < 2; lobe++) {
      let sign = lobe_signs[lobe]
      for (b = 0.2; b < a; b += increment) {
        path = Array();
        for (let s = 0; s < sign.length; s++) {
          for (let i = -0.5 * segments; i < 0.5 * segments; i++) {
            let theta = (i/(0.5 * segments)) * 0.5 * Math.asin(Math.pow(b/a,2))

            // Reverse the direction of Theta in order to stich the lines together continuously
            if (s % 2 == 1) {
              theta = -1 * theta
            }

            // For values like b = 0.4 there is a floating-point math problem
            // in the form of negative exponents close to zero. This is solved
            // here by rounding everything under a threshold to zero.
            let radicand = Math.pow(b/a, 4) - Math.pow(Math.sin(n * theta),2)
            radicand = radicand < 0.000001 ? 0.0 : radicand

            r = sign[s][0] * a * Math.pow(
              Math.cos(n * theta)
              + sign[s][1] * Math.sqrt(radicand),
              1/n
            );

            let coordinates = PathHelp.polarToRect(r, theta);

            path.push(coordinates)
          }
        }

        // Rotate points to control the pen up/down position
        path = PathHelp.shiftPath(path, 0.5 * segments)

        // Close the shape with the first point
        path.push(path[0])

        paths.push(path)
      }
    }
    //*/

    // Lemniscate condition, b/a = 1
    // Other sign conditions yield imaginary numbers
    // Draw as a single continuous path
    //*
    b = a
    sign = [
      [-1, +1],
      [+1, +1]
    ]
    path = Array();
    for (let s = 0; s < sign.length; s++) {
      for (let i = -0.5 * segments; i < 0.5 * segments; i++) {
        let theta = (i/(0.5 * segments)) * 0.5 * Math.asin(Math.pow(b/a,2))

        // Reverse theta for 2nd, right lobe to draw a continuous line
        if (s == 1) {
          theta = -1 * theta;
        }

        r = sign[s][0] * a * Math.pow(
          Math.cos(n * theta) + sign[s][1] * Math.sqrt(Math.pow(b/a, 4) - Math.pow(Math.sin(n * theta),2)),
          1/n
        );
        let coordinates = PathHelp.polarToRect(r, theta);
        // coordinates = coordinates.map(x => x < 0.000001 ? 0.0 : x)
        path.push(coordinates)
      }
    }

    // Close the shape with the first point
    path.push(path[0])

    paths.push(path)
    //*/

    // b/a > 1
    //*
    for (b = a + increment; b < 2 * a; b += increment) {
      path = Array();
      for (let i = -0.5 * segments; i <= 0.5 * segments; i++) {
        let theta = ((i/segments) * Math.PI * 2)
        r = a * Math.pow(
          Math.cos(n * theta) + Math.sqrt(
            Math.pow(b/a, 4) - Math.pow(Math.sin(n * theta),2)
          ),
          1/n
        );
        let coordinates = PathHelp.polarToRect(r, theta);
        path.push(coordinates)
      }

      // Add some more points so the pen up position goes beyond the pen down position
      path = path.concat(path.slice(0, (0.5 * segments) + 1))

      paths.push(path)
    }
    //*/

    layers.push({
      "color": "black",
      "paths": paths
    })

    // console.log(layers)

    return layers;
  }

}