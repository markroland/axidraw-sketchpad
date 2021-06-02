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
    return this.truchetRainbows(5, 6)
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

  // Inspired by Paul Rickards (@paulrickards) - https://twitter.com/paulrickards/status/1383899993862332423?s=20
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

    // Compose the arcs that make up the top-left of the cell tile
    let arcs = new Array();
    for (let a = 1; a < num_arcs; a++) {

      let arc = this.arc(
        [-side_length/2, -side_length/2],
        side_length * (a/num_arcs),
        Math.PI/2,
        0,
        12
      );

      arcs.push(arc);
    }

    // Compose the arcs that make up the bottom-right of the cell tile
    for (let a = 1; a < num_arcs; a++) {

      let theta_start = Math.PI;
      let theta_end = theta_start + Math.PI/2;

      // Arcs that are less than or equal to half way across the cell tile can be drawn in full
      if (a/(num_arcs+1) <= 0.5) {

        arcs.push(
          this.arc(
            [side_length/2, side_length/2],
            side_length * (a/num_arcs),
            theta_end - theta_start,
            theta_start,
            12
          )
        );

      } else {

        // Arcs that are half way across the cell tile must be split into 2 arcs
        // so that they do not overlap existing arcs on the other corner of the cell

        // Calculate where the intersection happens
        // This is used to draw 2 smaller arcs on the bottom-left and top-right
        let intersection_point = PathHelp.circleInterceptPoints([0,0], a, [-num_arcs, num_arcs], num_arcs-1, -1)
        let theta_intersect = Math.atan2(intersection_point[1], intersection_point[0]);

        // This is an offset for the coordinate system
        theta_intersect = Math.PI - theta_intersect

        // Use the intersect point to calculate the new end Theta
        theta_end = theta_start + theta_intersect;

        // TODO: Something like this could be used to calculate the number of segments
        // desired to create a smooth curve, but for now the hard-coded values (12 for full ardc
        // and 4 for a sub-arc) are just fine.
        // let segments_per_revolution = 48;
        // let delta_revolution = theta / (2 * Math.PI);
        // let max_s = segments_per_revolution * delta_revolution;

        // Build first sub-arc
        arcs.push(
          this.arc(
            [side_length/2, side_length/2],
            side_length * (a/num_arcs),
            theta_end - theta_start,
            theta_start,
            4
          )
        );

        // Build the second sub-arc
        theta_end = 3/2 * Math.PI;
        theta_start = theta_end - theta_intersect;
        arcs.push(
          this.arc(
            [side_length/2, side_length/2],
            side_length * (a/num_arcs),
            theta_end - theta_start,
            theta_start,
            4
          )
        );
      }
    }

    // Build Grid
    // Top to bottom, left to right
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {

        // Randomly rotate the cell tile
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

    // Find the index of the longest path
    // https://stackoverflow.com/questions/33577266/find-the-index-of-the-longest-array-in-an-array-of-arrays
    var indexOfLongestArray = paths.reduce((acc, arr, idx) => {
      return arr.length > paths[acc].length ? idx : acc
    }, 0)

    // Remove a path
    let index_to_remove = indexOfLongestArray;
    // let index_to_remove = PathHelp.getRndInteger(0, paths.length),
    paths.splice(
      index_to_remove,
      1
    );

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

  /**
   * Compose an arc
   * Description incomplete
   * @param Array An array of position [x,y]
   * @param float The radius of the arc from the position
   * @param float The number of radius to rotate through the arc
   * @param float A radian offset from which to start the arc
   * @param integer The number of line segments used to render the arc
   * @return Array A Path array of points
   **/
  arc(position, radius, theta, theta_offset, segments) {
    let path = new Array();
    for (let s = 0; s <= segments; s++) {
      path.push([
        position[0] + radius * Math.cos(theta_offset + s/segments * theta),
        position[0] + radius * Math.sin(theta_offset + s/segments * theta)
      ])
    }
    return path;
  }

}