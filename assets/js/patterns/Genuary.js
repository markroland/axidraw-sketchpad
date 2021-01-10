/**
 * Genuary
 * https://genuary2021.github.io/prompts
 *
 * [x] JAN.1 TRIPLE NESTED LOOP
 * [x] JAN.2 Rule 30 (elementary cellular automaton)
 * [ ] JAN.3 Make something human.
 * [x] JAN.4 Small areas of symmetry.
 * [x] JAN.5 Do some code golf! How little code can you write to make something interesting? Share the sketch and its code together if you can.
 * [x] JAN.6 Triangle subdivision.
 * [ ] JAN.7 Generate some rules, then follow them by hand on paper.
 * [x] JAN.8 Curve only.
 * [x] JAN.9 Interference patterns.
 * [ ] JAN.10 // TREE
 * [ ] JAN.11 Use something other than a computer as an autonomous process (or use a non-computer random source).
 * [ ] JAN.12 Use an API (e.g. the weather). Here’s a huge list of free public APIs.
 * [ ] JAN.13 Do not repeat.
 * [ ] JAN.14 // SUBDIVISION
 * [ ] JAN.15 Let someone else decide the general rules of your piece.
 * [ ] JAN.16 Circles only
 * [ ] JAN.17 Draw a line, pick a new color, move a bit.
 * [ ] JAN.18 One process grows, another process prunes.
 * [ ] JAN.19 Increase the randomness along the Y-axis.
 * [ ] JAN.20 No loops.
 * [ ] JAN.21 function f(x) {  DRAW(x); f(1 * x / 4); f(2 * x / 4); f(3 * x / 4); }
 * [ ] JAN.22 Draw a line. Wrong answers only.
 * [ ] JAN.23 #264653 #2a9d8f #e9c46a #f4a261 #e76f51, no gradients. Optionally, you can use a black or white background.
 * [ ] JAN.24 500 lines.
 * [ ] JAN.25 Make a grid of permutations of something.
 * [ ] JAN.26 2D Perspective.
 * [ ] JAN.27 Gradients without lines.
 * [ ] JAN.28 Use sound.
 * [ ] JAN.29 Any shape, none can touch.
 * [ ] JAN.30 Replicate a natural concept (e.g. gravity, flocking, path following).
 * [ ] JAN.31 10 SEARCH FOR "ENO'S OBLIQUE STRATEGIES". 20 OBTAIN ONE. 30 THAT IS YOUR PROMPT FOR TODAY
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
    return this.genuary_9();

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

  genuary_6() {

    // Polygon radius
    let R = 0.03

    // Equilateral triangle side length
    let side = R * (3 / Math.sqrt(3));

    let paths = new Array();

    let triangle = this.polygon(3, side, Math.PI/6);

    // paths.push(triangle);

    let p;

    for (let y = -6; y <= 6; y++) {
      for (let x = -18; x <= 18; x++) {

        p = Math.random();

        if (p < 0.3) {
          paths.push(
            this.translatePath(
              triangle,
              [x * 3 * R, y * 3 * side]
            )
          )
          paths.push(
            this.translatePath(
              triangle,
              [x * 3 * R - 1.5 * R, y * 3 * side + 1.5 * side]
            )
          )
        }

        if (y > -2 && x > -14 && x < 14 && p < 0.1) {
          paths.push(
            this.translatePath(
              this.scalePath(triangle, 4),
              [x * 3 * R, y * 3 * side]
            )
          )
        }

        if (y > -4 && y < 4 && x > -10 && x < 10 && p < 0.1) {
          paths.push(
            this.translatePath(
              this.scalePath(triangle, -8),
              [x * 3 * R, y * 3 * side]
            )
          )
        }

      }
    }

    // Center artwork on page (loosely)
    for (let p = 0; p < paths.length; p++) {
      paths[p] = this.translatePath(paths[p], [0, 0.0])
    }

    return paths;
  }

  genuary_8() {

    let paths = new Array();

    // Grid test
    let a_max = 5;
    let b_max = 3;
    // let side_length = 2 * (1 / (2 * b_max));
    let shape_radius = 2 * (1/b_max);
    let scale = 1.0;

    /*
    paths = [
        [[0.5, 0.5],
        [0.5, -0.5],
        [-0.5, -0.5],
        [-0.5, 0.5],
        [0.5, 0.5]]
    ];
    //*/

    /*
    paths = [
        [[0.5 * 5/3, 0.5],
        [0.5 * 5/3, -0.5],
        [0.5 * -5/3, -0.5],
        [0.5 * -5/3, 0.5],
        [0.5 * 5/3, 0.5]]
    ];
    //*/

    for (let a = 0; a < a_max; a++) {

        for (let b = 0; b < b_max; b++) {

            // Base shape
            // let base_shape = this.polygon(4, shape_radius, 0);

            // Test shape ("shape_radius" is actually the side length in this case)
            /*
            let base_shape = [
              [-shape_radius/2, shape_radius/2],
              [shape_radius/2, shape_radius/2],
              [shape_radius/2, -shape_radius/2],
              [-shape_radius/2, -shape_radius/2],
              [-shape_radius/2, shape_radius/2]
            ];
            //*/

            // Farris Curve
            //*
            let base_shape = this.farris(10,
              1 + Math.round(Math.random() * 19),
              1 + Math.round(Math.random() * 19),
              1 + Math.round(Math.random() * 19)
            );
            //*/

            // Scale Shape
            let scaled_shape = this.scalePath(base_shape, 1.25)

            // Individual shape Translate
            //*
            let translated_shape = this.translatePath(
                scaled_shape,
                [2 * (a_max/b_max) * (a/a_max), 2 * (b/b_max)]
            );
            //*/

            // Add to paths array
            paths.push(translated_shape);
        }
    }

    // Center the Paths to the canvas

    let centered_path = new Array();
    for (let c = 0; c < paths.length; c++) {
        centered_path.push(
          // this.translatePath(paths[c], [-(a_max/b_max)/2, -0.5])
          this.translatePath(
            paths[c],
            [
              -(a_max/b_max) + shape_radius/2,
              -1 + shape_radius/2
            ]
          )
        )
    }
    paths = centered_path;
    //

    return paths;
  }

  genuary_9() {

    let paths = new Array();

    // Grid test
    let a_max = 10;
    let b_max = 6;
    let shape_radius = 2 * (1/b_max);
    let scale = 1.0;

    for (let a = 0; a < a_max; a++) {

      for (let b = 0; b < b_max; b++) {

        let hash_shape = new Array();
        let c_max = (a+1)
        for (let c = 1; c <= c_max; c++) {

          // Debugging: Grid bounding box
          /*
          paths.push(
            this.translatePath([
                [-shape_radius/2, shape_radius/2],
                [shape_radius/2, shape_radius/2],
                [shape_radius/2, -shape_radius/2],
                [-shape_radius/2, -shape_radius/2],
                [-shape_radius/2, shape_radius/2]
              ],
              [2 * (a_max/b_max) * (a/a_max), 2 * (b/b_max)]
            )
          );
          //*/

          // Horizontal hashes
          let horizontal_hash = [
            [-shape_radius/2, shape_radius * c/c_max - shape_radius/2],
            [shape_radius/2, shape_radius * c/c_max - shape_radius/2]
          ];

          // Center in grid
          horizontal_hash = this.translatePath(
              horizontal_hash,
              [0, (a/(a+1))*(shape_radius/2) - (shape_radius/2)]
          );

          // Scale Shape
          let scaled_shape = this.scalePath(horizontal_hash, 0.675)

          // Individual shape Translate
          //*
          let translated_shape = this.translatePath(
              scaled_shape,
              [2 * (a_max/b_max) * (a/a_max), 2 * (b/b_max)]
          );
          //*/

          // Add to paths array
          paths.push(translated_shape);

          // Vertical Hashes
          paths.push(
            this.translatePath(
              this.rotatePath(
                scaled_shape,
                (1 - (b)/b_max) * Math.PI/2
              ),
              [2 * (a_max/b_max) * (a/a_max), 2 * (b/b_max)]
            )
          )
        }
      }
    }

    // Center the Paths to the canvas

    let centered_path = new Array();
    for (let c = 0; c < paths.length; c++) {
        centered_path.push(
          // this.translatePath(paths[c], [-(a_max/b_max)/2, -0.5])
          this.translatePath(
            paths[c],
            [
              -(a_max/b_max) + shape_radius/2,
              -1 + shape_radius/2
            ]
          )
        )
    }
    paths = centered_path;
    //

    return paths;
  }

  farris(radius, A, B, C) {

    let scale = 1.0
    let rotation = 0.0;

    // Set initial values
    var x;
    var y;
    var theta = 0.0;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Set period of full rotation
    let period = 2 * Math.PI;

    // Set the steps per revolution. Oversample and small distances can be optimized out afterward
    let steps_per_revolution = 1000;

    // Loop through one revolution
    // NOTE: This is not guaranteed to be 1 full cycle. It may be over or under for different A,B,C parameters
    while (theta < period) {

      // Rotational Angle (steps per rotation in the denominator)
      theta = (step/steps_per_revolution) * period

      // Run the parametric equations
      x = (scale/100) * radius * (Math.cos(A*theta) + Math.cos(B*theta)/2 + Math.sin(C*theta)/3);
      y = (scale/100) * radius * (Math.sin(A*theta) + Math.sin(B*theta)/2 + Math.cos(C*theta)/3);

      // Add coordinates to shape array
      path.push([x,y]);

      // Increment iteration counter
      step++;
    }

    // Rotate
    // Every pattern is "rotated" by 12.5 degrees at Theta=0.
    // I'm applying a base rotation so the pattern starts on the X-axis
    // rotation = rotation - Math.atan2(1/3, 1.5) * 180 / Math.PI;
    // path = path.map(function(element) {
    //     return this.rotationMatrix(element[0], element[1], rotation * (Math.PI/180))
    // }, this);

    return path;
  }

  parametric() {

    // Set initial values
    var x;
    var y;

    let paths = new Array();

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    let loops = 50;

    // The number of "sides" to the circle.
    let steps_per_revolution = 120;

    // Loop through one revolution
    let r;

    // Coefficients for random permutations
    let a0 = 1.0;
    let a1;
    let b0 = 1.0
    let b1;
    let c0 = 0;
    let c1;
    let d0 = 0;
    let d1

    for (let i = 0; i < loops; i++) {

      // Introduce random changes to the coefficients
      a1 = a0 + 0.2 * (Math.random() - 0.5);
      b1 = b0 + 0.2 * (Math.random() - 0.5);
      c1 = c0 + 0.03 * (Math.random() - 0.5);
      d1 = d0 + 0.03 * (Math.random() - 0.5);

      var step = 0;
      var t = 0;
      var t_max = 2 * Math.PI
      while (t < t_max) {

        // Rotational Angle (steps per rotation in the denominator)
        t = (step/steps_per_revolution) * t_max;

        // Run the parametric equations

        // Butterfly curve
        // x = 0.3 * Math.sin(t) * (Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5));
        // y = 0.3 * Math.cos(t) * (Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5));

        // Infinity

        // Infinity 1 (https://www.desmos.com/calculator/pu73klljjp)
        //*
        if (Math.cos(2 * t) > 0) {
          r = Math.sqrt(Math.cos(2 * t));
        } else {
          r = 0
        }
        x = r * Math.cos(t);
        y = r * Math.sin(t);

        //*/

        // Infinity 2 ()
        /*
        x = Math.sin(t);
        y = 0.5 * Math.sin(2*t);
        //*/

        // Introduce modified coefficients
        x = x * (a0 + (a1 - a0) * (step/steps_per_revolution)) + (c0 + (c1 - c0) * (step/steps_per_revolution));
        y = y * (b0 + (b1 - b0) * (step/steps_per_revolution)) + (d0 + (d1 - d0) * (step/steps_per_revolution));

        // -- end infinity

        // Add coordinates to shape array
        path.push([x,y]);

        // Increment iteration counter
        step++;
      }

      a0 = a1;
      b0 = b1;
      c0 = c1;
      d0 = d1;
    }

    paths.push(path);

    return paths;
  }

  grid(i = 40, j = 24) {

    let paths = new Array();

    // Grid test
    let a_max = 40;
    let b_max = 24;
    for (let a = 0; a < 2 * a_max; a++) {

        for (let b = 0; b < 2 * b_max; b++) {

            let side_length = 2 * (1 / (2 * b_max));

            // Base shape
            // let base_shape = this.polygon(4, side_length, Math.PI/4);
            let base_shape = [
              [0,0],
              [side_length,0],
              [side_length,side_length],
              [0,side_length],
              [0,0]
            ];

            // Translate
            let translated_shape = this.translatePath(
                base_shape,
                [1 * (a/b_max), 1 * (b/b_max)]
            );

            // Add to paths array
            paths.push(translated_shape);

        }
    }

    // Center the Paths to the canvas
    let centered_path = new Array();
    for (let c = 0; c < paths.length; c++) {
        centered_path.push(this.translatePath(paths[c], [-i/j, -1]))
    }
    paths = centered_path;

    return paths
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