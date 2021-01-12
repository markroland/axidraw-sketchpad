/*
 * Lissajous Curve
 * https://en.wikipedia.org/wiki/Lissajous_curve
*/
class Lissajous {

  constructor() {

    this.key = "lissajous";

    this.name = "Lissajous Curve";

    this.path_sampling_optimization = 2;
  }

  draw() {

    let paths = new Array();

    let width = 5/3;

    let path = this.calc(
      5/3,
      1 + Math.round(Math.random() * 99),
      1.0,
      1 + Math.round(Math.random() * 99),
      0,
      0
    );

    paths.push(path);

    return paths;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @return Array Path
   **/
  calc(A, a1, B, b1, phase, rotation) {

    // Set initial values
    var x;
    var y;
    var theta = 0.0;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Calculate the full period of the Lissajous curve
    // https://stackoverflow.com/questions/9620324/how-to-calculate-the-period-of-a-lissajous-curve
    let lissajous_period = 2 * Math.PI / this.greatest_common_divisor(a1, b1);

    // Set the steps per revolution. Oversample and small distances can be optimized out afterward
    let steps_per_revolution = 5000;

    // Loop through one revolution
    while (theta < lissajous_period) {

      // Rotational Angle (steps per rotation in the denominator)
      theta = (step/steps_per_revolution) * lissajous_period;

      // Run the parametric equations
      x = A * Math.cos(a1*theta + phase);
      y = B * Math.cos(b1*theta);

      // Add coordinates to shape array
      path.push([x,y]);

      // Increment iteration counter
      step++;
    }

    // Rotate
    if (rotation != 0) {
      path = path.map(function(element) {
        return this.rotationMatrix(element[0], element[1], rotation * (Math.PI/180))
      }, this);
    }

    return path;
  }

  /**
   * Calculate the Greatest Common Divisor (or Highest Common Factor) of 2 numbers
   *
   * https://en.wikipedia.org/wiki/Greatest_common_divisor
   * https://www.geeksforgeeks.org/c-program-find-gcd-hcf-two-numbers/
   */
   greatest_common_divisor(a, b) {
    if (b == 0) {
      return a;
    }
    return this.greatest_common_divisor(b, a % b);
  }

  /**
   * Rotate points x and y by angle theta about center point (0,0)
   * https://en.wikipedia.org/wiki/Rotation_matrix
   **/
  rotationMatrix(x, y, theta) {
      return [
        x * Math.cos(theta) - y * Math.sin(theta),
        x * Math.sin(theta) + y * Math.cos(theta)
      ];
  }
}