/**
 * WolframRules
 *
 * https://en.wikipedia.org/wiki/Rule_30
 * https://p5js.org/examples/simulate-wolfram-ca.html
 */
class WolframRules {

  constructor() {

    this.key = "wolframrules";

    this.name = "WolframRules";
  }

  setup() {

    let width = 80
    let height = 48

    this.w = 2 * (1 / (2 * height))

    // We arbitrarily start with just the middle cell having a state of "1"
    this.generation = 0;
    this.total_generations = 2 * height;

    // First generation of cells with the middle cell "active"
    // An array of 0s and 1s
    // let cells = Array(Math.floor(width / this.w));
    let cells = Array(width*2);
    for (let i = 0; i < cells.length; i++) {
      cells[i] = 0;
    }
    cells[cells.length/2] = 1;
    this.cells = cells;

    // An array to store the ruleset, for example {0,1,1,0,1,1,0,1}
    // this.ruleset = [0, 1, 0, 1, 1, 0, 1, 0];
    this.ruleset = [0, 0, 0, 1, 1, 1, 1, 0];
  }

  /**
   * Draw path
   */
  draw() {
    // return this.draw_pyramid();
    return this.draw_circle();
  }

  draw_circle() {

    // We arbitrarily start with just the middle cell having a state of "1"
    this.generation = 0;
    this.total_generations = 140;

    let start_generation = 80;

    // First generation of cells with the middle cell "active"
    // An array of 0s and 1s
    let cells = Array(120);
    for (let i = 0; i < cells.length; i++) {
      cells[i] = 0;
    }
    cells[cells.length/2] = 1;
    this.cells = cells;

    // An array to store the ruleset, for example {0,1,1,0,1,1,0,1}
    // this.ruleset = [0, 1, 0, 1, 1, 0, 1, 0];
    this.ruleset = [0, 0, 0, 1, 1, 1, 1, 0];

    let path = new Array();

    let radius;

    // Pre-run generations without rendering them
    for (let g = 0; g < start_generation; g++) {
      this.generate();
    }

    // for (let g = 0; g < this.total_generations; g++) {
    let i = 0;
    do {

      radius = 0.0 + (1.0 * i/(this.total_generations-start_generation));

      let polygon = new Array();
      let polygon_theta = 0.0;
      let crop = 20;
      for (let a = crop; a <= this.cells.length - crop; a++) {
        polygon_theta = (a/(this.cells.length - 2 * crop)) * (2 * Math.PI);
        if (this.cells[a] === 1) {
          path.push([
            [
              radius * Math.cos(polygon_theta - Math.PI/(this.cells.length - 2 * crop)),
              radius * Math.sin(polygon_theta - Math.PI/(this.cells.length - 2 * crop))
            ],
            [
              radius * Math.cos(polygon_theta + Math.PI/(this.cells.length - 2 * crop)),
              radius * Math.sin(polygon_theta + Math.PI/(this.cells.length - 2 * crop))
            ]
          ])
        }
      }

      i++;

      this.generate();

    } while (this.generation < this.total_generations)

    return path;
  }

  draw_pyramid() {

    this.setup();

    let path = new Array();

    let g = 0;

    let pregen = 0;

    // for (g = 0; g < pregen; g++) {
    //   this.generate();
    // }

    // for (g = 0; g < this.total_generations; g++) {
    for (g = pregen; g < this.total_generations; g++) {

      for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === 1) {

          /*
          let square = [
            [i * this.w + 0, this.generation * this.w + 0],
            [i * this.w + this.w, this.generation * this.w + 0],
            [i * this.w + this.w, this.generation * this.w + this.w],
            [i * this.w + 0, this.generation * this.w + this.w],
            [i * this.w + 0, this.generation * this.w + 0]
          ];
          path.push(square)
          //*/

          /*
          let square = [
            [i * this.w + 0, this.generation * this.w + 0],
            [i * this.w + this.w, this.generation * this.w + 0],
            [i * this.w + this.w, this.generation * this.w + this.w],
            [i * this.w + 0, this.generation * this.w + this.w],
            [i * this.w + 0, this.generation * this.w + 0]
          ];
          path.push(square)
          //*/

          //*
          let base_shape = this.polygon(8, 0.015, Math.PI/8);
          let translated_shape = this.translatePath(
              base_shape,
              [i * this.w, (this.generation) * this.w]
          );
          path.push(translated_shape);
          //*/

          // "X" shape
          /*
          path.push([
            [(i * this.w) + 0, (this.generation - pregen) * this.w + 0],
            [(i * this.w) + 1.0 * this.w, (this.generation - pregen) * this.w + 1.0 * this.w]
          ])
          path.push([
            [(i * this.w) + 1.0 * this.w, (this.generation - pregen) * this.w + 0],
            [(i * this.w) + 0, (this.generation - pregen) * this.w + 1.0 * this.w],
          ])
          //*/

        }
      }

      this.generate();
    }

    // Grid test
    /*
    let a_max = 40
    let b_max = 24
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
            path.push(translated_shape);

        }
    }
    //*/

    /*
    return [[
      [-5/3,1],
      [5/3,1],
      [5/3,-1],
      [-5/3,-1],
      [-5/3,1]
    ]]
    //*/

    //*
    // Center the Paths to the canvas
    let centered_path = new Array();
    for (let i = 0; i < path.length; i++) {
        centered_path.push(this.translatePath(path[i], [-(5/3), -1]))
    }
    path = centered_path;
    //*/

    return path;
  }

  // The process of creating the new generation
  generate() {

    // First we create an empty array for the new values
    let nextgen = Array(this.cells.length);

    // For every spot, determine new state by examing current state, and neighbor states
    // Ignore edges that only have one neighor
    for (let i = 1; i < this.cells.length-1; i++) {
      let left   = this.cells[i-1];   // Left neighbor state
      let me     = this.cells[i];     // Current state
      let right  = this.cells[i+1];   // Right neighbor state
      nextgen[i] = this.rules(left, me, right); // Compute next generation state based on ruleset
    }

    // The current generation is the new generation
    this.cells = nextgen;
    this.generation++;
  }

  // Implementing the Wolfram rules
  // Could be improved and made more concise, but here we can explicitly see what is going on for each case
  rules(a, b, c) {
    if (a == 1 && b == 1 && c == 1) return this.ruleset[0];
    if (a == 1 && b == 1 && c == 0) return this.ruleset[1];
    if (a == 1 && b == 0 && c == 1) return this.ruleset[2];
    if (a == 1 && b == 0 && c == 0) return this.ruleset[3];
    if (a == 0 && b == 1 && c == 1) return this.ruleset[4];
    if (a == 0 && b == 1 && c == 0) return this.ruleset[5];
    if (a == 0 && b == 0 && c == 1) return this.ruleset[6];
    if (a == 0 && b == 0 && c == 0) return this.ruleset[7];
    return 0;
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
}