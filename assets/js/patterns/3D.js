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
  draw() {
    // return this.sketch1()
    return this.sketch2(2)
  }

  sketch1() {

    let PathHelp = new PathHelper;
    let layers = new Array();
    let paths = new Array();
    let path = new Array();

    // Set angle of shape rotation
    let angle = (5/100) * (2 * Math.PI);

    // Define 3D shape (cube) (x,y,z)
    let points = [
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5]
    ];

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

      let rotated = this.matrixMultiply(rotationY, points[i]);
      rotated = this.matrixMultiply(rotationX, rotated);

      let distance = 2;
      let z = 1 / (distance - rotated[2]);
      const projection = [
        [z, 0, 0],
        [0, z, 0]
      ];
      rotated = this.matrixMultiply(rotationZ, rotated);

      // Project model onto 2D surface
      let projected2d = this.matrixMultiply(projection, rotated);

      // Scale as necessary
      projected2d = this.matrixMultiply(projected2d, 0.5)

      // Push point to path
      path.push([
        projected2d[0], projected2d[1]
      ])
    }

    // Connect points to create paths (edges)
    for (let i = 0; i < 4; i++) {
      paths.push(
        new Array(
          path[i],
          path[(i + 1) % 4]
        )
      );
      paths.push(
        new Array(
          path[i + 4],
          path[((i + 1) % 4) + 4],
        )
      );
      paths.push(
        new Array(
          path[i],
          path[i + 4]
        )
      );
    }

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  sketch2(gridScale) {

    let PathHelp = new PathHelper;
    let layers = new Array();

    // Grid test
    let rows = 3 * gridScale;
    let columns = 5 * gridScale;
    // let side_length = (1/rows);
    let side_length = (1/gridScale) * 0.33

    // Define 3D shape (cube) (x,y,z)
    let points = [
      [-side_length, -side_length, -side_length],
      [ side_length, -side_length, -side_length],
      [ side_length,  side_length, -side_length],
      [-side_length,  side_length, -side_length],
      [-side_length, -side_length,  side_length],
      [ side_length, -side_length,  side_length],
      [ side_length,  side_length,  side_length],
      [-side_length,  side_length,  side_length]
    ];

    // Fill Grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {

        let paths = new Array();
        let path = new Array();

        // Index position
        let id = (r * columns) + c;

        // Set angle of shape rotation
        // let angle = (c / columns) * (0.5 * Math.PI);
        let angle = (id / (rows * columns)) * (2 * Math.PI);

        // Set Transformation matrices (rotrations)
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

        // Loop through Model points and apply transformation and projection
        let projected = [];
        for (let i = 0; i < points.length; i++) {

          // Apply rotation
          let rotated = this.matrixMultiply(rotationY, points[i]);
          rotated = this.matrixMultiply(rotationX, rotated);
          rotated = this.matrixMultiply(rotationZ, rotated);

          // Project model onto 2D surface
          // Calculate "weak perspective" on Z Axis
          let distance = 2;
          let z = 1 / (distance - rotated[2]);
          const projection = [
            [z, 0, 0],
            [0, z, 0]
          ];
          let projected2d = this.matrixMultiply(projection, rotated);

          // Push point to path
          path.push([
            projected2d[0], projected2d[1]
          ])
        }

        // Connect points to create paths (edges)
        for (let i = 0; i < 4; i++) {
          paths.push(
            new Array(
              path[i],
              path[(i + 1) % 4]
            )
          );
          paths.push(
            new Array(
              path[i + 4],
              path[((i + 1) % 4) + 4],
            )
          );
          paths.push(
            new Array(
              path[i],
              path[i + 4]
            )
          );
        }

        // Translate to position on grid
        for (let i = 0; i < paths.length; i++) {

          // Distribute shapes across grid
          // Top-left of this is at local origin (center of canvas)
          paths[i] = PathHelp.translatePath(
            paths[i],
            [
              (2 * (columns/rows) * (c/columns)),
              (2 * (r/rows))
            ]
          )

          // Move from center to top-left
          paths[i] = PathHelp.translatePath(
            paths[i],
            [
              -5/3 + 1/rows,
              -1 + 1/rows
            ]
          )
        }

        // Put each model/shape on its own layer
        layers.push({
          "color": "cyan",
          "paths": paths
        })

      }
    }

    return layers;
  }

  /**
   * Multiply two matrices
   * @param Array Input Matrix
   * @param Array Input Matrix
   * @return Array
   */
  matrixMultiply(a, b) {
    let result = new Array(b.length)
    for (let i = 0; i < a.length; i++) {
      if (Array.isArray(b)) {
        result[i] = this.dotProduct(a[i], b)
      } else {
        result[i] = a[i] * b
      }
    }
    return result;
  }

  /**
   * Perform the dot product between two matrices
   * @param Array Input Matrix
   * @param Array Input Matrix
   * @return Integer Scalar dot product
   */
  dotProduct(a, b) {
    let dot_product = 0;
    for (let i = 0; i < a.length; i++) {
      dot_product += a[i] * b[i]
    }
    return dot_product;
  }

}