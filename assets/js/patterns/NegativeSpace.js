class NegativeSpace {
  draw() {

    // Create paths array to return
    let paths = new Array();

    let max_x = 5/3;
    let min_x = -5/3;
    let min_int_x;
    let max_int_x;

    // Triangle
    let triangle = new Array();
    for (let i = 0; i < 3; i++) {
      triangle.push(
        [
          (0.5 + Math.random()/2) * Math.cos(i/3 * Math.PI * 2),
          (0.5 + Math.random()/2) *  Math.sin(i/3 * Math.PI * 2)
        ]
      );
    }
    triangle.push(triangle[0]);

    triangle = this.rotatePath(triangle, (Math.random() - 0.5) * Math.PI/6)

    // Define function to extract column from multidimensional array
    const arrayColumn = (arr, n) => arr.map(a => a[n]);

    let x_coordinates = arrayColumn(triangle, 0);
    let y_coordinates = arrayColumn(triangle, 1);

    let triangle_min_x = Math.min(...x_coordinates)
    let triangle_max_x = Math.max(...x_coordinates)
    let triangle_min_y = Math.min(...y_coordinates)
    let triangle_max_y = Math.max(...y_coordinates)

    let num_lines = 80;
    let p1,p2
    for(let i = 0; i <= num_lines; i++) {

      // Initialize intersection values
      min_int_x = null;
      max_int_x = null;

      // Left-most Point of horizontal line
      p1 = [min_x, 2 * (i/num_lines) - 1];

      // Right-most point of horizontal line
      p2 = [max_x, 2 * (i/num_lines) - 1];

      // Draw every other line straight through
      if (i % 2 == 1) {
        paths.push([p1,p2]);
        continue;
      }

      // No intersection betweeen line and triangle, so draw entire line
      if (p1[1] > triangle_max_y || p1[1] < triangle_min_y) {
        paths.push([p1,p2]);
        continue;
      }

      // Calculate point of intersection between horizontal line "AB"
      // and each side of the triangle. Remember, the coordinate system
      // is the Processing coordinates system (positive is down)

      // Side 1: Betwen 0 and 120 degrees
      let intersect_1 = this.intersect_point(p1,p2,triangle[0],triangle[1]);
      if (p1[1] >= triangle[0][1]) {
        paths.push([
          [intersect_1[0], p1[1]],
          p2
        ]);
      }

      // Side 2: Betwen 120 and 240 degrees
      let intersect_2 = this.intersect_point(p1,p2,triangle[1],triangle[2]);
      if (intersect_2[0] < min_int_x) {
        paths.push([
          p1,
          [intersect_2[0] , p1[1]]
        ]);
      }

      // Side 3: Between 240 and 360 degrees
      let intersect_3 = this.intersect_point(p1,p2,triangle[2],triangle[0]);
      if (p1[1] < triangle[0][1]) {
        paths.push([
          [intersect_3[0], p1[1]],
          p2
        ]);
      }

    }

    return paths;
  }

  // Copied from https://editor.p5js.org/mwburke/sketches/h1ec1s6LG
  intersect_point(p1, p2, p3, p4) {
    const ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) -
      (p4[1] - p3[1]) * (p1[0] - p3[0])) /
      ((p4[1] - p3[1]) * (p2[0] - p1[0]) -
      (p4[0] - p3[0]) * (p2[1] - p1[1]));

    const ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) -
      (p2[1] - p1[1]) * (p1[0] - p3[0])) /
      ((p4[1] - p3[1]) * (p2[0] - p1[0]) -
      (p4[0] - p3[0]) * (p2[1] - p1[1]));

    const x = p1[0] + ua * (p2[0] - p1[0]);
    const y = p1[1] + ua * (p2[1] - p1[1]);

    return [x, y]
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