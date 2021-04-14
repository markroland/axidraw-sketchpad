/**
 * Grid
 */
class Grid {

  constructor(p5) {
    this.constrain = false

  }

  draw(p5) {
    // this.p5 = p5
    // return this.perspectiveGridWithNoise();
    // return this.grid1()
    // return this.TenPrint(12) // 12 Feels nice
    // return this.SashikoStitching(8, ["black"]);
    return this.SashikoStitching(8, ["cyan", "magenta"]);

    // Hex Grid
    /*
    let hex_columns = 33
    let hex_rows = hex_columns
    let hex_side = (5/3 - -5/3) / (3/2 * hex_columns + 0.5)
    return this.hexGrid(hex_rows, hex_columns, hex_side, 0);
    //*/
  }

  grid1() {

    let paths = new Array();

    // Grid test
    let a_max = 5;
    let b_max = 3;
    let side_length = 2 * (1/b_max);
    let scale = 0.9;
    let corner_randomness = 0.2

    // TODO: This is inverted
    let corner_radius = 0.5;

    let PathHelp = new PathHelper();

    let grid_points = new Array();

    let path = new Array();
    for (let a = 0; a <= a_max; a++) {
      for (let b = 0; b <= b_max; b++) {

        if (grid_points[a] == undefined) {
          grid_points[a] = new Array();
        }
        grid_points[a][b] = [
          PathHelp.getRandom(-corner_randomness, corner_randomness),
          PathHelp.getRandom(-corner_randomness, corner_randomness)
        ]
        // path.push([grid_points[a][b][0],grid_points[a][b][1]])
      }
    }

    // paths.push(path)
    // console.log(grid_points);
    // return paths;

    for (let a = 0; a < a_max; a++) {

      for (let b = 0; b < b_max; b++) {

        // 4-sided closed polygon
        let base_shape = [
          [-side_length/2 + grid_points[a][b][0],   -side_length/2 + grid_points[a][b][1]],
          [ side_length/2 + grid_points[a+1][b][0],   -side_length/2 + grid_points[a+1][b][1]],
          [ side_length/2 + grid_points[a+1][b+1][0],    side_length/2 + grid_points[a+1][b+1][1]],
          [-side_length/2 + grid_points[a][b+1][0],    side_length/2 + grid_points[a][b+1][1]],
          [-side_length/2 + grid_points[a][b][0],   -side_length/2 + grid_points[a][b][1]],
        ]

        // Scale Shape
        let scaled_shape = PathHelp.scalePath(base_shape, scale)

        // Individual shape Translate
        let translated_shape = PathHelp.translatePath(
            scaled_shape,
            [2 * (a_max/b_max) * (a/a_max), 2 * (b/b_max)]
        );

        // Subdivide the translated path so that Bezier control points can be extracted
        let sub_shape = PathHelp.subdividePath(translated_shape);

        // Add diagonals
        /*
        paths.push(
          [sub_shape[0],sub_shape[4]],
          [sub_shape[1],sub_shape[5]],
          [sub_shape[2],sub_shape[6]],
          [sub_shape[3],sub_shape[7]]
        )
        //*/

        // Build a new shape composed of Quadratic Bezier curves
        let num_verts = 10;
        let shape = new Array();

        // Incomplete generalization of corners
        // Warning: Not tested for shapes with more than 4 corners
        // Warning: Some points may be duplicated!
        let bezier_path = new Array();
        let p1, p2, p3, p4;
        for (let s = 0; s < base_shape.length - 1; s++) {

          // Define Bezier control points
          p1 = sub_shape[((s*2) + 1) % sub_shape.length];
          p2 = sub_shape[((s*2) + 2) % sub_shape.length];
          p3 = sub_shape[((s*2) + 3) % sub_shape.length];

          // Move points to control corner radius
          p1 = [
            PathHelp.lerp(p1[0], p2[0], corner_radius),
            PathHelp.lerp(p1[1], p2[1], corner_radius)
          ]
          p3 = [
            PathHelp.lerp(p2[0], p3[0], 1 - corner_radius),
            PathHelp.lerp(p2[1], p3[1], 1 - corner_radius)
          ]

          bezier_path = PathHelp.quadraticBezierPath(p1, p2, p3, num_verts)

          shape = shape.concat(bezier_path);

          p4 = sub_shape[((s*2) + 4) % sub_shape.length];

          shape = shape.concat(
            PathHelp.dividePath([p3, p4], 10)
          )

        }

        // Close path by adding the first point to the end of the path
        shape.push(shape[0])

        // Optional: Add container shape
        // paths.push(translated_shape);

        /*
        let shape_path = new Array();
        for (let p = 0; p < shape.length; p++) {
          shape_path.push(
            shape[p],
            shape[(p + 40) % shape.length]
          )
        }
        paths.push(shape_path);
        //*/

        // Add shape to paths array
        // paths.push(shape);

        // let p_center = PathHelp.center(translated_shape);
        let p_center = PathHelp.intersect_point(sub_shape[1],sub_shape[5],sub_shape[3],sub_shape[7])
        p_center[0] += PathHelp.getRandom(-0.1, 0.1);
        p_center[1] += PathHelp.getRandom(-0.1, 0.1);

        // Add circle inside shape
        let circle = PathHelp.polygon(shape.length-1, 0.25, (2 * Math.PI) * -10/(shape.length-1))
        //*
        paths.push(
          PathHelp.translatePath(
            circle,
            [p_center[0], p_center[1]]
          )
        )
        //*/

        // Rays
        for (let r = 0; r < shape.length; r++) {
          if (r % 4 == 0) {
            paths.push([
              shape[r],
              [
                p_center[0],
                p_center[1]
              ]
            ])
          }
        }

      }
    }

    // Center the Paths to the canvas

    let centered_path = new Array();
    for (let c = 0; c < paths.length; c++) {
        centered_path.push(
          // PathHelp.translatePath(paths[c], [-(a_max/b_max)/2, -0.5])
          PathHelp.translatePath(
            paths[c],
            [
              -(a_max/b_max) + side_length/2,
              -1 + side_length/2
            ]
          )
        )
    }
    paths = centered_path;

    return paths;
  }

  /**
   * Inspiration: https://10print.org
   */
  TenPrint(gridScale) {

    let paths = new Array();

    // Grid test
    let rows = 3 * gridScale;
    let columns = 5 * gridScale;
    let side_length = 2 * (1/rows);


    // Shapes. Defined with local coordinates "[0,0]" at center of shape

    // Square
    let base_shape = [
      [-side_length/2, -side_length/2],
      [ side_length/2, -side_length/2],
      [ side_length/2, side_length/2],
      [-side_length/2, side_length/2],
      [-side_length/2, -side_length/2]
    ]

    // Path option 1
    let forward_slash = [
      [-side_length/2, side_length/2],
      [side_length/2, -side_length/2]
    ]

    // Path option 2
    let back_slash = [
      [-side_length/2, -side_length/2],
      [side_length/2, side_length/2]
    ]

    // --- END Shapes


    let PathHelp = new PathHelper();

    let path = new Array();
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r <  rows; r++) {

        // Randomly select a shape
        if (Math.random() > 0.5) {
          path = forward_slash
        } else {
          path = back_slash
        }

        // Move to position on grid
        path = PathHelp.translatePath(
          path,
          [
            2 * (columns/rows) * (c/columns),
            2 * (r/rows)
          ]
        );

        paths.push(path)
      }
    }

    // Center the Paths to the canvas
    let centered_path = new Array();
    for (let c = 0; c < paths.length; c++) {
      centered_path.push(
        PathHelp.translatePath(
          paths[c],
          [
            -(columns/rows) + side_length/2,
            -1 + side_length/2
          ]
        )
      )
    }
    paths = centered_path;

    return paths
  }

  /**
   * Inspiration: Code as Creative Medium page 159
   */
  SashikoStitching(gridScale, colors) {

    // Grid test
    let rows = 3 * gridScale;
    let columns = 5 * gridScale;
    let side_length = 2 * (1/rows);
    let layers = new Array();
    let paths = new Array();
    let PathHelp = new PathHelper();

    // Seed random values for stitching
    let row_values = new Array()
    for (let a = 0; a <= rows; a++) {
      row_values.push(Math.random() > 0.5 ? 1 : 0)
    }
    let col_values = new Array()
    for (let a = 0; a <= columns; a++) {
      col_values.push(Math.random() > 0.5 ? 1 : 0)
    }

    // Fill Grid
    for (let c = 0; c <= columns; c++) {
      for (let r = 0; r <= rows; r++) {

        // Vertical stitches
        let stitch = false;
        if (col_values[c]) {
          if (r % 2 == 0) {
            stitch = true;
          }
        } else {
          if (r % 2 == 1) {
            stitch = true;
          }
        }
        if (r == rows) {
          stitch = false
        }
        if (stitch) {
          paths.push([
            [
              (c * side_length),
              (r * side_length)
            ],
            [
              (c * side_length),
              (r * side_length) + side_length
            ]
          ])
        }

        // Horizontal stitches
        stitch = false;
        if (row_values[r]) {
          if (c % 2 == 0) {
            stitch = true;
          }
        } else {
          if (c % 2 == 1) {
            stitch = true;
          }
        }
        if (c == columns) {
          stitch = false
        }
        if (stitch) {
          paths.push([
            [
              (c * side_length),
              (r * side_length)
            ],
            [
              (c * side_length) + side_length,
              (r * side_length)
            ]
          ])
        }
      }
    }

    // Center the Paths to the canvas
    for (let i = 0; i < paths.length; i++) {
      paths[i] = PathHelp.translatePath(
        paths[i],
        [
          -5/3,
          -1
        ]
      )
    }

    // Join Paths to reduce pen up/down
    paths = PathHelp.joinPaths(paths, 0.01);

    // One Color
    if (colors.length == 1) {
      layers.push({
        "color": colors[0],
        "paths": paths
      })
      return layers;
    }

    // Split paths between multiple colors

    let layer_paths = new Array(colors.length)
    for (let i = 0; i < paths.length; i++) {
      let layer_index = i % colors.length
      if (typeof layer_paths[layer_index] == 'undefined') {
        layer_paths[layer_index] = new Array();
      }
      layer_paths[layer_index].push(paths[i]);
    }

    for (let i = 0; i < colors.length; i++) {
      layers.push({
        "color": colors[i],
        "paths": layer_paths[i]
      })
    }

    return layers
  }

  /**
   * Build a grid of hexagons of desired dimension
   */
  hexGrid(rows, columns, side_length, offset) {

    let paths = new Array();

    let hex_radius = side_length;
    let hex_height = 2 * hex_radius * (Math.sqrt(3)/2)

    let PathHelp = new PathHelper;

    let hexagon = PathHelp.polygon(6, hex_radius)

    for (let r = 0 + offset; r < rows + offset; r++) {
      for (let c = 0 + offset; c < columns + offset; c++) {

        if (r % 2 == 0 && c % 2 == 0) {
          paths.push(
            PathHelp.translatePath(
              hexagon,
              [
                c/2 * (hex_radius * 3),
                r/2 * hex_height
              ]
            )
          )
        }

        if (r % 2 == 1 && c % 2 == 1) {
          paths.push(
            PathHelp.translatePath(
              hexagon,
              [
                // c/2 * (hex_radius * 3) + 1.5 * hex_radius,
                // r/2 * hex_height + (hex_height/2)
                (c-1)/2 * (hex_radius * 3) + 1.5 * hex_radius,
                (r-1)/2 * hex_height + (hex_height/2)
              ]
            )
          )
        }
      }
    }

    // Center the Paths to the canvas
    paths = PathHelp.centerPaths(paths);

    return paths
  }

  perspectiveGrid() {

    let paths = new Array();

    let i_max = 50;
    for (let i = 0; i < i_max; i++) {
      // let y = i/i_max;
      let y = -0.67 + (-1 + Math.exp(1.0 * (i/i_max)))
      paths.push([
        [-5/3, y],
        [5/3, y]
      ])
    }

    for (let i = 0; i < 50; i++) {
      paths.push([
        [-(i/10) * (1/3), -0.67],
        [-(i/10) * (5/3), 1]
      ])
      paths.push([
        [(i/10) * (1/3), -0.67],
        [(i/10) * (5/3), 1]
      ])
    }

    return paths;
  }

  perspectiveGridWithNoise() {

    let paths = new Array();

    // Horizontal Lines
    let i_max = 30;
    let horizon = new Array();
    for (let i = 0; i < i_max; i++) {
      // let y = i/i_max;
      let y = -0.67 + (-1 + Math.exp(1.0 * (i/i_max)))
      let path = new Array();
      for (let x = -50; x < 50; x++) {

        let noiseVal = 0;
        noiseVal = 0.4 * this.p5.noise((x + 50)/100, y)
        path.push([(x/50) * (5/3), y + noiseVal])
      }
      paths.push(path);

      if (i == 0) {
        horizon = path
      }
    }

    // Vanishing Lines
    for (let x = -50; x < 50; x++) {
      let px = (x/50) * (5/3)
      paths.push([
        [px, horizon[x+50][1]],
        [5 * px, 1]
      ])
    }

    return paths;
  }
}
