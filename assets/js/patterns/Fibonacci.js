/**
 * Fibonacci
 */
class Fibonacci {

  constructor() {

    this.key = "fibonacci";

    this.name = "Fibonacci";
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
    let base_shape = PathHelp.polygon(3, 0.02, Math.PI / 2);

    // Position all Shapes
    let num_shapes = 800;
    let r = 0.0;
    let theta = 0.0;
    let x = 0.0;
    let y = 0.0;
    for (let i = 0; i < num_shapes; i++) {

      // Calculate point position in Polar coordinates
      r = (i/num_shapes);
      theta += (Math.PI * (3 - Math.sqrt(5)));

      // Convert to Rectangular coordinates
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      // Rotate the shape
      let shape_theta = Math.atan2(y, x)
      // if (shape_theta < 0) {
      //   shape_theta = (2 * Math.PI) + shape_theta;
      // }
      let rotated_shape = PathHelp.rotatePath(base_shape, shape_theta)

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

}