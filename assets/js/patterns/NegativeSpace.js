class NegativeSpace {

  constructor() {
    this.key = "negativespace";
    this.name = "Negative Space";
    this.title = "Negative Space Study"
    this.constrain = false
  }

  draw() {
    // return this.sketch1();
    return this.sketch2();
  }

  sketch1() {

    let PathHelp = new PathHelper;

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

    triangle = PathHelp.rotatePath(triangle, (Math.random() - 0.5) * Math.PI/6)

    let circle = new Object;
    circle.r = 0.25 + Math.random() * 0.5;
    circle.x = PathHelp.getRandom(-5/3 + circle.r, 5/3 - circle.r)
    circle.y = PathHelp.getRandom(-1 + circle.r, 1 - circle.r);

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

      let y = 2 * (i/num_lines) - 1;

      // Initialize intersection values
      min_int_x = null;
      max_int_x = null;

      // Left-most Point of horizontal line
      p1 = [min_x, y];

      // Right-most point of horizontal line
      p2 = [max_x, y];

      // Draw every other line straight through
      if (i % 2 == 1) {

        // Circle
        if (y >= circle.y - circle.r && y <= circle.y + circle.r) {
          paths.push([
            [circle.x - Math.sqrt(Math.pow(circle.r, 2) - Math.pow(circle.y - y, 2)), y],
            [circle.x + Math.sqrt(Math.pow(circle.r, 2) - Math.pow(circle.y - y, 2)), y]
          ])
        }

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
      let intersect_1 = PathHelp.intersect_point(p1,p2,triangle[0],triangle[1]);
      if (p1[1] >= triangle[0][1]) {
        paths.push([
          [intersect_1[0], p1[1]],
          p2
        ]);
      }

      // Side 2: Betwen 120 and 240 degrees
      let intersect_2 = PathHelp.intersect_point(p1,p2,triangle[1],triangle[2]);
      if (intersect_2[0] < min_int_x) {
        paths.push([
          p1,
          [intersect_2[0] , p1[1]]
        ]);
      }

      // Side 3: Between 240 and 360 degrees
      let intersect_3 = PathHelp.intersect_point(p1,p2,triangle[2],triangle[0]);
      if (p1[1] < triangle[0][1]) {
        paths.push([
          [intersect_3[0], p1[1]],
          p2
        ]);
      }

    }

    return paths;
  }

  sketch2() {

    let paths = new Array();

    let sine_wave = new Array();

    let wave_amplitude = 0.25

    let wave_periods = 1.5

    let i_max = 80;

    for (let i = 0; i < i_max; i++) {

      let x = (5/3) * ((i - i_max/2) / (i_max/2))

      let wave_y = wave_amplitude * Math.sin(wave_periods * (i/i_max) * 2 * Math.PI)

      paths.push([
        [x, -1],
        [x, wave_y - wave_amplitude]
      ])

      paths.push([
        [x, 1],
        [x, wave_y + wave_amplitude]
      ])

      sine_wave = sine_wave.concat([[x, wave_y]])

    }

    // paths.push(sine_wave)

    return paths;
  }
}