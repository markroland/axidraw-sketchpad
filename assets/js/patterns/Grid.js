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
          a * side_length + PathHelp.getRandom(-0.1, 0.1),
          b * side_length + PathHelp.getRandom(-0.1, 0.1)
        ]
        path.push([grid_points[a][b][0],grid_points[a][b][1]])
      }
    }

    // paths.push(path)
    // console.log(grid_points);
    // return paths;

    for (let a = 0; a < a_max; a++) {

      for (let b = 0; b < b_max; b++) {

        // Test shape ("side_length" is actually the side length in this case)
        /*
        let base_shape = [
          [-side_length/2, side_length/2],
          [side_length/2, side_length/2],
          [side_length/2, -side_length/2],
          [-side_length/2, -side_length/2],
          [-side_length/2, side_length/2]
        ];
        //*/

        let base_shape = [
          [grid_points[a][b][0], grid_points[a][b][1]],
          [grid_points[a+1][b][0], grid_points[a+1][b][1]],
          [grid_points[a+1][b+1][0], grid_points[a+1][b+1][1]],
          [grid_points[a][b+1][0], grid_points[a][b+1][1]],
          [grid_points[a][b][0], grid_points[a][b][1]],
        ]

        // Scale Shape
        let scaled_shape = PathHelp.scalePath(base_shape, 1.0)

        // Individual shape Translate
        // let translated_shape = scaled_shape;
        /*
        let translated_shape = PathHelp.translatePath(
            scaled_shape,
            [2 * (a_max/b_max) * (a/a_max), 2 * (b/b_max)]
        );
        //*/

        //*
        let translated_shape = PathHelp.translatePath(
            scaled_shape,
            [-(5/3)/4, -(2/3)/2]
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
