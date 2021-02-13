class PathHelper {

  /**
   * https://www.w3schools.com/js/js_random.asp
   */
  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
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

  getRandom(min, max) {
    return Math.random() * (max - min) + min
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

  arrayColumn(arr, n){
    return arr.map(a => a[n]);
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

  quadraticBezierPath(p1, p2, p3, segments) {

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

}