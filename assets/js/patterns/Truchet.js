/**
 * Truchet Tiling
 *
 * https://en.wikipedia.org/wiki/Truchet_tiles
 */
class Truchet {

  constructor() {

    this.key = "truchet";

    this.name = "Truchet Tiling";

    this.constrain = false
  }

  /**
   * Draw path
   */
  draw(p5) {
    // return this.sketch1(5)
    return this.truchetRainbows(5, 4)
    // return this.sketch2(5)
    // return this.gridPetals(3)
  }

  sketch1(gridScale) {

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    let path = new Array();

    // Grid test
    let rows = 3 * gridScale;
    let columns = 5 * gridScale;
    let side_length = 2 * (1/rows);

    // Shapes. Defined with local coordinates "[0,0]" at center of shape

    // Square
    let square = [
      [-side_length/2, -side_length/2],
      [ side_length/2, -side_length/2],
      [ side_length/2, side_length/2],
      [-side_length/2, side_length/2],
      [-side_length/2, -side_length/2]
    ]

    // Arc 1
    let arc1 = new Array();
    for (let a = 0; a <= 12; a++) {
      arc1.push([
        -side_length/2 + side_length/2 * Math.cos(a/12 * Math.PI/2),
        -side_length/2 + side_length/2 * Math.sin(a/12 * Math.PI/2)
      ])
    }

    // Arc 2
    let arc2 = new Array();
    for (let a = 0; a <= 12; a++) {
      arc2.push([
        side_length/2 + side_length/2 * Math.cos(a/12 * Math.PI/2 + Math.PI),
        side_length/2 + side_length/2 * Math.sin(a/12 * Math.PI/2 + Math.PI)
      ])
    }

    // Build Grid
    // Top to bottom, left to right
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {

        // Square Grid (Optional)
        /*
        paths.push(
          PathHelp.translatePath(
            square,
            [
              2 * (columns/rows) * (c/columns),
              2 * (r/rows)
            ]
          )
        )
        //*/

        let rotation = PathHelp.getRndInteger(0,1)

        // Arc 1 - top of cell
        paths.push(
          PathHelp.translatePath(
            PathHelp.rotatePath(
              arc1,
              (rotation/4) * (2 * Math.PI)
            ),
            [
              2 * (columns/rows) * (c/columns),
              2 * (r/rows)
            ]
          )
        )

        // Arc 2 - bottom of cell
        paths.push(
          PathHelp.translatePath(
            PathHelp.rotatePath(
              arc2,
              (rotation/4) * (2 * Math.PI)
            ),
            [
              2 * (columns/rows) * (c/columns),
              2 * (r/rows)
            ]
          )
        )

      }
    }

    // Debugging - Reduces paths
    // paths = paths.slice(0,3)

    // Join Paths
    paths = PathHelp.joinPaths(paths, 0.01);

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

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  truchetRainbows(gridScale, num_arcs) {

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    let path = new Array();

    // Grid test
    let rows = 3 * gridScale;
    let columns = 5 * gridScale;
    let side_length = 2 * (1/rows);

    // Shapes. Defined with local coordinates "[0,0]" at center of shape

    // Arcs
    let r = side_length
    let arcs = new Array();
    for (let a = 1; a < num_arcs; a++) {

      // Build arc of set radius
      let arc = new Array();
      let r = side_length * (a/num_arcs);
      let num_segments = 12;
      for (let s = 0; s <= num_segments; s++) {
        arc.push([
          -side_length/2 + r * Math.cos(s/num_segments * Math.PI/2),
          -side_length/2 + r * Math.sin(s/num_segments * Math.PI/2)
        ])
      }
      arcs.push(arc);
    }
    //*/

    // Construct the arcs
    for (let a = 1; a < num_arcs; a++) {

      let theta_start = Math.PI;
      let theta_end = theta_start + Math.PI/2;
      let theta1 = null;

      if (a/(num_arcs+1) > 0.5) {
        let intersect1 = PathHelp.circleInterceptPoints([0,0], a, [-num_arcs, num_arcs], num_arcs-1, -1)
        theta1 = Math.atan2(intersect1[1], intersect1[0]);

        // Math.PI is a reference adjustment
        theta_end = theta_start + (Math.PI - theta1);
      }

      let arc = new Array();
      let r = side_length * (a/num_arcs);
      let segments_per_revolution = 48;
      let delta_revolution = (theta_end - theta_start) / (2 * Math.PI);
      // let delta_revolution = 0.25
      // let max_s = segments_per_revolution * delta_revolution;
      let max_s = 8;
      for (let s = 0; s <= max_s; s++) {

        let point = [
          side_length/2 + r * Math.cos(theta_start + s/max_s * (theta_end - theta_start)),
          side_length/2 + r * Math.sin(theta_start + s/max_s * (theta_end - theta_start))
        ]

        // Check if the point is with largest radius arc
        // on the other side of the cell
        arc.push(point)
      }

      if (arc.length !== 0) {
        arcs.push(arc);
      }

      // Second arc
      if (a/(num_arcs+1) > 0.5) {

        theta_end = 3/2 * Math.PI;
        theta_start = theta_end - (Math.PI - theta1);

        arc = new Array();
        r = side_length * (a/num_arcs);
        // segments_per_revolution = 48;
        // delta_revolution = (theta_end - theta_start) / (2 * Math.PI);
        // let delta_revolution = 0.25
        // max_s = Math.ceil(segments_per_revolution * delta_revolution);
        max_s = 8;
        // console.log(max_s)
        for (let s = 0; s <= max_s; s++) {

          let point = [
            side_length/2 + r * Math.cos(theta_start + s/max_s * (theta_end - theta_start)),
            side_length/2 + r * Math.sin(theta_start + s/max_s * (theta_end - theta_start))
          ]

          // Check if the point is with largest radius arc
          // on the other side of the cell
          arc.push(point)
        }

        // if (a/(num_arcs+1) <= 0.5) {
        if (arc.length !== 0) {
          arcs.push(arc);
        }
      }

    }

    // Build Grid
    // Top to bottom, left to right
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {

        // Square Grid for debugging
        /*
        paths.push(
          PathHelp.translatePath(
            square,
            [
              2 * (columns/rows) * (c/columns),
              2 * (r/rows)
            ]
          )
        )
        //*/

        // Randomly rotate the cell/tile
        let rotation = PathHelp.getRndInteger(0,3)

        // Arcs
        for (let arc of arcs) {
          paths.push(
            PathHelp.translatePath(
              PathHelp.rotatePath(
                arc,
                (rotation/4) * (2 * Math.PI)
              ),
              [
                2 * (columns/rows) * (c/columns),
                2 * (r/rows)
              ]
            )
          )
        }
      }
    }

    // Join Paths
    paths = PathHelp.joinPaths(paths, 0.01);

    // Center the Paths to the canvas
    paths = PathHelp.centerPaths(paths);

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  /**
   * Split paths into layers by color
   */
  sketch2(gridScale) {

    let layers = new Array();
    layers.push({
      "color": "cyan",
      "paths": new Array()
    })
    layers.push({
      "color": "magenta",
      "paths": new Array()
    })

    let truchet1 = this.sketch1(gridScale)

    for (let i = 0; i < truchet1[0].paths.length; i++) {
      if (i % 2 == 0) {
        layers[0].paths.push(truchet1[0].paths[i])
      } else {
        layers[1].paths.push(truchet1[0].paths[i])
      }
    }

    let truchet2 = this.sketch1(gridScale)
    layers.push({
      "color": "yellow",
      "paths": truchet2[0].paths
    })

    return layers;
  }

  gridPetals(gridScale) {

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    let path = new Array();

    // Grid test
    let rows = 3 * gridScale;
    let columns = 5 * gridScale;
    let side_length = 2 * (1/rows);

    // Shapes. Defined with local coordinates "[0,0]" at center of shape

    // Square
    let square = [
      [-side_length/2, -side_length/2],
      [ side_length/2, -side_length/2],
      [ side_length/2, side_length/2],
      [-side_length/2, side_length/2],
      [-side_length/2, -side_length/2]
    ]

    // Arc
    let arc = new Array();
    for (let a = 0; a <= 12; a++) {
      arc.push([
        side_length/2 * Math.cos(a/12 * Math.PI),
        -side_length/2 + side_length/2 * Math.sin(a/12 * Math.PI)
      ])
    }

    // Build Grid
    // Top to bottom, left to right
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {

        // Square Grid (Optional)
        /*
        paths.push(
          PathHelp.translatePath(
            square,
            [
              2 * (columns/rows) * (c/columns),
              2 * (r/rows)
            ]
          )
        )
        //*/

        // Arc
        for (let a = 0; a < 4; a++) {
          paths.push(
            PathHelp.translatePath(
              PathHelp.rotatePath(
                arc,
                (a/4) * (2 * Math.PI)
              ),
              [
                2 * (columns/rows) * (c/columns),
                2 * (r/rows)
              ]
            )
          )
        }

      }
    }

    // Debugging - Reduces paths
    // paths = paths.slice(0,3)

    // Join Paths
    paths = PathHelp.joinPaths(paths, 0.01);

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

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }
}