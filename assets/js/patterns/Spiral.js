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
    // return this.spiral('arithmetic');
    // return this.spiral('fermat');
    return this.spiral('hyperbolic');
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  arithmetic(start_r, start_theta, revolutions, sides, twist, noise) {

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
    let a = 1 / 150;

    // The number of "sides" to the circle.
    const steps_per_revolution = 60;

    // Loop through one revolution
    const t_min = revolutions * 0;
    const t_max = revolutions * (0.25 * Math.PI);
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

  /**
   * Hyperbolic Spiral
   * @param float "a" represents the distance from the center of the spiral to its asymptote
   * @param float "revolutions" represents the number of spiral revolutions
   * @param float An optional cutoff distance for the spiral "tail"
   * https://en.wikipedia.org/wiki/Hyperbolic_spiral
   */
  hyperbolic(a, revolutions, x_max = undefined) {

    let path = new Array();

    // Set the resolution of the line segments
    let segments_per_revolution = 60;

    // Set the max number of revolutions
    let t_max = segments_per_revolution * revolutions;

    for (let t = 1; t < t_max; t++) {

      // Set the rotational angle phi based on the iteration
      let phi = (1 - (t/t_max)) * (revolutions * 2 * Math.PI)

      // Calculate x and y points using the parametric equations
      let x = a * (Math.cos(phi)/phi);
      let y = a * (Math.sin(phi)/phi)

      // Add to the path
      path.push([x,y])

      // Stop early if the maximum X distance has been exceeded
      // The radius value (r = a/phi) could optionally be used as well;
      if (x > x_max) {

        // Interpolate Y-value at x_max
        y = path[path.length-2][1] +
          (path[path.length-1][1] - path[path.length-2][1])
          *
          (
            (x_max - path[path.length-2][0])
            /
            (path[path.length-1][0] - path[path.length-2][0])
          );

        path[path.length-1] = [x_max, y]

        break;
      }
    }

    return path;
  }

  spiral(type) {

    let layers = new Array();

    let paths = new Array()

    let path = new Array();

    switch(type) {
      case "arithmetic":
        path = this.arithmetic(
          0.0,
          0.0,
          30,
          20,
          3,
          0
        );
        break;
      case "hyperbolic":
        // path = this.hyperbolic(0.4, 5)
        path = this.hyperbolic(0.7, 0.8, 5/3)
        break;
      case "fermat":
        path = this.fermat()
        break;
      default:
        path = this.calc(
          0.0,
          0.0,
          30,
          20,
          3,
          0
        );
    }

    let PathHelp = new PathHelper;

    // path = PathHelp.rotatePath(path, Math.PI/2)

    // path = PathHelp.expandPath(path, 0.01, 0.01, 'round')

    // path = PathHelp.translatePath(path, [0.3, -0.4])

    paths.push(path);

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }
}