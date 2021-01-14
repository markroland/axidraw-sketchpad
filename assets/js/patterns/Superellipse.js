/*
 * Super Ellipse
 *
 * https://en.wikipedia.org/wiki/Superellipse
 * https://mathworld.wolfram.com/Superellipse.html
 * https://thecodingtrain.com/CodingChallenges/019-superellipse.html
 *
 */
class Superellipse {

  constructor() {

    this.key = "superellipse";

    this.name = "Superellipse";

    this.path = [];
  }

  draw() {

    // Calculate path
    let path = this.calc(
      1.0,
      (5/3) / 2,
      10.0, // 0.1 - 10
      false,
      true
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for a Superellipse
   *
   * @param float width
   * @param float height
   * @param float n
   * @param float spiralize
   *
   **/
  calc(width, height, n, spiralize, border) {

    // Set initial values
    var x;
    var y;
    var a = width;
    var b = height;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // The number of "sides"
    // A larger number makes the shape more smooth
    let sides = 60;

    if (spiralize) {
      a = 0;
      b = 0;
      var n_base = n;
      var max_loops = spiralize;
      for (var loop = 0; loop < max_loops; loop++) {
        var a_base = (loop / max_loops) * width;
        var b_base = (loop / max_loops) * height;
        n = (loop / max_loops) * n_base + 0.1;
        for (var theta = 0; theta <= 2 * Math.PI; theta += (2 * Math.PI) / sides) {
          a = a_base + (theta/(2 * Math.PI)) * (width/max_loops)
          b = b_base + (theta/(2 * Math.PI)) * (height/max_loops)
          x = Math.pow(Math.abs(Math.cos(theta)), (2/n)) * a * this.sgn(Math.cos(theta));
          y = Math.pow(Math.abs(Math.sin(theta)), (2/n)) * b * this.sgn(Math.sin(theta));
          path.push([x,y]);
        }
      }
    }

    if (!spiralize || (spiralize && border)) {

      // Loop through one revolution
      for (var theta = 0; theta <= 2 * Math.PI; theta += (2 * Math.PI) / sides) {
        x = Math.pow(Math.abs(Math.cos(theta)), (2/n)) * a * this.sgn(Math.cos(theta));
        y = Math.pow(Math.abs(Math.sin(theta)), (2/n)) * b * this.sgn(Math.sin(theta));
        path.push([x,y]);
      }
    }

    return path;
  }

  /**
   * Return +1 if the number is positive, -1 if the number is negative, and 0 if zero
   */
  sgn(val) {
    if (val == 0) {
      return 0;
    }
    return val / Math.abs(val);
  }
}