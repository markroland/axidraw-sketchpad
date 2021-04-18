/**
 * 3D
 *
 * Transformation code modified from Coding Train "3D Rendering with Rotation and Projection"
 *  - https://thecodingtrain.com/CodingChallenges/112-3d-rendering.html
 *  - https://editor.p5js.org/codingtrain/sketches/r8l8XXD2A
 *
 */
class ThreeD {

  constructor() {

    this.key = "3d";

    this.name = "3D";

    this.constrain = false
  }

  /**
   * Draw path
   */
  draw(p5) {
    this.p5 = p5
    return this.sketch1(p5)
  }

  sketch1(p5) {

    let PathHelp = new PathHelper;
    let layers = new Array();
    let paths = new Array();
    let path = new Array();

    // Set angle of shape rotation
    let angle = (5/100) * (2 * Math.PI);

    // Define 3D shape (cube) (x,y,z)
    let points = [];
    points[0] = p5.createVector(-0.5, -0.5, -0.5);
    points[1] = p5.createVector(0.5, -0.5, -0.5);
    points[2] = p5.createVector(0.5, 0.5, -0.5);
    points[3] = p5.createVector(-0.5, 0.5, -0.5);
    points[4] = p5.createVector(-0.5, -0.5, 0.5);
    points[5] = p5.createVector(0.5, -0.5, 0.5);
    points[6] = p5.createVector(0.5, 0.5, 0.5);
    points[7] = p5.createVector(-0.5, 0.5, 0.5);

    const rotationZ = [
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle),  Math.cos(angle), 0],
      [0, 0, 1]
    ];

    const rotationX = [
      [1, 0, 0],
      [0, Math.cos(angle), -Math.sin(angle)],
      [0, Math.sin(angle),  Math.cos(angle)]
    ];

    const rotationY = [
      [ Math.cos(angle), 0, Math.sin(angle)],
      [0, 1, 0],
      [-Math.sin(angle), 0, Math.cos(angle)]
    ];

    let projected = [];

    // Loop through Model points and apply transformation and projection
    for (let i = 0; i < points.length; i++) {

      // Apply rotation
      let rotated = this.matmul(rotationY, points[i]);
      rotated = this.matmul(rotationX, rotated);


      // Project on to plane
      let distance = 2;
      let z = 1 / (distance - rotated.z);
      const projection = [
        [z, 0, 0],
        [0, z, 0]
      ];

      rotated = this.matmul(rotationZ, rotated);

      // Project model onto 2D surface
      let projected2d = this.matmul(projection, rotated);

      // Scale as necessary
      // projected2d.mult(0.5);

      // Push point to path
      path.push([
        projected2d.x, projected2d.y
      ])
    }

    // Connect points to edges
    for (let i = 0; i < 4; i++) {
      paths.push(
        this.connect(i, (i + 1) % 4, path)
      );
      paths.push(
        this.connect(i + 4, ((i + 1) % 4) + 4, path)
      );
      paths.push(
        this.connect(i, i + 4, path)
      );
    }


    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  // Everything below here is lifted from https://editor.p5js.org/codingtrain/sketches/r8l8XXD2A

  connect(i, j, points) {
    let path = new Array();
    path.push(points[i])
    path.push(points[j])
    return path;
  }

  // Daniel Shiffman
  // http://youtube.com/thecodingtrain
  // http://codingtra.in
  // Javascript transcription: Chuck England

  // Coding Challenge #112: 3D Rendering with Rotation and Projection
  // https://youtu.be/p4Iz0XJY-Qk

  // Matrix Multiplication
  // https://youtu.be/tzsgS19RRc8

  logMatrix(m) {
    const cols = m[0].length;
    const rows = m.length;
    console.log(rows + "x" + cols);
    console.log("----------------");
    let s = '';
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        s += (m[i][j] + " ");
      }
      console.log(s);
    }
    console.log();
  }

  vecToMatrix(v) {
    let m = [];
    for (let i = 0; i < 3; i++) {
      m[i] = [];
    }
    m[0][0] = v.x;
    m[1][0] = v.y;
    m[2][0] = v.z;
    return m;
  }

  matrixToVec(m) {
    return this.p5.createVector(m[0][0], m[1][0], m.length > 2 ? m[2][0] : 0);
  }

  matmulvec(a, vec) {
    let m = this.vecToMatrix(vec);
    let r = this.matmul(a, m);
    return this.matrixToVec(r);
  }

  matmul(a, b) {
    if (b instanceof p5.Vector) {
      return this.matmulvec(a, b);
    }

    let colsA = a[0].length;
    let rowsA = a.length;
    let colsB = b[0].length;
    let rowsB = b.length;

    if (colsA !== rowsB) {
      console.error("Columns of A must match rows of B");
      return null;
    }

    let result = [];
    for (let j = 0; j < rowsA; j++) {
      result[j] = [];
      for (let i = 0; i < colsB; i++) {
        let sum = 0;
        for (let n = 0; n < colsA; n++) {
          sum += a[j][n] * b[n][i];
        }
        result[j][i] = sum;
      }
    }
    return result;
  }
}