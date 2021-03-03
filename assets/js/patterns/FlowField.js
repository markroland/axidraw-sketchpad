/**
 * FlowField
 */
class FlowField {

  constructor(p5) {
    this.constrain = false
  }

  draw(p5) {
    this.p5 = p5
    // return this.drawField(12)
    return this.drawFieldPaths(2000)
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

        // Get field value
        let theta = this.getFieldValue(c,r);
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

  drawFieldPaths(count) {

    let segment_length = 0.02
    let min_length = 5;
    let max_length = 20;

    let PathHelp = new PathHelper();

    let paths = new Array();
    let path = new Array();

    for(var i = 0; i < count; i++) {

      // Select random point in field
      let pos = {
        "x": PathHelp.getRandom(-5/3, 5/3),
        "y": PathHelp.getRandom(-1, 1)
      }
      let prev_pos = pos;

      path = [[pos.x, pos.y]];
      let s_max = PathHelp.map(Math.random(), 0, 1, min_length, max_length)
      for (var s = 0; s < s_max; s++) {

        // Get field value
        // let theta = this.getFieldValue(pos.x, pos.y);
        let theta = this.getNoiseValue(pos.x, pos.y);

        // Calculate position of new point
        pos.x = pos.x + segment_length * Math.cos(theta)
        pos.y = pos.y + segment_length * Math.sin(theta)

        // Add point to path
        path.push([pos.x, pos.y]);
      }

      // Add path to all paths
      paths.push(path)
    }

    return paths
  }

  getNoiseValue(x,y) {
    let input_scale = 0.5;
    let output_scale = 1.0;
    let PathHelp = new PathHelper();
    let value = output_scale * this.p5.noise(x * input_scale, y * input_scale)
    return PathHelp.map(value, 0, 1, 0, 2 * Math.PI)
  }

  getFieldValue(x,y) {
    return (x + y) * 0.5 * Math.PI * 2;
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