/**
 * FlowField
 */
class FlowField {

  constructor(p5) {
    this.constrain = false
  }

  draw(p5) {
    return this.drawField(12)
  }

  drawField(gridScale) {

    let PathHelp = new PathHelper();

    let paths = new Array();

    const y_max = 1;
    const y_min = -1;

    // Grid test
    let rows = 3 * gridScale;
    let columns = 5 * gridScale;

    let cell_width = (y_max - y_min) * (1/rows);

    // Define a path with it's own local origin
    let line = [
      [-cell_width/2, 0],
      [cell_width/2, 0]
    ]

    // Loop through grid
    let path = new Array();
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {

        // randomly rotate path
        // let theta = PathHelp.getRandom(0, 2 * Math.PI)
        let theta = (c + r) * 0.01 * Math.PI * 2;
        path = PathHelp.rotatePath(line, theta)

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
    paths = this.centerPaths(rows, columns, cell_width, paths);

    return paths
  }

  centerPaths(rows, columns, cell_width, paths) {
    let PathHelp = new PathHelper();
    let centered_path = new Array();
    for (let c = 0; c < paths.length; c++) {
      centered_path.push(
        PathHelp.translatePath(
          paths[c],
          [
            -(columns/rows) + cell_width/2,
            -1 + cell_width/2
          ]
        )
      )
    }
    return centered_path
  }

}