/**
 * Grid
 */
class Grid {

  constructor() {

  }

  draw() {
    return this.grid1();
  }

  grid1() {

    let paths = new Array();

    // Grid test
    let a_max = 5;
    let b_max = 3;
    // let side_length = 2 * (1 / (2 * b_max));
    let shape_radius = 2 * (1/b_max);
    let side_length = 2/3;
    let scale = 1.0;

    let PathHelp = new PathHelper();

    let grid_points = new Array();

    let path = new Array();
    for (let a = 0; a <= a_max; a++) {
      for (let b = 0; b <= b_max; b++) {

        if (grid_points[a] == undefined) {
          grid_points[a] = new Array();
        }
        grid_points[a][b] = [
          PathHelp.getRandom(-0.15, 0.15),
          PathHelp.getRandom(-0.15, 0.15)
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
        let scaled_shape = PathHelp.scalePath(base_shape, 0.9)

        // Individual shape Translate
        let translated_shape = PathHelp.translatePath(
            scaled_shape,
            [2 * (a_max/b_max) * (a/a_max), 2 * (b/b_max)]
        );

        // Subdivide the translated path so that Bezier control points can be extracted
        let sub_shape = PathHelp.subdividePath(translated_shape);

        // Build a new shape composed of Quadratic Bezier curves
        let num_verts = 10;
        let shape = new Array();

        // Build "manually"
        /*

        // Corner 1
        let quadratic_bezier = PathHelp.quadraticBezierPath(
          sub_shape[1],
          sub_shape[2],
          sub_shape[3],
          num_verts
        )
        shape = shape.concat(quadratic_bezier);

        // Corner 2
        quadratic_bezier = PathHelp.quadraticBezierPath(
          sub_shape[3],
          sub_shape[4],
          sub_shape[5],
          num_verts
        )
        shape = shape.concat(quadratic_bezier.slice(-num_verts));

        // Corner 3
        quadratic_bezier = PathHelp.quadraticBezierPath(
          sub_shape[5],
          sub_shape[6],
          sub_shape[7],
          num_verts
        )
        shape = shape.concat(quadratic_bezier.slice(-num_verts));

        // Corner 4
        quadratic_bezier = PathHelp.quadraticBezierPath(
          sub_shape[7],
          sub_shape[0],
          sub_shape[1],
          num_verts
        )
        shape = shape.concat(quadratic_bezier.slice(-num_verts));

        //*/

        // Incomplete generalization of corners
        // Warning: Not tested for shapes with more than 4 corners
        // Warning: Some points may be duplicated!
        let bezier_path = new Array();
        for (let s = 0; s < base_shape.length - 1; s++) {
          bezier_path = PathHelp.quadraticBezierPath(
            sub_shape[((s*2) + 1) % sub_shape.length],
            sub_shape[((s*2) + 2) % sub_shape.length],
            sub_shape[((s*2) + 3) % sub_shape.length],
            num_verts
          )
          shape = shape.concat(bezier_path);
        }

        // Add shape to paths array
        paths.push(shape);
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

}
