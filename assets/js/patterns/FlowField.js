/**
 * FlowField
 */
class FlowField {

  constructor(p5) {
    this.constrain = false
  }

  draw(p5, imported_image) {
    this.p5 = p5
    // return this.drawField(12)
    // return this.drawFieldPaths(2000)
    return this.drawImageFieldPaths(120, imported_image)
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

    let segment_length = 0.01
    let min_length = 10;
    let max_length = 50;

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
        // let theta = this.getNoiseValue(pos.x, pos.y);
        let theta = this.getGardenFence(pos.x, pos.y)

        // Calculate position of new point
        pos.x = pos.x + segment_length * Math.cos(theta)
        pos.y = pos.y + segment_length * Math.sin(theta)

        // Stop path if too close to the edge (within 1/4")
        if (Math.abs(pos.x) > 1.833 || Math.abs(pos.y) > 1.167) {
          break;
        }

        // Add point to path
        path.push([pos.x, pos.y]);
      }

      // Add path to all paths
      paths.push(path)
    }

    // Sort paths for improved plotting efficiency
    paths = PathHelp.sortPaths(paths)

    return paths
  }

  drawImageFieldPaths(gridScale, imported_image) {

    let PathHelp = new PathHelper();

    let paths = new Array();

    const y_max = 1;
    const y_min = -1;

    // Grid test
    let rows = 3 * gridScale;
    let columns = 5 * gridScale;

    let cell_width = (y_max - y_min) * (1/rows);

    let downscale = 1/4;

    // Render Original Image
    // p5.image(imported_image, 48, 48);

    // Downscale original image
    // imported_image.resize(imported_image.width * downscale, imported_image.height * downscale)
    imported_image.resize(columns, rows)

    // Sample Downscaled image
    imported_image.loadPixels();
    let pixelCount = imported_image.width * imported_image.height;
    let image_array = new Array();
    let x = 0;
    let y = 0;
    for (let i = 0; i < pixelCount; i++) {
      let pixel_intensity = (imported_image.pixels[i*4 + 0] + imported_image.pixels[i*4 + 1] + imported_image.pixels[i*4 + 2]) / 3;
      y = Math.floor(i / imported_image.width)
      x = i % imported_image.width
      if (image_array[y] == undefined) {
        image_array[y] = new Array();
      }
      image_array[y][x] = pixel_intensity
    }
    imported_image.updatePixels();

    let path = new Array();
    let segment_length = 0.01
    let min_length = 10;
    let max_length = 40;
    let num_lines = 1000
    for(var i = 0; i < num_lines; i++) {

      // Select random point in field
      let pos = {
        "x": PathHelp.getRandom(-5/3, 5/3),
        "y": PathHelp.getRandom(-1, 1)
      }
      let prev_pos = pos;

      path = [[pos.x, pos.y]];
      // let s_max = PathHelp.map(Math.random(), 0, 1, min_length, max_length)
      let y = parseInt(Math.floor(PathHelp.map(pos.y, -1, 1, 1, rows-2)))
      let x = parseInt(Math.floor(PathHelp.map(pos.x, -5/3, 5/3, 1, columns-2)))
      let s_max = PathHelp.map(255 - image_array[y][x], 0, 255, min_length, max_length)
      for (var s = 0; s < s_max; s++) {

        // Get field value
        // console.log(pos.y, pos.x)
        y = parseInt(Math.floor(PathHelp.map(pos.y, -1, 1, 1, rows-2)))
        x = parseInt(Math.floor(PathHelp.map(pos.x, -5/3, 5/3, 1, columns-2)))
        // let y = Math.floor(this.p5.map(pos.y, -1, 1, 1, rows-2))
        // let x = Math.floor(this.p5.map(pos.x, -5/3, 5/3, 1, columns-2))
        // console.log(y, image_array[y])
        let theta = (image_array[y][x]/255) * (2 * Math.PI);
        // let theta = Math.random() * 2 * Math.PI

        // Calculate position of new point
        pos.x = pos.x + segment_length * Math.cos(theta)
        pos.y = pos.y + segment_length * Math.sin(theta)

        // Stop path if too close to the edge (within 1/4")
        if (Math.abs(pos.x) > 5/3 || Math.abs(pos.y) > 1) {
          break;
        }

        // Add point to path
        path.push([pos.x, pos.y]);
      }

      // Add path to all paths
      paths.push(path)
    }


    // Center the Paths to the canvas
    // paths = this.centerPaths(rows, columns, cell_width, paths);

    return paths
  }

  getNoiseValue(x,y) {
    let input_scale = 0.5;
    let output_scale = 1.0;
    let PathHelp = new PathHelper();
    let value = output_scale * this.p5.noise(x * input_scale, y * input_scale)
    return PathHelp.map(value, 0, 1, 0, 2 * Math.PI)
  }

  // Credit https://medium.com/@bit101/flow-fields-part-i-3ebebc688fd8
  getGardenFence(x,y) {
    return (Math.sin(x * 11.0) + Math.sin(y * 11.0)) * Math.PI * 2;
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