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

  expandPath(path, offset_start, offset_end, capStyle = 'open', ) {

    let parallels = new Array();
    let parallel = new Array();
    let parallel_segment;
    let offset = offset_start
    let i_max = path.length-1

    // Outer
    parallel = new Array();
    for (let i = 0; i < i_max; i++) {
      offset = offset_end + (offset_start - offset_end) * (i/(i_max + 1))
      parallel_segment = this.parallelPath(path[i], path[i+1], offset)
      parallel.push(parallel_segment[0])
    }
    // Push the last point
    parallel.push(parallel_segment[1])
    parallels.push(parallel)

    // Inner
    parallel = new Array();
    for (let i = 0; i < i_max; i++) {
      offset = offset_end + (offset_start - offset_end) * (i/(i_max + 1))
      parallel_segment = this.parallelPath(path[i], path[i+1], -offset)
      parallel.push(parallel_segment[0])
    }
    // Push the last point
    parallel.push(parallel_segment[1])
    parallels.push(parallel)

    let output
    switch (capStyle) {
      case 'flat':
        output = parallels[0].concat(parallels[1].reverse())
        output.push(parallels[0][0])
        return output
      case 'round':
        parallels[1].reverse()

        output = parallels[0]

        // Cap
        output = output.concat(this.arc(
            parallels[0][parallels[0].length-1][0],
            parallels[0][parallels[0].length-1][1],
            parallels[1][0][0],
            parallels[1][0][1],
            -Math.PI,
            6
          )
        )

        output = output.concat(parallels[1])

        // Cap
        output = output.concat(this.arc(
            parallels[1][parallels[1].length-1][0],
            parallels[1][parallels[1].length-1][1],
            parallels[0][0][0],
            parallels[0][0][1],
            -Math.PI,
            6
          )
        )

        // Last point
        output.push(parallels[0][0])

        return output
      default:
        return parallels
    }
  }

  arc(x1, y1, x2, y2, theta, segments = 12) {
    let path = new Array()
    let PathHelp = new PathHelper
    let theta_0 = Math.atan2(y2 - y1, x2 - x1)
    let distance = PathHelp.distance([x1, y1], [x2, y2])
    for (let c = 1; c < segments; c++) {
      path.push([
        x1 + (x2 - x1)/2 + distance/2 * Math.cos(theta_0 + Math.PI + c/segments * theta),
        y1 + (y2 - y1)/2 + distance/2 * Math.sin(theta_0 + Math.PI + c/segments * theta)
      ])
    }
    return path
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
   * Shift and wrap the elements in the array
   * https://javascript.plainenglish.io/algorithms-101-rotate-array-in-javascript-three-solutions-260fbc923b64
   */
  shiftPath(path, k) {
    if (path.length > k) {
        path.unshift( ...path.splice(-k))
    } else {
      let i = 0
      while(i < k){
        path.unshift(path.splice(-1))
        i++
      }
    }
    return path
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

  joinPaths(paths, threshold = 0.01, iteration = 0) {

    let PathHelp = new PathHelper();

    let debug = false

    // Bail if iterations exceeded
    iteration++
    if (debug) { console.log('---------------------') }
    if (debug) { console.log('Iteration:', iteration) }

    // console.log('new_paths', new_paths)

    // console.log('paths.length', paths.length)

    let path_index = 0
    let distance

    // Check for completion of multiple closed loops
    // Note: This is highly inefficient because it re-checks paths already known to be closed
    for (let i = 0; i < paths.length; i++) {
      let path_closed = false
      if (debug) { console.log('path_index:', path_index) }

      // Calculate distance between first and last point of target path
      distance = PathHelp.distance(paths[path_index][0], paths[path_index][paths[path_index].length-1])

      // If distance is below threshold, then the path should be considered a closed loop
      if (distance < threshold) {
        path_closed = true
      }

      if (path_index == 1) {

      }

      // If the path is a closed loop, then increment the index to look at the next path
      // as the target path
      if (path_closed) {
        if (debug) { console.log('Path ' + path_index + ' closed.') }
        path_index++
        if (debug) { console.log('New Path Index: ' + path_index) }
        continue
      }
      break
    }

    if (debug) { console.log('selected path_index:', path_index) }
    if (debug) { console.log('paths.length:', paths.length) }

    // Exit function if the last path is closed
    if (path_index == paths.length) {
      return paths;
    }

    // Last point of the target path on which to join other paths
    let last_point = paths[path_index][paths[path_index].length - 1];

    // Check remaining paths
    // console.log('paths.length', paths.length)
    let overlap_count = 0
    for (let i = path_index + 1; i < paths.length; i++) {

      // Compare each point in the path to check for coincident points
      distance = PathHelp.distance(last_point, paths[i][0])

      if (distance < threshold) {
        // console.log(last_point, paths[i][0], distance, paths[i]);
        overlap_count++
        // console.log('before:', paths[0])
        paths[path_index] = paths[path_index].concat(paths[i].slice(1))
        // console.log('after:', paths[0])

        // remove from paths
        paths.splice(i, 1);
        // let index = paths.indexOf(i);
        // if (index > -1) {
        //   paths.splice(index, 1);
        // }

        break
      }

      // Reverse path and try again
      // paths[i].reverse()
      distance = PathHelp.distance(last_point, paths[i][paths[i].length-1])
      // console.log(last_point, paths[i][0], distance);
      if (distance < threshold) {
        // console.log(last_point, paths[i][0], distance);
        overlap_count++
        paths[path_index] = paths[path_index].concat(paths[i].reverse().slice(1))

        // remove from paths
        paths.splice(i, 1);
      }

    }

    // console.log("Overlap Count", overlap_count)

    if (overlap_count > 0) {
      paths = this.joinPaths(paths, threshold, iteration)
    }

    return paths
  }

  smoothPath(path) {
    let newData = new Array();
    newData.push(path[0])
    let v = 1/3
    const kernel = [v,v,v]
    for (let p = 1; p < path.length-1; p++) {
      let sum = [0,0];
      for (let k = -1; k <= 1; k++) {
        sum[0] += path[p+k][0] * kernel[k+1]
        sum[1] += path[p+k][1] * kernel[k+1]
      }
      newData.push(sum)
    }
    newData.push(path[path.length-1])
    return newData
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

  polarToRect(radius, theta) {
    return [
      radius * Math.cos(theta),
      radius * Math.sin(theta)
    ]
  }

}