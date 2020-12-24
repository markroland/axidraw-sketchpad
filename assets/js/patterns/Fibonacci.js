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

    // Base Shape (polygon)
    let base_shape = [];
    let polygon_theta = 0.0;
    let sides = 3;
    let polygon_radius = 0.02;
    let polygon_phase_offset = Math.PI / 2;
    for (let a = 0; a < sides; a++) {
      polygon_theta = (a/sides) * (2 * Math.PI);
      base_shape.push([
        polygon_radius * Math.cos(polygon_theta + polygon_phase_offset),
        polygon_radius * Math.sin(polygon_theta + polygon_phase_offset)
      ])
    }

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
      let rotated_shape = this.rotatePath(base_shape, shape_theta)

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

  /**
   * Scale Path
   * path A path array of [x,y] coordinates
   * scale A value from 0 to 1
   **/
  scalePath(path, scale) {
    return path.map(function(a){
      return [
        a[0] * scale,
        a[1] * scale
      ];
    });
  }

  /**
   * Translate a path
   **/
  translatePath(path, delta) {
    return path.map(function(a){
      return [
        a[0] + delta[0],
        a[1] + delta[1]
      ];
    });
  }

  /**
   * Rotate points x and y by angle theta about center point (0,0)
   * https://en.wikipedia.org/wiki/Rotation_matrix
   **/
  rotatePath(path, theta) {
    return path.map(function(a){
      return [
        a[0] * Math.cos(theta) - a[1] * Math.sin(theta),
        a[0] * Math.sin(theta) + a[1] * Math.cos(theta)
      ]
    });
  }
}