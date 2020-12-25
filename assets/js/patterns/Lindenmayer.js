/**
 * Space Filling Curves
 *
 * Modified from https://p5js.org/examples/simulate-l-systems.html on 6/15/2019
 *
 * https://en.wikipedia.org/wiki/Space-filling_curve
 * https://fedimser.github.io/l-systems.html
 *
 */
class Lindenmayer {

  constructor() {

    this.key = "lindenmayer";

    this.name = "Space Filling Curves";

    // Hilbert Curve
    // https://en.wikipedia.org/wiki/Hilbert_curve#Representation_as_Lindenmayer_system
    this.hilbert_curve = {
      "l_system": {
        "axiom": "A",
        "rules": [
          ["A", "-BF+AFA+FB-"],
          ["B", "+AF-BFB-FA+"]
        ]
      },
      "draw": {
        "angle": 90
      }
    }

    // Gosper Curve
    // https://en.wikipedia.org/wiki/Gosper_curve
    // "F"-based rules found at https://gist.github.com/nitaku/6521802
    this.gosper_curve = {
      "l_system": {
        "axiom": "A",
        "rules": [
          ["A", "A+BF++BF-FA--FAFA-BF+"],
          ["B", "-FA+BFBF++BF+FA--FA-B"]
        ]
      },
      "draw": {
        "angle": 60
      }
    }

    // Sierpinkski Arrowhead
    this.sierpinski_arrowhead = {
      "l_system": {
        "axiom": "AF",
        "rules": [
          ["A", "BF+AF+B"],
          ["B", "AF-BF-A"]
        ]
      },
      "draw": {
        "angle": 60
      }
    }
  }


  /**
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    // Read in selected value(s)

    let algorithm = 'sierpinski_arrowhead';
    let iterations = 7;
    let segment_length = 0.02

    let lindenmayer_string = this[algorithm].l_system.axiom
    for (let i = 0; i < iterations; i++) {
      lindenmayer_string = this.compose_lindenmayer_string(lindenmayer_string, this[algorithm]);
    }

    // Log Lindemayer System string
    // console.log(lindenmayer_string);

    // Calculate path
    let path = this.calc(this[algorithm], lindenmayer_string, segment_length);

    return [path];
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  calc(algorithm, lindenmayer_string, segment_length) {

    let rotation = 0.0

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    var pos = 0;

    let x = 0;
    let y = 0;

    var current_angle = 0;

    while (pos < lindenmayer_string.length-1) {

      if (lindenmayer_string[pos] == 'F') {

        // Draw forward

        // polar to cartesian based on step and current_angle:
        let x1 = x + segment_length * Math.cos(this.degrees_to_radians(current_angle));
        let y1 = y + segment_length * Math.sin(this.degrees_to_radians(current_angle));

        path.push([x1, y1]);

        // update the turtle's position:
        x = x1;
        y = y1;

      } else if (lindenmayer_string[pos] == '+') {

        // Turn left
        current_angle += algorithm.draw.angle;

      } else if (lindenmayer_string[pos] == '-') {

        // Turn right
        current_angle -= algorithm.draw.angle;
      }

      pos++;
    }

    // Translate path to center of drawing area
    path = this.translate_to_center(path);

    // Rotate path around the center of drawing area
    if (rotation > 0) {
      path = this.rotate_around_center(path);
      path = this.translate_to_center(path);
    }

    return path;
  }

  compose_lindenmayer_string(s, algorithm) {

    // Start a blank output string
    let outputstring = '';

    // Iterate through the Lindenmayer rules looking for symbol matches
    for (let i = 0; i < s.length; i++) {

      let ismatch = 0;

      for (let j = 0; j < algorithm.l_system.rules.length; j++) {

        if (s[i] == algorithm.l_system.rules[j][0]) {

          // Write substitution
          outputstring += algorithm.l_system.rules[j][1];

          // We have a match, so don't copy over symbol
          ismatch = 1;

          break;
        }
      }

      // If nothing matches, just copy the symbol over.
      if (ismatch == 0) {
        outputstring+= s[i];
      }
    }

    return outputstring;
  }

  degrees_to_radians(degrees)
  {
    var pi = Math.PI;
    return degrees * (Math.PI/180);
  }

  translate_to_center(path) {

    // Define function to extract column from multidimensional array
    const arrayColumn = (arr, n) => arr.map(a => a[n]);

    // Get X and Y coordinates as an 1-dimensional array
    var x_coordinates = arrayColumn(path, 0);
    var x_min = Math.min(...x_coordinates);
    var x_max = Math.max(...x_coordinates);
    var x_range = x_max - x_min;

    var y_coordinates = arrayColumn(path, 1);
    var y_min = Math.min(...y_coordinates);
    var y_max = Math.max(...y_coordinates);
    var y_range = y_max - y_min;

    return path.map(function(a){
      return [
        (a[0] - x_min - ((x_max - x_min)/2)),
        (a[1] - y_min - ((y_max - y_min)/2)),
      ];
    });
  }

  rotate_around_center(path, rotation = 0) {
    var theta = this.degrees_to_radians(rotation);
    return path.map(function(a){
      var x = a[0];
      var y = a[1];
      return [
        x * Math.cos(theta) - y * Math.sin(theta),
        x * Math.sin(theta) + y * Math.cos(theta)
      ];
    });
  }
}