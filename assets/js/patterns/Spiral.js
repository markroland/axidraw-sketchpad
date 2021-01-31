/**
 * Spiral
 */
class Spiral {

  constructor() {

    this.key = "spiral";

    this.name = "Spiral";
  }

  /**
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    return [this.fermat()]

    // Calculate path
    let path = this.calc(
      0.0,
      0.0,
      30,
      20,
      3,
      0
    );

    return [path];
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  calc(start_r, start_theta, revolutions, sides, twist, noise) {

    // Set initial values
    var x;
    var y;
    var r;
    var theta;
    var max_r = 1.0;
    var start_x = start_r * max_r * Math.cos(start_theta * (Math.PI/180));
    var start_y = start_r * max_r * Math.sin(start_theta * (Math.PI/180));

    // Initialize shape path array
    var path = new Array();

    // Loop through revolutions
    var i_max = sides * revolutions;
    var theta_max = (2 * Math.PI) * revolutions;
    var theta_twist;
    for (var i = 0; i <= i_max; i++) {

      // Rotational Angle
      theta_twist = ((i_max - i) / i_max) * twist * (2 * Math.PI);
      theta = (i/i_max) * theta_max - theta_twist;

      // Increment radius
      r = max_r * (i/i_max);

      // Add noise, except to the beginning and end points
      if (noise > 0 && i > 0 && i < i_max) {
        r -= noise * Math.random();
      }

      // Convert polar position to rectangular coordinates
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      // Move the focus point of the spiral
      x += (-start_x * (i/i_max)) + start_x;
      y += (-start_y * (i/i_max)) + start_y;

      // Add coordinates to shape array
      path.push([x,y]);
    }

    return path;
  }

  fermat()
  {
    let revolutions = 28;

    // Set initial values
    var x;
    var y;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Controls "tightness" of spiral. 1.0 is a good value
    const pow_n = 1.0;

    // Radius of spiral
    let a = 28 / revolutions;

    // Arbitrarily scale down
    a = a / 150;

    // The number of "sides" to the circle.
    const steps_per_revolution = 60;

    // Loop through one revolution
    const t_min = revolutions * 0;
    const t_max = revolutions * (2 * Math.PI);
    const t_step = (t_max - t_min) / (revolutions * steps_per_revolution);

    // Negative Radius
    for (var t = t_max; t >= t_min; t -= t_step) {

      // Run the parametric equations
      x = a * Math.pow(t, pow_n) * Math.cos(t);
      y = a * Math.pow(t, pow_n) * Math.sin(t);

      // Add coordinates to shape array
      path.push([x,y]);
    }

    // Positive Radius
    for (var t = t_min; t <= t_max + t_step; t += t_step) {

      // Run the parametric equations
      x = -a * Math.pow(t, pow_n) * Math.cos(t);
      y = -a * Math.pow(t, pow_n) * Math.sin(t);

      // Add coordinates to shape array
      path.push([x,y]);
    }

    return path;
  }

}