/*
 * Concave Hull
 *
 * The purpose of this library is to calculate a Concave Hull from a set of points in 2D space
 *
 * References
 *  - https://towardsdatascience.com/the-concave-hull-c649795c0f0f
 *   - http://repositorium.sdum.uminho.pt/bitstream/1822/6429/1/ConcaveHull_ACM_MYS.pdf
 *
 */
var concaveHull = function() {

  function test(points, k) {

    // Remove the first point

    // console.log(points);

    // Test angle()
    /*
    console.log(
      angle(
        [1,0],
        [0,0],
        [0,1]
      )
    )
    //*/

    // Test
    /*
    console.log(CleanList([
      [0,1],
      [1,0],
      [0,1], // Duplicate
      [1,2],
      [2,3],
      [1,2] // Duplicate
    ]));
    //*/

    points = CleanList(points);

    console.log("Num Points: ", Length(points));

    console.log("Min Point: ", FindMinYPoint(points));

    // points = RemovePoint(points, 19)
    // console.log("After Remove: ", points)

    // points = AddPoint(points, [0,0])
    // console.log("After Add: ", points)

    let point_of_interest = 10
    console.log(points[point_of_interest]);
    let other_points = RemovePoint(points, 19)
    let nearest = NearestPoints(other_points, points[point_of_interest], k);
    console.log("Nearest: ", nearest);

    // let sorted = SortByAngle(nearest, points[point_of_interest], Math.PI);
    // console.log("Sorted: ", sorted);

    return points;
  }

  function calculate(pointsList, k) {

    // Make sure k >= 3
    let kk = Math.max(k, 3)

    if (kk >= pointsList.length) {
      return null;
    }

    // Remove duplicate points
    let dataset = CleanList(pointsList);

    // A minimum of 3 dissimilar points is required
    if (dataset.length < 3) {
      return null
    }

    // For a 3 points dataset, the polygon is the dataset itself
    if (dataset.length == 3) {
      return dataset
    }

    // Make sure that k neighbors can be found
    kk = Math.min(kk, dataset.length - 1)

    // Identify the point in the dataset that is lowest on the vertical Y-axis
    let firstPointId = FindMinYPoint(dataset)
    let firstPoint = dataset[firstPointId]

    // Initialize the hull with the first point
    let hull = new Array();
    hull.push(dataset[firstPointId]);

    // Remove the first point
    let currentPointId = firstPointId
    let currentPoint = firstPoint
    dataset = RemovePoint(dataset, firstPoint)

    console.log("-----")
    let previousAngle = 0.0;
    let step = 2;
    while ((!pointEquals(currentPoint, firstPoint) || step == 2) && dataset.length > 0) {

      console.log("Step: " + step)

      // Add the firstPoint again
      if (step == 5) {
        dataset = AddPoint(dataset, firstPoint)
      }

      // Find the nearest neighbors
      let kNearestPoints = NearestPoints(dataset, currentPoint, kk)

      // Debugging
      //*
      let debug_string = "Nearest Points to " + getIndex(pointsList, currentPoint) + ": ";
      for (let p of kNearestPoints) {
        debug_string += getIndex(pointsList, p) + ", "
      }
      console.log(debug_string.replace(/,\s*$/, ""));
      //*/

      // Debug exit
      if (step > 3) { return hull; }

      // Sort the candidates (neighbours) in descending order of right-hand turn
      let cPoints = SortByAngle(kNearestPoints, currentPoint, previousAngle)

      // Select the first candidate that does not intersect any of the "hull" polygon edges
      let its = true;
      let i = 0;
      while (its == true && i < cPoints.length) {

        // Note: This is NOT designed for zero-indexed arrays
        i++;

        let lastPoint;
        // console.log(cPoints.length, i, cPoints[i], firstPoint);
        if (pointEquals(cPoints[i-1], firstPoint)) {
          lastPoint = 1
        } else {
          lastPoint = 0
        }

        console.log("lastPoint: " + lastPoint);

        // Only evaluate if the hull is 3 or more points
        let j = 2;
        its = false;
        while (its == false && j < (hull.length - lastPoint)) {

          // TODO: evaluate this
          console.log("Step: " + step, "i: " + i, hull, cPoints)
          console.log([hull[step-2], cPoints[i]])
          its = IntersectsQ(
            [hull[step-2], cPoints[i-1]],
            [hull[step-2-j], cPoints[step-1-j]]
          )
          console.log("intersection (its): " + its)

          j++
        }

        console.log("-----")
      }

      // since all candidates intersect at least one edge, try again with a higher number of neighbours
      if (its == true) {
        console.log("Recalculating with k=" + (kk+1))
        return calculate(pointsList, kk+1)
      }

      currentPoint = cPoints[i-1];

      // A valid candidate was found
      hull = AddPoint(hull, currentPoint)

      previousAngle = -1 * Angle(hull[step-1], hull[step-2])

      // console.log("hull 2", hull, previousAngle)

      dataset = RemovePoint(dataset, currentPoint)

      step++
    }

    // check if all the given points are inside the computed polygon
    let allInside = true;
    let i = dataset.length
    while (allInside == true && i > 0) {
      allInside = PointInPolygonQ(dataset[i], hull)
      i--;
    }

    // since at least one point is out of the computed polygon, try again with a higher number of neighbours
    if (allInside == false) {
      return calculate(pointsList, kk+1)
    }

    // A valid hull was found!
    console.log(hull);
    return hull;
  }

  /**
   * Remove duplicate points
   * https://stackoverflow.com/a/20339709
   * @param Array An array of point arrays, i.e. [[0,0], [1,1], [1,1]]
   * @return Array The original array with duplicates removed [[0,0], [1,1]
   */
  function CleanList(points){
    var uniques = [];
    var itemsFound = {};
    let l = points.length;
    for (var i = 0; i < l; i++) {
      var stringified = JSON.stringify(points[i]);
      if (itemsFound[stringified]) {
        continue;
      }
      uniques.push(points[i]);
      itemsFound[stringified] = true;
    }
    return uniques;
  }

  /**
   * Get the number of elements in the Array
   * @param Array An array of point arrays, i.e. [[0,0], [1,1], [1,1]]
   * @return Integer The number of elements in the Array
   */
  function Length(points){
    return points.length;
  }

  /**
   * Get the coordinates of the point with the lowest Y value
   * Important Note: In this coordinate system "lowest" Y has a positive value
   * and for that reason the Max value is used
   * @param Array An array of point arrays, i.e. [[0,0], [1,1], [1,1]]
   * @return Integer The position of the point with the lowest Y value in points
   */
  function FindMinYPoint(points){
    let y_coordinates = arrayColumn(points, 1);
    // let index = y_coordinates.indexOf(arrayMin(y_coordinates));
    let index = y_coordinates.indexOf(arrayMax(y_coordinates));
    return index;
  }

  /**
   * Get the coordinates of the point with the lowest Y value
   * @param Array An array of point arrays, i.e. [[0,0], [1,1], [1,1]]
   * @param Integer The element position to remove
   * @return Array The point array with the lowest Y value
   */
  function RemovePoint(points, e){
    // points.splice(e, 1)
    // return points;

    for (let i = 0; i < points.length; i++) {
      if (pointEquals(points[i], e)) {
        points.splice(i, 1)
        return points
      }
    }
  }

  /**
   * Add a point array onto the end of the Points array
   * @param Array An array of point arrays, i.e. [[0,0], [1,1], [1,1]]
   * @param Array A point array, i.e. [2,2]
   * @return Array The points array
   */
  function AddPoint(points, point){
    points.push(point)
    return points;
  }

  /**
   * Return the "k" number of points nearest to "point" in "points" array
   * @param Array An array of point arrays
   * @param Array A point array, i.e. [2,2]
   * @param Integer The number (or length of array) of the points to return
   * @return Array The nearest points array
   */
  function NearestPoints(points, point, k){

    let nearest_points = new Array();

    // Calculate the distance between each point in "points" and the target point
    // and insert the point index and distance into a "candidates" array for sorting
    let candidates = new Array();
    for (let p = 0; p < points.length; p++) {
      candidates.push({
        "id": p,
        "point" : points[p],
        "distance" : distance(points[p], point)
      })
    }

    // Sort points by distance
    // https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    candidates.sort((a, b) => (a.distance > b.distance) ? 1 : -1)

    k = Math.min(k, candidates.length)

    // Select "k" number of nearest points
    for (let i = 0; i < k; i++) {
      nearest_points.push(candidates[i].point)
    }

    return nearest_points;
  }

  /**
   * Returns the given points sorted in descending order of angle (right-hand turn).
   * The first element of the returned list is the first candidate to be the
   * next point of the polygon.
   * @param Array An array of point arrays
   * @param Array A point array, i.e. [2,2]
   * @param Float The angle of the previous line segment in the path
   * @return Array A sorted points array
   */
  function SortByAngle(points, point, prev_angle){

    let sorted_points = new Array();

    // Calculate the angle between each point in "points" and the target point
    // and insert the point index and angle into a "candidates" array for sorting
    let candidates = new Array();
    for (let p = 0; p < points.length; p++) {
      candidates.push({
        "id" : p,
        "point" : points[p],
        "angle" : Angle(points[p], point) - prev_angle
        // angle(last_point, point, points[p]) - prev_angle
      })
    }

    // console.log("Sort by Angle Points: ", candidates);

    // Sort points by angle in descending order
    // https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    candidates.sort((a, b) => (a.angle > b.angle) ? 1 : -1)

    // Extract the points
    for (let i = 0; i < candidates.length; i++) {
      sorted_points.push(candidates[i].point)
    }

    // console.log("Sorted By Angle: " + candidates[0].id + ", " + candidates[1].id + ", " + candidates[2].id)

    return sorted_points;
  }

  /**
   * Returns True if the two given lines segments intersect each other,
   * and False otherwise.
   * @param Array An array of 2 point arrays that define the start and end of a line
   * @param Array An array of 2 point arrays that define the start and end of a line
   * @return Boolean
   */
  function IntersectsQ(line1, line2){

    let intersection_point = intersect_point(line1[0], line1[1], line2[0], line2[1])

    console.log("IntersectsQ: ", intersection_point)

    if (intersection_point.length == 0) {
      return false;
    }

    return true;
  }

  /**
   * Returns True if the given point is inside the polygon defined
   * by the given points, and False otherwise.
   * https://en.wikipedia.org/wiki/Point_in_polygon
   * @param Array A point array, i.e. [2,2]
   * @param Array An array of point arrays
   * @return Boolean
   */
  function PointInPolygonQ(point, points){
    return pointInPolygonNested(point, points)
  }

  function Angle(pointA, pointB) {
    return Math.PI - Math.atan2(pointB[1] - pointA[1], pointB[0] - pointA[0])
  }

  // Helpers

  function arrayColumn(arr, n){
    return arr.map(a => a[n]);
  }

  function arrayMin(a) {
    return Math.min(...a);
  }

  function arrayMax(a) {
    return Math.max(...a);
  }

  function pointEquals(a,b) {
    if (a[0] === b[0] && a[1] === b[1]) {
      return true;
    }
    return false;
  }

  function getIndex(points, point) {
    for (let i = 0; i < points.length; i++) {
      if (pointEquals(points[i], point)) {
        return i
      }
    }
  }

  function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
  }

  /**
   * Calculate the angle in Radians between the 3 points where p2 is the vertex
   * Use the Law of Cosines (https://en.wikipedia.org/wiki/Law_of_cosines)
   * @param Array A 2-element point array. Point A
   * @param Array A 2-element point array. Point C - this is the vertex of the 3 points
   * @param Array A 2-element point array. Point B
   * @return float The angle in Radians between the 3 points where p2 is the vertex
   */
  // function angle(p1, p2, p3) {

  //   let sideOppP1 = distance(p2, p3)
  //   let sideOppP2 = distance(p1, p3)
  //   let sideOppP3 = distance(p1, p2)

  //   let a = sideOppP1
  //   let b = sideOppP3
  //   let c = sideOppP2

  //   let angle = Math.acos(
  //     (Math.pow(a,2) + Math.pow(b,2) - Math.pow(c,2))
  //     /
  //     (2 * a * b)
  //   )

  //   return angle;
  // }

  /**
   * Calculate the intersection point of 2 lines
   * Copied from https://editor.p5js.org/mwburke/sketches/h1ec1s6LG
   * @param Array A 2-element point array. Start Point of Line 1
   * @param Array A 2-element point array. End Point of Line 1
   * @param Array A 2-element point array. Start Point of Line 2
   * @param Array A 2-element point array. End Point of Line 2
   * @return Array A 2-element point array. End Point of Line 2
   */
  function intersect_point(p1, p2, p3, p4) {
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
   * Returns True if the given point is inside the polygon
   * From https://github.com/substack/point-in-polygon
   * https://github.com/substack/point-in-polygon/blob/master/nested.js
   * @param Array A point array, i.e. [2,2]
   * @param Array An array of point arrays
   * @param Integer Start position
   * @param Integer Stop position
   * @return Boolean
   */
  function pointInPolygonNested (point, vs, start, end) {
    var x = point[0], y = point[1];
    var inside = false;
    if (start === undefined) start = 0;
    if (end === undefined) end = vs.length;
    var len = end - start;
    for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[i+start][0], yi = vs[i+start][1];
        var xj = vs[j+start][0], yj = vs[j+start][1];
        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
  };

  // Return public points to the private methods and properties you want to reveal
  return {
    calculate: calculate
  }
}();