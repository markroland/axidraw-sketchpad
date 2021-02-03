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
          Math.random() * Math.cos(i/3 * Math.PI * 2),
          Math.random() * Math.sin(i/3 * Math.PI * 2)
        ]
      );
    }
    triangle.push(triangle[0]);
    // paths.push(triangle);

    // Define function to extract column from multidimensional array
    const arrayColumn = (arr, n) => arr.map(a => a[n]);

    let x_coordinates = arrayColumn(triangle, 0);
    let y_coordinates = arrayColumn(triangle, 1);

    let triangle_min_x = Math.min(...x_coordinates)
    let triangle_max_x = Math.max(...x_coordinates)
    let triangle_min_y = Math.min(...y_coordinates)
    let triangle_max_y = Math.max(...y_coordinates)

    // Debuging
    // console.log(triangle, x_coordinates, triangle_min_x)

    let num_lines = 60;
    let p1,p2
    for(let i = 0; i <= num_lines; i++) {

      // Set intersection values to a maximum
      min_int_x = null;
      max_int_x = null;

      // Left-most Point
      p1 = [min_x, 2 * (i/num_lines) - 1];

      // Right-most point
      p2 = [max_x, 2 * (i/num_lines) - 1];

      // No intersection betweeen line and triangel, so draw entire line
      //*
      if (p1[1] > triangle_max_y || p1[1] < triangle_min_y) {
        paths.push([p1,p2]);
        continue;
      }
      //*/

      // Calculate point of intersection between horizontal line AB
      // and each side of the triangle

      let intersect_1 = this.intersect_point(p1,p2,triangle[0],triangle[1]);
      // if (intersect_1[0] < min_int_x && intersect_1[0] > min_x) {
      //   min_int_x = intersect_1[0]
      // }
      // if (intersect_1[0] > max_int_x && intersect_1[0] < max_x) {
      //   max_int_x = intersect_1[0]
      // }
      // console.log(p1[1], triangle[0][1]);
      // Remember, coordinate system is the Processing coordinates
      if (p1[1] >= triangle[0][1]) {
        paths.push([
          [intersect_1[0], p1[1]],
          p2
        ]);
      }

      // Side 2: works
      let intersect_2 = this.intersect_point(p1,p2,triangle[1],triangle[2]);
      if (intersect_2[0] < min_int_x) {
        min_int_x = intersect_2[0]
      }
      // if (intersect_2[0] > max_int_x) {
      //   max_int_x = intersect_2[0]
      // }
      paths.push([
        p1,
        [min_int_x , p1[1]]
      ]);

      // Side 3
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

}