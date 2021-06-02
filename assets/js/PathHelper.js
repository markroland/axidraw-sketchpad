class PathHelper {

  info(path) {
    let results = {
      "min": this.getMin(path),
      "max": this.getMax(path)
    }
    results.range = [
      results.max[0] - results.min[0],
      results.max[1] - results.min[1]
    ]
    results.center = [
      results.min[0] + results.range[0]/2,
      results.min[1] + results.range[1]/2
    ]
    return results
  }

  /**
   *
   **/
  getMin(path) {
    let x_coordinates = this.arrayColumn(path, 0);
    let y_coordinates = this.arrayColumn(path, 1);
    return [
      this.arrayMin(x_coordinates),
      this.arrayMin(y_coordinates),
    ]
  }

  /**
   *
   **/
  getMax(path) {
    let x_coordinates = this.arrayColumn(path, 0);
    let y_coordinates = this.arrayColumn(path, 1);
    return [
      this.arrayMax(x_coordinates),
      this.arrayMax(y_coordinates),
    ]
  }

  arrayMin(a) {
    return Math.min(...a);
  }

  arrayMax(a) {
    return Math.max(...a);
  }

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

  expandPath(path, offset_start, offset_end, capStyle = 'open') {

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

  /**
   * Join Paths together when endpoints within threshold distance of each other
   * @param paths Array A multidimensional arry of paths
   * @param float The distance threshold below which points should be considered the same location.
   *   The value is based on the Standard unit of canvas center to canvas nearest edge.
   *   In thise case 1 = 1.5" (Default of 0.01 = 0.015" ~ 1/64")
   * @param integer The index position of the paths input that is being analyzed
   * @param integer A counter of function call iterations. Useful for debugging and stopping the recursion
   * @return Array An array of paths
   **/
  joinPaths(paths, threshold = 0.01, active_path_index = 0, iteration = 0) {

    let PathHelp = new PathHelper();

    // Set border parameters
    let min_x = -5/3
    let max_x = 5/3
    let min_y = -1
    let max_y = 1

    let debug = false

    // Bail if iterations exceeded
    iteration++
    if (debug) { console.log('---------------------') }
    if (debug) { console.log('Iteration:', iteration) }

    let path_index = active_path_index
    let distance

    // Check for completion of multiple closed loops
    for (let i = path_index; i < paths.length; i++) {
      let path_closed = false
      if (debug) { console.log('path_index:', path_index) }

      // Calculate distance between first and last point of target path
      distance = PathHelp.distance(paths[path_index][0], paths[path_index][paths[path_index].length-1])

      // If distance is below threshold, then the path should be considered a closed loop
      if (distance < threshold) {
        path_closed = true
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
    for (let i = 0; i < paths.length; i++) {

      // Skip self
      if (i == path_index) {
        continue;
      }

      // Check last point of target path against first point of other paths
      distance = PathHelp.distance(last_point, paths[i][0])

      if (distance < threshold) {
        // console.log(last_point, paths[i][0], distance, paths[i]);
        overlap_count++
        // console.log('before:', paths[0])
        paths[path_index] = paths[path_index].concat(paths[i].slice(1))
        // console.log('after:', paths[0])

        // remove from paths
        paths.splice(i, 1);
        break
      }

      // Check last point of target path against last point of other paths
      distance = PathHelp.distance(last_point, paths[i][paths[i].length-1])
      if (distance < threshold) {
        // console.log(last_point, paths[i][0], distance);
        overlap_count++
        paths[path_index] = paths[path_index].concat(paths[i].reverse().slice(1))

        // remove from paths
        paths.splice(i, 1);
        break
      }

      // Check first point of target path against first point of other paths
      distance = PathHelp.distance(paths[path_index][0], paths[i][0])
      if (distance < threshold) {
        overlap_count++
        paths[path_index] = paths[i].reverse().concat(paths[path_index])
        paths.splice(i, 1);
        break
      }

      // Check first point of target path against last point of other paths
      distance = PathHelp.distance(paths[path_index][0], paths[i][paths[i].length-1])
      if (distance < threshold) {
        overlap_count++
        paths[path_index] = paths[i].concat(paths[path_index])
        paths.splice(i, 1);
        break
      }

    }

    if (debug) { console.log("Overlap Count", overlap_count) }

    // Exit function if the last path is closed
    if (path_index == paths.length) {
      return paths;
    }

    // Check to see if both ends of the current path terminate on
    // the edge of the drawing area
    let first_point = paths[path_index][0];
    last_point = paths[path_index][paths[path_index].length - 1];
    let on_border = false;
    if (!on_border) {
      distance = PathHelp.distance(last_point, [min_x, last_point[1]])
      if (distance < threshold) {
        on_border = true
      }
    }
    if (!on_border) {
      distance = PathHelp.distance(last_point, [max_x, last_point[1]])
      if (distance < threshold) {
        on_border = true
      }
    }
    if (!on_border) {
      distance = PathHelp.distance(last_point, [last_point[0], min_y])
      if (distance < threshold) {
        on_border = true
      }
    }
    if (!on_border) {
      distance = PathHelp.distance(last_point, [last_point[0], max_y])
      if (distance < threshold) {
        on_border = true
      }
    }

    // Check the beginning of the path only if the end of the path is
    // on the border
    if (on_border) {
      distance = PathHelp.distance(first_point, [min_x, first_point[1]])
      if (distance > threshold) {
        on_border = false
      }
    }
    if (on_border) {
      distance = PathHelp.distance(first_point, [max_x, first_point[1]])
      if (distance > threshold) {
        on_border = false
      }
    }
    if (on_border) {
      distance = PathHelp.distance(first_point, [first_point[0], min_y])
      if (distance > threshold) {
        on_border = false
      }
    }
    if (on_border) {
      distance = PathHelp.distance(first_point, [first_point[0], max_y])
      if (distance > threshold) {
        on_border = false
      }
    }

    // If the targe path is closed or on the border go to next path
    if (overlap_count == 0 || on_border) {
      active_path_index++
    }

    paths = this.joinPaths(paths, threshold, active_path_index, iteration)

    return paths
  }

  pointsToPaths2(points, threshold) {
    const paths = [];

    let new_path = [];
    while (points.length > 1) {

      // New paths starts with next unprocessed point
      if (new_path.length == 0) {
        new_path.push(points.shift());
      }
      
      // Loop through all points and identify candidate points within
      // the distance threshold
      let distance;
      let candidates = new Array();
      for (let p = 0; p < points.length; p++) {

        let active_path_last_point_index = new_path.length - 1
        distance = this.distance(
          new_path[active_path_last_point_index],
          points[p]
        )

        if (distance < threshold) {
          candidates.push({
            "point" : p,
            "distance" : distance
          })
        }
      }

      // No points near enough? We got us a path; move on.
      if (candidates.length == 0) {

        paths.push(new_path);
        new_path = [];

        continue;
      }

      // If we're here, we got candidates
      // Sort points by distance, favor by index if distances are equal
      candidates.sort(
        (a, b) => (a.distance > b.distance) ? 1 : (a.distance === b.distance) ? ((a.point > b.point) ? 1 : -1) : -1
      )

      // Add the nearest point as the next point in the path
      let nearest_point_index = candidates[0].point
      let nearest_point = points[nearest_point_index]
      new_path.push(nearest_point)

      // Remove the point from available points
      points.splice(nearest_point_index, 1);
    }
    
    // We might be left with a non-empty path
    if (new_path.length > 0) paths.push(new_path);

    return paths;
  }

  /**
   * Join points together when endpoints within threshold distance of each other
   **/
  pointsToPaths(paths, points, active_path_index = 0, threshold) {

    // Escape recursion (Chrome is having a "Maximum call stack size exceeded" error)
    // here where Safari and Firefox are not
    if (points.length == 0) {
      return paths
    }

    // Loop through all points and identify candidate points within
    // the distance threshold
    let distance;
    let candidates = new Array();
    for (let p = 0; p < points.length; p++) {

      let active_path_last_point_index = paths[active_path_index].length - 1
      distance = this.distance(
        paths[active_path_index][active_path_last_point_index],
        points[p]
      )

      if (distance < threshold) {
        candidates.push({
          "point" : p,
          "distance" : distance
        })
      }
    }

    if (candidates.length > 0) {

      // Sort points by distance, favor by index if distances are equal
      // https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
      candidates.sort(
        (a, b) => (a.distance > b.distance) ? 1 : (a.distance === b.distance) ? ((a.point > b.point) ? 1 : -1) : -1
      )

      // Add the nearest point as the next point in the path
      let nearest_point_index = candidates[0].point
      let nearest_point = points[nearest_point_index]
      paths[active_path_index].push(nearest_point)

      // Remove the point from available points
      points.splice(nearest_point_index, 1);

    } else {

      // If no points are within the threshold then start a new path
      paths.push([
        points.shift()
      ])
      active_path_index++
    }

    paths = this.pointsToPaths(paths, points, active_path_index, threshold)

    return paths;
  }

  smoothPath(path, size = 3) {
    let newData = new Array();
    newData.push(path[0])
    if (path.length < size) {
      return path
    }
    let range = (size - 1)/2
    let v = 1 / size
    const kernel = new Array(size).fill(v)
    for (let p = range; p < path.length-range; p++) {
      let sum = [0,0];
      for (let k = -range; k <= range; k++) {
        // Sum X and Y components
        sum[0] += path[p+k][0] * kernel[k+range]
        sum[1] += path[p+k][1] * kernel[k+range]
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

  /**
   * Calculate an intersection point of two circles
   * https://math.stackexchange.com/questions/256100/how-can-i-find-the-points-at-which-two-circles-intersect
   * https://www.analyzemath.com/CircleEq/circle_intersection.html
   * See alternate implementation: https://gist.github.com/jupdike/bfe5eb23d1c395d8a0a1a4ddd94882ac
   * @param p1 Array of x/y position ([x,y]) of Circle 1
   * @param r1 float Radius of Circle 1
   * @param p2 Array of x/y position ([x,y]) of Circle 2
   * @param r2 float Radius of Circle 2
   * @return Array An array of intersection points
   **/
  circleInterceptPoints(p1, r1, p2, r2, sign) {

    // Distance between centers of the circles
    let d = this.distance(p1, p2)

    let x = (1/2) * (p1[0] + p2[0])
      + ((Math.pow(r1, 2) - Math.pow(r2, 2)) / (2 * Math.pow(d, 2))) * (p2[0] - p1[0])
      + sign * (1/2) * Math.sqrt(
          2 * ((Math.pow(r1, 2) + Math.pow(r2, 2))/(Math.pow(d, 2)))
          - Math.pow((Math.pow(r1, 2) - Math.pow(r2, 2)), 2) / Math.pow(d, 4)
          - 1
        ) * (p2[1] - p1[1])

    let y = (1/2) * (p1[1] + p2[1])
      + ((Math.pow(r1, 2) - Math.pow(r2, 2)) / (2 * Math.pow(d, 2))) * (p2[1] - p1[1])
      + sign * (1/2) * Math.sqrt(
          2 * ((Math.pow(r1, 2) + Math.pow(r2, 2))/(Math.pow(d, 2)))
          - Math.pow((Math.pow(r1, 2) - Math.pow(r2, 2)), 2) / Math.pow(d, 4)
          - 1
        ) * (p1[0] - p2[0])

    return [x,y]
  }
}