/**
 * Fibonacci
 */
class Fibonacci {

  constructor() {

    this.key = "fibonacci";

    this.name = "Fibonacci";

    this.constrain = false;
  }

  /**
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    // Calculate path
    let paths = this.calc();

    return paths;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  calc() {

    // Initialize shape path array
    var path = new Array();

    let PathHelp = new PathHelper;

    // Base Shape (polygon)
    // let base_shape = PathHelp.polygon(3, 0.02, Math.PI / 2);
    let base_shape = this.heart();
    base_shape = PathHelp.rotatePath(base_shape, Math.PI/2);
    base_shape = PathHelp.scalePath(base_shape, 0.001)

    // Position all Shapes
    let num_shapes = 200;
    let r = 0.0;
    let r_max = 1 // (5/3)
    let theta = 0.0;
    let x = 0.0;
    let y = 0.0;
    for (let i = 0; i < num_shapes; i++) {

      // Calculate point position in Polar coordinates
      // r = r_max * (i/num_shapes);
      r = (-1 + Math.exp(0.7*(i/num_shapes))) + 0.02;

      // Increment theta by the "Golden Angle"
      theta += (Math.PI * (3 - Math.sqrt(5)));

      // Convert to Rectangular coordinates
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      // Scale the shape
      //  + 0.005 * Math.exp((i/num_shapes))
      let resized_base_shape = PathHelp.scalePath(base_shape, Math.exp(2.2*(i/num_shapes)))

      // Rotate the shape
      let shape_theta = Math.atan2(y, x)
      // if (shape_theta < 0) {
      //   shape_theta = (2 * Math.PI) + shape_theta;
      // }
      let rotated_shape = PathHelp.rotatePath(resized_base_shape, shape_theta)

      // Build shape around point
      let shape = [];
      for (let a = 0; a < rotated_shape.length; a++) {
        shape.push([
          x + rotated_shape[a][0],
          y + rotated_shape[a][1]
        ])
      }

      // Add the shape to the path
      path.push(shape);
    }

    return path;
  }

  heart(a = 16, b = 13, c = 5, d = 2, e = 1) {

    let path = new Array();

    let i_max = 120;
    let x,y,theta;
    for (let i = 0; i < i_max; i++) {
      theta = (i/i_max) * Math.PI * 2;
      x = a * Math.pow(Math.sin(theta), 3);
      y = -1 * (b * Math.cos(theta) - c * Math.cos(2 * theta) - d * Math.cos(3 * theta) - e * Math.cos(4 * theta));
      path.push([x,y])
    }

    return path;
  }

}