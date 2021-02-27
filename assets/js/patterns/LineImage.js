/**
 * Image
 */
class LineImage {

  constructor() {

  }

  draw(p5, imported_image) {
    this.p5 = p5

    let paths = new Array();

    // paths = this.calcLines(imported_image);
    // paths = this.calcOutlines(p5, imported_image);
    // paths = this.calcHash(p5, imported_image);
    paths = this.fillPixels(p5, imported_image)

    return paths;
  }

  calcHash(p5, imported_image) {

    let paths = new Array();

    let downscale = 1/10;

    // 2: 0 (black), 255 (white)
    // 4: 0 85, 170, 255 (Increments of 255/3)
    let num_shades = 4;

    // Render Original Image
    // p5.image(imported_image, 0, 0);

    // Downscale original image
    imported_image.resize(imported_image.width * downscale, imported_image.height * downscale)

    // Sample Downscaled image
    imported_image.loadPixels();
    let pixelCount = imported_image.width * imported_image.height;
    let image_array = new Array();
    let x = 0;
    let y = 0;
    for (let i = 0; i < pixelCount; i++) {

      // Get average intensity of RGB color channels
      let average = (imported_image.pixels[i*4 + 0] + imported_image.pixels[i*4 + 1] + imported_image.pixels[i*4 + 2]) / 3;
      let clamped_intensity = p5.round((average/255) * (num_shades-1)) * (255/(num_shades-1));
      // console.log(average, clamped_intensity);

      imported_image.pixels[i*4 + 0] = clamped_intensity;
      imported_image.pixels[i*4 + 1] = clamped_intensity;
      imported_image.pixels[i*4 + 2] = clamped_intensity;
      imported_image.pixels[i*4 + 3] = 255;

      y = Math.floor(i / imported_image.width)
      x = i % imported_image.width

      // Save intensity value to new array
      if (image_array[y] == undefined) {
        image_array[y] = new Array();
      }
      image_array[y][x] = clamped_intensity
    }
    imported_image.updatePixels();

    // Render image
    // p5.image(imported_image, 24, 24);

    //*/
    // End: End load image

    // Render to paths

    let pixel_size = 2 / imported_image.height

    for (let a = 0; a < image_array.length; a++) {
      for (let b = 0; b < image_array[a].length; b++) {

        // Render in "p5 land"
        /*
        p5.noStroke();
        p5.fill(image_array[a][b])
        p5.rectMode(p5.CORNER);
        p5.rect(b * 4, a * 4, 4, 4)
        //*/

        if (image_array[a][b] < 255 * 3/(num_shades-1)) {
          // Hatch: Diagonal top-left to bottom-right
          paths.push([
            [2 * ((b / imported_image.width) - 0.5), 2 * (a / imported_image.width - 0.5)],
            [2 * ((b / imported_image.width) - 0.5) + pixel_size, 2 * (a / imported_image.width - 0.5) + pixel_size],
          ])

        }

        if (image_array[a][b] < 255 * 2/(num_shades-1)) {
          // Hatch: Diagonal top-right to bottom-left
          paths.push([
            [2 * ((b / imported_image.width) - 0.5) + pixel_size, 2 * (a / imported_image.width - 0.5)],
            [2 * ((b / imported_image.width) - 0.5), 2 * (a / imported_image.width - 0.5) + pixel_size],
          ])
        }

        if (image_array[a][b] < 255 * 1/(num_shades-1)) {
          // Hatch: Horizonal
          paths.push([
            [2 * ((b / imported_image.width) - 0.5), 2 * (a / imported_image.width - 0.5) + pixel_size/2],
            [2 * ((b / imported_image.width) - 0.5) + pixel_size, 2 * (a / imported_image.width - 0.5) + pixel_size/2],
          ])
        }
      }
    }
    p5.noFill()

    return paths;
  }

  calcLines(imported_image) {

    // Initialize drawing paths
    let paths = new Array();

    // Reduce the dimensions of the image
    let downscale = 1/6;

    // 2: 0 (black), 255 (white)
    // 4: 0 85, 170, 255 (Increments of 255/3)
    let num_shades = 2;

    // Downscale original image
    imported_image.resize(imported_image.width * downscale, imported_image.height * downscale)

    // Reduce the number of tones in the image
    let image_array = this.posterize(imported_image, num_shades)

    // Render image pixels to paths
    let scale = 2;
    let renderLines = new Array();

    // Horizontal lines
    //*
    for (let row = 0; row < image_array.length; row++) {
      let start_col = null
      for (let col = 0; col < image_array[row].length; col++) {
        if (image_array[row][col] < 255) {
          if (start_col === null) {
            start_col = col
          }
        } else {
          if (start_col !== null) {
            renderLines.push([
              [scale * ((start_col / imported_image.width) - 0.5),        scale * (row / imported_image.width - 0.5)],
              [scale * ((col / imported_image.width) - 0.5), scale * (row / imported_image.width - 0.5)],
            ]);
            start_col = null
          }
        }

        // Terminate line at the end of the row if a line has already been started
        if (start_col !== null && col == image_array[row].length - 1) {
          renderLines.push([
            [scale * ((start_col / imported_image.width) - 0.5),        scale * (row / imported_image.width - 0.5)],
            [scale * ((col / imported_image.width) - 0.5), scale * (row / imported_image.width - 0.5)],
          ]);
        }
      }
    }
    //*/

    // Vertical lines
    let verticalLines = new Array();
    //*
    for (let col = 0; col < image_array[0].length; col++) {
      let start_row = null
      for (let row = 0; row < image_array.length; row++) {
        if (image_array[row][col] < 255) {
          if (start_row === null) {
            start_row = row
          }
        } else {
          if (start_row !== null) {
            verticalLines.push([
              [scale * (((col + 0.5) / imported_image.width) - 0.5), scale * ((start_row - 0.5) / imported_image.width - 0.5)],
              [scale * (((col + 0.5) / imported_image.width) - 0.5), scale * ((row) / imported_image.width - 0.5)],
            ]);
            start_row = null
          }
        }

        // Terminate line at the end of the column if a line has already been started
        if (start_row !== null && row == image_array.length - 1) {
          verticalLines.push([
            [scale * (((col + 0.5) / imported_image.width) - 0.5), scale * ((start_row - 0.5) / imported_image.width - 0.5)],
            [scale * (((col + 0.5) / imported_image.width) - 0.5), scale * ((row) / imported_image.width - 0.5)],
          ]);
        }
      }
    }
    //*/

    // Combine vertical lines with the horizontal lines
    renderLines = renderLines.concat(verticalLines)

    paths = renderLines;

    return paths;

    // Convert straight lines to wavy lines with Perlin noise
    let segmentation = 0.01
    let perlinLines = new Array();
    for (let l = 0; l < renderLines.length; l++) {
      let perlinLine = new Array();
      let y_offset = (Math.random() - 0.5) * 0.005

      // Break the path down into small segments to apply noise
      let segments = (renderLines[l][1][0] - renderLines[l][0][0]) / segmentation;
      for (let m = 0; m < segments; m++) {

        // Calculate X
        let x = renderLines[l][0][0] + ((m/segments) * (renderLines[l][1][0] - renderLines[l][0][0]));

        // Add Perlin noise
        let c1 = 0.05
        let c2 = 0.1
        let y = y_offset + renderLines[l][1][1] + c1 * this.p5.noise((x+1), c2 * renderLines[l][1][1])

        // Add additional randomness
        y = y + (Math.random()/300)

        perlinLine.push([x,y]);
      }
      perlinLines.push(perlinLine);
    }

    paths = perlinLines;

    return paths;
  }

  calcOutlines(p5, imported_image) {

    // Initialize drawing paths
    let paths = new Array();

    // Reduce the dimensions of the image
    let downscale = 1/8;

    let orig_width = imported_image.width;
    let orig_height = imported_image.height;

    // Downscale original image
    imported_image.resize(imported_image.width * downscale, imported_image.height * downscale)

    // Debugging: Render image
    // p5.image(imported_image, 24, 24);

    // Reduce the number of tones in the image
    let image_array = this.posterize(imported_image, 16)

    // Contour "Marching Squares"
    let lines = new Array();
    let num_steps = 8
    for (let i = 1; i < num_steps; i++) {

      // Log progress to console since this is slow
      console.log(i)

      let threshold = i * (256/num_steps);
      lines = lines.concat(p5.marchingSquares(image_array, threshold));
    }

    let scaling_factor = (orig_width * downscale) / 2;
    for (let l = 0; l < lines.length; l++) {

      // TODO: Identity closed paths and join as single shape

      paths.push([
        [
          (lines[l][0] - scaling_factor) / scaling_factor,
          (lines[l][1] - scaling_factor) / scaling_factor
        ],
        [
          (lines[l][2] - scaling_factor) / scaling_factor,
          (lines[l][3] - scaling_factor) / scaling_factor
        ]
      ])
    }

    return paths;
  }

  fillPixels(p5, imported_image) {

    let PathHelp = new PathHelper;

    // Initialize drawing paths
    let paths = new Array();

    // Reduce the dimensions of the image
    let desired_pixels_per_side = 20;
    let downscale = 1/(imported_image.width/desired_pixels_per_side);

    // 2: 0 (black), 255 (white)
    // 4: 0 85, 170, 255 (Increments of 255/3)
    let num_shades = 12;

    // Downscale original image
    imported_image.resize(imported_image.width * downscale, imported_image.height * downscale)

    // Render Original Image
    // p5.image(imported_image, 0, 0);

    // Reduce the number of tones in the image
    let image_array = this.posterize(imported_image, num_shades)

    // Render image pixels to paths
    let scale = 2;
    let pixel_size = 2 / imported_image.height
    let renderLines = new Array();

    // Render "pixels"
    let num_rows = image_array.length
    let num_columns = image_array[0].length
    for (let row = 0; row < num_rows; row++) {

      for (let col = 0; col < num_columns; col++) {

        // Set the linear index (0 to row * col)  of the pixel
        let index = (row * num_columns) + (col % num_columns)

        // Set the X and Y coordinates of the pixels
        let pixel_x = 2 * ((col / imported_image.width) - 0.5);
        let pixel_y = 2 * (row / imported_image.width - 0.5)

        // Set path to fill the pixel
        let pixel_path = this.renderWeavePixel(num_shades, image_array[row][col], index)

        // Scale and translate the pixel paths into place on the canvas
        for (let p = 0; p < pixel_path.length; p++) {
          paths.push(
            PathHelp.translatePath(
              PathHelp.scalePath(pixel_path[p], pixel_size),
              [pixel_x, pixel_y]
            )
          );
        }

      }
    }

    return paths;
  }

  /**
   * Fill a 1 x 1 "pixel" unit with horizontal or vertical lines
   * that represent a hue value
   * @param {integer} levels - The number of hue values (Max 255)
   * @param {float} value - The value to render
   * @param {integer} index - The pixel position to render, used for alternating pattern
   * @returns {array} A Path array the local coordinates 0 to 1 in the X and Y directions
   */
  renderWeavePixel(levels, value, index) {

    let paths = new Array();

    let num = (255 - value)/255 * levels

    for (let l = 0; l < num; l++) {
      let path = [
        [0,l/num],
        [1,l/num]
      ]
      if (index % 2 == 0) {
        path = [
          [l/num, 0],
          [l/num, 1]
        ]
      }
      paths.push(path)
    }

    return paths;
  }

  posterize(image, levels) {

    // Sample Downscaled image
    image.loadPixels();
    let pixelCount = image.width * image.height;
    let image_array = new Array();
    let x = 0;
    let y = 0;
    for (let i = 0; i < pixelCount; i++) {

      // Get average intensity of RGB color channels
      let average = (image.pixels[i*4 + 0] + image.pixels[i*4 + 1] + image.pixels[i*4 + 2]) / 3;
      let clamped_intensity = this.p5.round((average/255) * (levels-1)) * (255/(levels-1));
      // console.log(average, clamped_intensity);

      y = Math.floor(i / image.width)
      x = i % image.width

      // Save intensity value to new array
      if (image_array[y] == undefined) {
        image_array[y] = new Array();
      }
      image_array[y][x] = clamped_intensity
    }

    return image_array;
  }

}
