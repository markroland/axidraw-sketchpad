class PathHelper {

  /**
   * https://www.w3schools.com/js/js_random.asp
   */
  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  getRandom(min, max) {
    return Math.random() * (max - min) + min
  }

  map (value, in_min, in_max, out_min, out_max) {
    // Shift negative values up into positive range
    if (in_min < 0 || in_max < 0) {
      in_max = in_max + -in_min
      value = value + -in_min
      in_min = in_min + -in_min
    }
    return out_min + (out_max - out_min) * ((value - in_min) / (in_max - in_min))
  }

  /**
   * Linear Interpolate between two points
   **/
  lerp(beginning, end, percent) {
    return beginning + (end - beginning) * percent;
  }

  polygon(sides, length, rotation = 0)
  {
    let polygon = new Array();
    let polygon_theta = 0.0;
    for (let a = 0; a <= sides; a++) {
      polygon_theta = (a/sides) * (2 * Math.PI);
      polygon.push([
        length * Math.cos(polygon_theta + rotation),
        length * Math.sin(polygon_theta + rotation)
      ])
    }
    return polygon;
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

  distance(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
  }

  perpendicularPath(p1, p2) {

    // Slope "m"
    let m = (p2[1] - p1[1]) / (p2[0] - p1[0])

    // Y-intercept "b"
    let b = p1[1] - m * p1[0]

    // let distance = this.distance(p1, p2);

    // Calculate slope and intercept of perpendicular line
    let m_perp = -1/m;
    let b_perp = p1[1] - m_perp * p1[0]

    // Calculate the coordinates of the pependicular
    let x3 = p1[0] - (p2[1] - p1[1])
    let p3 = [
      x3,
      m_perp * x3 + b_perp
    ]

    // Return 2-point path for perpendicular line
    return [p1, p3]
  }

  parallelPath(p1, p2, offset_amount) {

    // Calculate the slope of the line AB as an angle
    let delta_y = p2[1] - p1[1]
    let delta_x = p2[0] - p1[0]
    let theta = Math.atan2(delta_y, delta_x)

    // Line A is a line perpendicular to the line AB, starting
    // at point A
    let line_A = [
      p1,
      [
        p1[0] + offset_amount * Math.cos(theta + Math.PI/2),
        p1[1] + offset_amount * Math.sin(theta + Math.PI/2)
      ]
    ]

    // Line B is a line perpendicular to the line BA, starting
    // at point B
    let line_B = [
      p2,
      [
        p2[0] + offset_amount * Math.cos(theta + Math.PI/2),
        p2[1] + offset_amount * Math.sin(theta + Math.PI/2)
      ]
    ]

    // Use the endpoints from Lines A and B to construct
    // a new line that is parallel to AB
    return [line_A[1], line_B[1]]
  }

  /**
   * Returns objet representing Line equation.
   * m = slope
   * b = Y intercept
   **/
  lineSlopeIntercept(p1, p2) {
    let m = (p2[1] - p1[1]) / (p2[0] - p1[0])
    let b = p1[1] - m * p1[0]
    return { "m": m, "b": b}
  }

  // const arrayColumn = (arr, n) => arr.map(a => a[n]);
  arrayColumn(arr, n){
    return arr.map(a => a[n]);
  }

  /**
   * Translate a group of paths to be centered around the origin
   **/
  centerPaths(paths) {

    let x;
    let x_min = 0;
    let x_max = 0;
    let y;
    let y_min = 0;
    let y_max = 0;

    // Get the most extreme points (bounds) from all paths
    for (let i = 0; i < paths.length; i++) {

      // Get X coordinates as an 1-dimensional array
      let x_coordinates = this.arrayColumn(paths[i], 0);

      x = Math.min(...x_coordinates);
      if (x < x_min) {
        x_min = x
      }

      x_max = Math.max(...x_coordinates);
      if (x > x_max) {
        x_max = x
      }

      // Get Y coordinates as an 1-dimensional array
      let y_coordinates = this.arrayColumn(paths[i], 1);

      y = Math.min(...y_coordinates);
      if (y < y_min) {
        y_min = y
      }

      y = Math.max(...y_coordinates);
      if (y > y_max) {
        y_max = y
      }
    }

    // Determine offset of X direction
    let x_range = x_max - x_min;
    let x_center_offset = x_min + x_range/2

    // Determine offset of Y direction
    let y_range = y_max - y_min;
    let y_center_offset = y_min + y_range/2

    // Translate each path
    for (let i = 0; i < paths.length; i++) {
      paths[i] = this.translatePath(paths[i], [-x_center_offset, -y_center_offset])
    }

    return paths
  }

  /*
  center(path) {

    // Define function to extract column from multidimensional array
    // const arrayColumn = (arr, n) => arr.map(a => a[n]);

    // Get X and Y coordinates as an 1-dimensional array
    let x_coordinates = this.arrayColumn(path, 0);
    let x_min = Math.min(...x_coordinates);
    let x_max = Math.max(...x_coordinates);
    let x_range = x_max - x_min;

    let y_coordinates = this.arrayColumn(path, 1);
    let y_min = Math.min(...y_coordinates);
    let y_max = Math.max(...y_coordinates);
    let y_range = y_max - y_min;

    return [x_min + x_range/2, y_min + y_range/2]
  }
  //*/

  /**
   * Scale Path
   * path A path array of [x,y] coordinates
   * scale A value from 0 to 1
   **/
  scalePath(path, scale) {
    let scale_x = scale
    let scale_y = scale;
    if (scale.length !== undefined) {
      scale_x = scale[0]
      scale_y = scale[1]
    }
    return path.map(function(a){
      return [
        a[0] * scale_x,
        a[1] * scale_y
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

  /**
   * Split each segment of the source path into 2 parts and return the result
   **/
  subdividePath(path) {

    let divided_path = new Array();

    for (let i = 0; i < path.length-1; i++) {

      // Current point
      divided_path.push(path[i]);

      // Point halfway to next point
      divided_path.push([
        path[i][0] + (path[i+1][0] - path[i][0])/2,
        path[i][1] + (path[i+1][1] - path[i][1])/2
      ]);

      // Point halfway to next point (Also works)
      /*
      divided_path.push([
        path[i][0] - (path[i][0] - path[i+1][0])/2,
        path[i][1] - (path[i][1] - path[i+1][1])/2
      ]);
      //*/
    }

    return divided_path;
  }

  /**
   * Split each segment of the source path into 2 parts and return the result
   **/
  dividePath(path, segments) {

    let divided_path = new Array();

    for (let i = 0; i < segments; i++) {
      divided_path.push(
        [
          this.lerp(path[0][0], path[1][0], i/segments),
          this.lerp(path[0][1], path[1][1], i/segments)
        ]
      )
    }

    return divided_path;
  }

  quadraticBezierPath(p1, p2, p3, segments) {
    let path = new Array();
    for (let i = 0; i < segments; i++) {
      let t = i/segments;
      path.push([
        Math.pow(1-t, 2) * p1[0] + 2 * (1-t) * t * p2[0] + Math.pow(t, 2) * p3[0],
        Math.pow(1-t, 2) * p1[1] + 2 * (1-t) * t * p2[1] + Math.pow(t, 2) * p3[1]
      ])
    }
    return path;
  }

  quadraticBezierPathAlgorithm(p1, p2, p3, segments) {

    let path = new Array();

    path.push(p1)

    let a = p1
    let b = p2
    let c;
    let d;
    for (let i = 1; i < segments; i++) {
      c = [
        p1[0] - (p1[0] - p2[0]) * (i/(segments-1)),
        p1[1] - (p1[1] - p2[1]) * (i/(segments-1))
      ];
      d = [
        p2[0] - (p2[0] - p3[0]) * (i/(segments-1)),
        p2[1] - (p2[1] - p3[1]) * (i/(segments-1))
      ];
      path.push(this.intersect_point(a,b,c,d))
      a = c;
      b = d
    }

    path.push(p3)

    return path;
  }

  /**
   * Bezier Path with 4 control points
   * Equations from https://javascript.info/bezier-curve
   */
  cubicBezierPath(p1, p2, p3, p4, segments) {
    let path = new Array();
    for (let i = 0; i <= segments; i++) {
      let t = i/segments;
      path.push([
        Math.pow(1-t, 3) * p1[0] + 3 * Math.pow(1-t, 2) * t * p2[0] + 3 * (1-t) * Math.pow(t,2) * p3[0] + Math.pow(t,3) * p4[0],
        Math.pow(1-t, 3) * p1[1] + 3 * Math.pow(1-t, 2) * t * p2[1] + 3 * (1-t) * Math.pow(t,2) * p3[1] + Math.pow(t,3) * p4[1]
      ])
    }
    return path;
  }

  sortPaths(paths) {
    paths = paths.sort(function(a, b){
      // Compare the X-position of the first point in the path
      return a[0][0] - b[0][0]
    });
    return paths
  }
}