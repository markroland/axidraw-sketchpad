class ShapeMorph {

  constructor() {

    this.key = "shapemorph";

    this.name = "Shape Morph";

    // Define the shape to spin

    // 60 works well across many divisors (shape sides)
    this.sides = 60;

    // Define shapes
    this.circle = this.circleShape(this.sides, 1.0);
    this.heart = this.heartShape(this.sides, 1.0);
    this.star = this.starShape(this.sides, 1.0);
    this.square = this.squareShape(this.sides, 1.0);

    this.path = [];
  }

  /**
   * Calculate coordinates for the shape
   *
   * @return Array Path
   **/
  calc(base_shape, end_shape, steps_per_revolution, revolutions, completion, twist) {

    // Set initial values
    var x;
    var y;
    let current_revolution;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    let growth_factor;
    let lerp_amount;

    // Theta values
    const max_t = revolutions * (2 * Math.PI);
    const min_t = (1.0 - completion) * max_t;
    let t = min_t;

    // Loop through revolutions
    while (t < max_t) {

      // Rotational Angle (steps per rotation in the denominator)
      t = (step/steps_per_revolution) * (2 * Math.PI) + min_t;

      // Calculate current rotation
      current_revolution = Math.floor(t/(2 * Math.PI));

      // Calculate x,y coordinates
      // TODO: http://www.gizma.com/easing/#quint2
      lerp_amount = (current_revolution/revolutions);
      x = (t/max_t) * this.lerp(base_shape[step % steps_per_revolution][0], end_shape[step % steps_per_revolution][0], lerp_amount);
      y = (t/max_t) * this.lerp(base_shape[step % steps_per_revolution][1], end_shape[step % steps_per_revolution][1], lerp_amount);

      // Rotate [x,y] coordinates around [0,0] by angle theta, and then append to path
      path.push(this.rotationMatrix(x, y, twist * t/steps_per_revolution));

      path.push([x,y]);

      // Increment iteration counter
      step++;
    }

    // Remove the last element of the path.
    /*
    I'm not sure why, but without this the last element is anchored at a point we don't want.
    There's probably a more elegant way to handle this in the loop above, but for now
    I'm going with this.
    */
    path.pop();

    return path;
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

  circleShape(array_size, radius) {

    let shape = [];

    for (var i = 0; i <= (array_size+0); i++) {
      shape.push([
        radius * Math.cos((i/array_size) * 2 * Math.PI),
        -radius * Math.sin((i/array_size) * 2 * Math.PI)
      ]);
    }

    return shape;
  }

  heartShape(array_size, radius) {

    let shape = [];

    let x, y, theta;

    for (var i = 0; i <= (array_size+0); i++) {
      theta = ((i/array_size) * (2 * Math.PI)) + 0.5*Math.PI;
      x = 10 * (16 * Math.pow(Math.sin(theta), 3));
      y = 10 * (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta));
      shape.push([x,y]);
    }

    return shape;
  }

  starShape(array_size, radius) {

    let shape = [];

    let x, y, theta, i_radius;

    var star_points = 5;
    var points_per_side = (array_size / star_points);
    var minimum_radius = 0.4 * radius;

    for (var i = 0; i <= array_size; i++) {
      theta = (i/array_size) * (2 * Math.PI);

      if (i % points_per_side == 0) {
        // Star point (maximum)
        i_radius = radius;
      // } else if ((i + 6) % (array_size / star_points) == 0) {
      } else if (i % (points_per_side/2) == 0) {
        // Star inner minimum
        i_radius = minimum_radius;
      } else if (i % points_per_side < (points_per_side/2)) {
        // Descend from point to anti-point
        i_radius = radius - (((i % (points_per_side/2)) / (points_per_side/2)) * (radius - minimum_radius));
      } else {
        // Ascend from anti-point to point
        i_radius = (minimum_radius) + (((i % (points_per_side/2)) / (points_per_side/2)) * (radius - (minimum_radius)));
      }

      x = i_radius * Math.cos(theta);
      y = -i_radius * Math.sin(theta);

      shape.push([x,y]);
    }

    return shape;
  }

  lerp(beginning, end, percent) {
    return beginning + (end - beginning) * percent;
  }

  // TODO: Re-write this to go counter-clockwise
  squareShape(array_size, radius) {

    // Construct array for Starting Shape (Square)
    // Middle right side to bottom right corner

    let i_max = array_size/8;

    let shape = [];

    for (var i = 0; i < i_max; i++) {
      shape.push([
        radius,
        -((i/i_max) * radius),
      ]);
    }

    // bottom right corner to bottom left corner
    i_max = array_size/4;
    for (var i = 0; i < i_max; i++) {
      shape.push([
        radius - ((i/i_max) * (2 * radius)),
        -radius
      ]);
    }

    // bottom left corner to top left corner
    i_max = array_size/4;
    for (var i = 0; i < i_max; i++) {
      shape.push([
        -radius,
        -radius + ((i/i_max) * (2 * radius)),
      ]);
    }

    // top left corner to top right corner
    i_max = array_size/4;
    for (var i = 0; i < i_max; i++) {
      shape.push([
        -radius + ((i/i_max) * (2 * radius)),
        radius
      ]);
    }

    // top right corner to middle right side
    i_max = array_size/8;
    for (var i = 0; i < i_max; i++) {
      shape.push([
        radius,
        radius - ((i/i_max) * radius),
      ]);
    }

    shape.push([radius,0]);

    return shape;
  }
}