/**
 * Genuary
 * https://genuary2021.github.io/prompts
 */

class Genuary {

  constructor() {

    this.key = "genuary";

    this.name = "Genuary";
  }

  /**
   * Draw path
   */
  draw() {
    // return this.genuary_4();

    return [this.parametric()];

    // Canvas limits test
    /*
    return [
        [[1.571, 1],
        [1.571, -1],
        [-1.571, -1],
        [-1.571, 1],
        [1.571, 1]]
    ]
    //*/
  }

  /**
   * Prompt: 3 Loops
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  genuary_1() {

    let a_max = 13
    let b_max = 8
    let c_max = 10

    let path = new Array();

    for (let a = 0; a < 2 * a_max; a++) {

        for (let b = 0; b < 2 * b_max; b++) {

            let side_length = 0.11

            // Base shape
            let base_shape = this.polygon(4, side_length, Math.PI/4);

            // Rotation
            // console.log(((b + (a * 2 * b_max)) / (2 * a_max * 2 * b_max)) * Math.PI * 2)
            let rotated_shape = this.rotatePath(
                base_shape,
                ((b + (a * 2 * b_max)) / (2 * a_max * 2 * b_max)) * Math.PI/2
            );

            // Translate
            let translated_shape = this.translatePath(
                rotated_shape,
                [1 * (a/b_max), 1 * (b/b_max)]
            );

            // Add to paths array
            path.push(translated_shape);

            // for (let c = 0; c < c_max; c++) {

            // }

        }
    }

    //*
    // Center the Paths to the canvas
    let centered_path = new Array();
    for (let i = 0; i < path.length; i++) {
        centered_path.push(this.translatePath(path[i], [-1.571, -1]))
    }
    path = centered_path;
    //*/

    return path;
  }

  /**
   * Prompt: Rule 30
   *
   * https://p5js.org/examples/simulate-wolfram-ca.html
   * https://en.wikipedia.org/wiki/Rule_30
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  genuary_2() {
    let Wolfram = new WolframRules();
    return Wolfram.draw()
  }

  /**
   * Prompt: Small areas of symmetry.
   **/
  genuary_4() {

    let slice_paths = new Array();

    let path = new Array();

    let base_shape = new Array();

    let slices = 6;

    let num_shapes_per_slice = 6;

    // Generate 1 slice (which includes its mirror)
    for (let s = 0; s < num_shapes_per_slice; s++) {

      // Generate a base shape with 3-5 sides, random side length, and random rotation
      base_shape = this.polygon(
        this.getRndInteger(3,5),
        0.05 + Math.random() / 10,
        (Math.random() * 360) / (2 * Math.PI)
      );

      // Translate the shape a random distance from the center
      let translated_shape = this.translatePath(base_shape, [0.1 + 0.9 * Math.random(), 0])

      // Rotate the shape a random amount from the origin, limited by the slice size
      let random_rotation = Math.random() * Math.PI / slices;
      let rotated_shape = this.rotatePath(translated_shape, random_rotation)

      // Add shape to paths
      slice_paths.push(rotated_shape);

      // Reflect shape to it's mirrored slice
      let reflected_shape = this.rotatePath(translated_shape, -random_rotation)
      slice_paths.push(reflected_shape);
    }

    // path = slice_paths;

    // Repeat the slice a full rotation
    for (let a = 0; a < slices; a++) {
      for (let i = 0; i < slice_paths.length; i++) {
        let rotated_slice_path = this.rotatePath(slice_paths[i], a * Math.PI / (slices/2));
        path.push(rotated_slice_path)
      }
    }

    return path;
  }

  parametric() {

    // Set initial values
    var x;
    var y;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // The number of "sides" to the circle.
    let steps_per_revolution = 120;

    // Loop through one revolution
    let a = 1.2;
    let b = 0.7;
    let c = 0.0;
    let d = 0.0;
    for (let i = 0; i < 100; i++) {
      a += (Math.random() - 0.5) / 10;
      b += (Math.random() - 0.5) / 10;
      c = (Math.random() - 0.5) / 10;
      d = (Math.random() - 0.5) / 10;
      var step = 0;
      var t = 0.0;
      while (t < (2 * Math.PI)) {

        // Rotational Angle (steps per rotation in the denominator)
        t = (step/steps_per_revolution) * (2 * Math.PI);

        // Run the parametric equations
        // x = 0.3 * Math.sin(t) * (Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5));
        // y = 0.3 * Math.cos(t) * (Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5));

        // let r = Math.sqrt(2) * Math.sqrt(Math.cos(2*t));
        // x = r * Math.cos(t);
        // y = r * Math.sin(t);

        x = a * Math.sin(t) + c;
        y = b * Math.sin(2*t) + d;

        // Add coordinates to shape array
        path.push([x,y]);

        // Increment iteration counter
        step++;
      }
    }

    return path;
  }

  /**
   * https://www.w3schools.com/js/js_random.asp
   */
  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  polygon(sides, length, rotation)
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
}