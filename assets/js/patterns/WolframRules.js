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

    this.w = 0.06;

    let width = 3.0
    let height = 4.0

    // We arbitrarily start with just the middle cell having a state of "1"
    this.generation = 0;
    this.total_generations = 34;

    // First generation of cells with the middle cell "active"
    // An array of 0s and 1s
    let cells = Array(Math.floor(width / this.w));
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

    this.setup();

    let path = new Array();

    for (let g = 0; g < this.total_generations; g++) {

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

          path.push([
            [i * this.w + 0, this.generation * this.w + 0],
            [i * this.w + this.w, this.generation * this.w + this.w]
          ])
          path.push([
            [i * this.w + this.w, this.generation * this.w + 0],
            [i * this.w + 0, this.generation * this.w + this.w],
          ])

          // path.push(square)
        }
      }

      this.generate();
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