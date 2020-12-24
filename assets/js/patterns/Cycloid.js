/**
 * Cycloid
 */
class Cycloid {

  constructor() {

    this.key = "cycloid";

    this.name = "Cycloid";

  }

  /**
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    // Calculate the path
    let path = this.calc(
      29,
      -50,
      31
    );

    return [path];
  }

  /**
   * Calculate coordinates for a Cycloid
   *
   * http://xahlee.info/SpecialPlaneCurves_dir/EpiHypocycloid_dir/epiHypocycloid.html
   **/
  calc(radius_a, radius_b, arm_length)
  {
    // Set initial values
    var x;
    var y;
    var theta = 0;

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter
    var step = 0;

    // Set the step multiplication factor. A value of 1 will increase theta
    // by 1-degree. A value of 10 will result in theta increasing by
    // 10-degrees for each drawing loop. A larger number results in fewer
    // instructions (and a faster drawing), but at lower curve resolution.
    // A small number has the best resolution, but results in a large instruction
    // set and slower draw times. 10 seems to be a good balance.
    var step_scale = 10;

    // Calculate the period of the Cycloid
    // It is 2-Pi times the result of the rolling circle's radius divided by the
    // Greatest Common Divisor of the two circle radii.
    // https://www.reddit.com/r/math/comments/27nz3l/how_do_i_calculate_the_periodicity_of_a/
    var cycloid_period = Math.abs(radius_b / this.greatest_common_divisor(parseInt(radius_a), parseInt(radius_b))) * (2 * Math.PI);

    // Continue as long as the design stays within bounds of the plotter
    while (theta < cycloid_period) {

      // Calculate theta offset for the step
      theta = this.degrees_to_radians(step_scale * step);

      // Cycloid parametric equations
      x = (radius_a + radius_b) * Math.cos(theta) + arm_length * Math.cos(((radius_a + radius_b)/radius_b) * theta);
      y = (radius_a + radius_b) * Math.sin(theta) + arm_length * Math.sin(((radius_a + radius_b)/radius_b) * theta);

      // Normalize (I'm not 100% sure this is correct)
      x = x / (arm_length + Math.abs(radius_a + radius_b));
      y = y / (arm_length + Math.abs(radius_a + radius_b));

      // Add coordinates to shape array
      path.push([x,y]);

      // Increment iteration counter
      step++;
    }

    return path;
  }

  degrees_to_radians(degrees)
  {
    var pi = Math.PI;
    return degrees * (Math.PI/180);
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
}