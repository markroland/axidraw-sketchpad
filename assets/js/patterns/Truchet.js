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
    return this.sketch1()
  }

  sketch1() {

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    let path = new Array();

    // Minimum grid is 3 x 5. Gridscale multiplies these dimensions
    let gridScale = 3

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

    console.log(paths)
    paths = PathHelp.joinPaths(paths, 0.1);
    console.log('joinPaths finished.')

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