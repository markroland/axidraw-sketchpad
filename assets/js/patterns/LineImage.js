/**
 * Image
 */
class LineImage {

  constructor() {

    this.key = "lineimage";

    this.name = "Line Image";

    this.constrain = false

    this.config = {
      "lower": {
        "name": "Lower Bound",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            255,
            120,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "upper": {
        "name": "Upper Bound",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            255,
            180,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      }
    };

  }

  draw(p5, imported_image) {
    this.p5 = p5

    // return this.calcLines(imported_image);
    // return this.calcOutlines(p5, imported_image);
    // return this.calcHatch(p5, imported_image);
    // return this.fillPixels(p5, imported_image, 'box');
    // return this.fillPixels(p5, imported_image, 'weave');
    // return this.fillPixels(p5, imported_image, 'spiral');
    // return this.fillPixels(p5, imported_image, 'fermatSpiral');
    // return this.drawHatchSolid(p5, imported_image);
    // return this.drawHatchColor(p5, imported_image);
    // return this.dither(p5, imported_image, true);
    // return this.edgeDetection(p5, imported_image);
    return this.edgeDetectionConvexHull(p5, imported_image)
    // return this.combo(p5, imported_image)
  }

  drawHatchColor(p5, imported_image) {

    imported_image.resize(imported_image.width * 1/4, imported_image.height * 1/4)

    let layers = new Array();

    layers.push({
      "color": "cyan",
      "paths": this.calcHatch(p5, imported_image, 'cyan')
    });

    layers.push({
      "color": "magenta",
      "paths": this.calcHatch(p5, imported_image, 'magenta')
    });

    layers.push({
      "color": "yellow",
      "paths": this.calcHatch(p5, imported_image, 'yellow')
    });

    layers.push({
      "color": "black",
      "paths": this.calcHatch(p5, imported_image, 'key')
    });
    return layers;
  }

  drawHatchSolid(p5, imported_image) {

    let layers = new Array();

    imported_image.resize(imported_image.width * 1/4, imported_image.height * 1/4)

    let paths = this.calcHatch(p5, imported_image, "black")

    layers.push({
      "color": "black",
      "paths": paths
    });

    return layers
  }

  calcHatch(p5, imported_image, color) {

    let paths = new Array();

    // 1: 480 x 288
    // 1/2: 240 x 144
    // 1/4: 120 x 72
    // 1/8: 60 x 36
    // 1/16: 30 x 18
    // 1/32: 15 x 9
    // 1/96: 5 x 3
    let downscale = 1/4;

    // 2: 0 (black), 255 (white)
    // 4: 0 85, 170, 255 (Increments of 255/3)
    let num_shades = 6;

    // Render Original Image
    // p5.image(imported_image, 48, 48);

    // Downscale original image
    // imported_image.resize(imported_image.width * downscale, imported_image.height * downscale)

    // Sample Downscaled image
    imported_image.loadPixels();
    let pixelCount = imported_image.width * imported_image.height;
    let image_array = new Array();
    let x = 0;
    let y = 0;
    let intensity;
    let clamped_intensity;
    let key, cyan, magenta, yellow
    let red, green, blue
    for (let i = 0; i < pixelCount; i++) {

      // Parse out RGB intensity
      red = imported_image.pixels[i*4 + 0] / 255
      green = imported_image.pixels[i*4 + 1] / 255
      blue = imported_image.pixels[i*4 + 2] / 255

      // Set CYMK "Key" value
      key = 1 - Math.max(red, green, blue)

      // Get intensity from pixel
      // https://www.rapidtables.com/convert/color/rgb-to-cmyk.html
      if (color == "cyan") {
        // intensity = (imported_image.pixels[i*4 + 1] + imported_image.pixels[i*4 + 2]) / 1;
        cyan = (1 - red - key) / (1 - key)
        intensity = Math.floor((1 - cyan) * 255)
        clamped_intensity = p5.round((intensity/255) * (num_shades-1)) * (255/(num_shades-1));
      } else if (color == "magenta") {
        magenta = (1 - green - key) / (1 - key)
        intensity = Math.floor((1 - magenta) * 255)
        clamped_intensity = p5.round((intensity/255) * (num_shades-1)) * (255/(num_shades-1));
      } else if (color == "yellow") {
        yellow = (1 - blue - key) / (1 - key)
        intensity = Math.floor((1 - yellow) * 255)
        clamped_intensity = p5.round((intensity/255) * (num_shades-1)) * (255/(num_shades-1));
      } else if (color == "key") {
        intensity = Math.floor((1 - key) * 255)
        clamped_intensity = p5.round((intensity/255) * (num_shades-1)) * (255/(num_shades-1));
      } else {
        intensity = Math.floor(((red + green + blue) / 3) * 255);
        clamped_intensity = p5.round((intensity/255) * (num_shades-1)) * (255/(num_shades-1));
      }

      y = Math.floor(i / imported_image.width)
      x = i % imported_image.width

      // Save intensity value to new array
      if (image_array[y] == undefined) {
        image_array[y] = new Array();
      }
      image_array[y][x] = clamped_intensity
    }

    // Render to paths

    let pixel_size = 2 / imported_image.height
    let rows = image_array.length
    let columns = image_array[0].length

    // Initialize output arrays
    let horizontal_hatches = new Array();
    let vertical_hatches = new Array();
    let forwardslash_hatches = new Array();
    let backslash_hatches = new Array();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {

        let x = col * pixel_size;
        let y = row * pixel_size;

        // Initialize arrays to store each hatch direction
        // This is used later to combine connect hatch pixels
        if (horizontal_hatches[row] === undefined) {
          horizontal_hatches[row] = new Array();
        }
        horizontal_hatches[row][col] = false;

        if (vertical_hatches[row] === undefined) {
          vertical_hatches[row] = new Array();
        }
        vertical_hatches[row][col] = false

        if (forwardslash_hatches[row] === undefined) {
          forwardslash_hatches[row] = new Array();
        }
        forwardslash_hatches[row][col] = false

        if (backslash_hatches[row] === undefined) {
          backslash_hatches[row] = new Array();
        }
        backslash_hatches[row][col] = false

        // Render in "p5 land"
        /*
        p5.noStroke();
        p5.fill(image_array[row][col])
        p5.rectMode(p5.CORNER);
        p5.rect(
          48 + col * (1/downscale),
          48 + row * (1/downscale),
          (1/downscale),
          (1/downscale)
        )
        //*/

        // Darkest shade
        if (image_array[row][col] < 255 * 4/(num_shades-1)) {
          // Hatch: Diagonal top-left to bottom-right
          backslash_hatches[row][col] = true
          // paths.push([
          //   [x + pixel_size/2, y + pixel_size/2],
          //   [x - pixel_size/2, y - pixel_size/2]
          // ])
        }

        if (image_array[row][col] < 255 * 3/(num_shades-1)) {
          // Hatch: Diagonal top-right to bottom-left
          forwardslash_hatches[row][col] = true
          // paths.push([
          //   [x - pixel_size/2, y + pixel_size/2],
          //   [x + pixel_size/2, y - pixel_size/2]
          // ])
        }

        if (image_array[row][col] < 255 * 2/(num_shades-1)) {
          // Hatch: Horizontal
          horizontal_hatches[row][col] = true
          // paths.push([
          //   [x - pixel_size/2, y],
          //   [x + pixel_size/2, y]
          // ])
        }

        // Lightest Shade
        if (image_array[row][col] < 255 * 1/(num_shades-1)) {
          // Hatch: Vertical
          vertical_hatches[row][col] = true
          // paths.push([
          //   [x, y - pixel_size/2],
          //   [x, y + pixel_size/2]
          // ])
        }

      }
    }

    // Array to hold hatch lines of all orientations
    let renderLines = new Array();

    // Horizontal Lines (-)
    //*
    renderLines = []
    for (let row = 0; row < rows; row++) {
      let start_line_pos = null

      for (let col = 0; col < columns; col++) {

        if (horizontal_hatches[row][col]) {
          // Start a new line if the the row/column should be "active" and a line hasn't yet been started
          if (start_line_pos === null) {
            start_line_pos = col
          }
        } else if (start_line_pos !== null) {

          // End of line, either by pixel value

          // console.log("end: ", row, col)

          // console.log("saving: ", row, col)

          // Save path for rendering
          renderLines.push([
            [
              col * pixel_size - pixel_size/2,
              row * pixel_size
            ],
            [
              start_line_pos * pixel_size - pixel_size/2,
              row * pixel_size
            ]
          ]);

          // Clear line start flag
          start_line_pos = null
        }

        if ( start_line_pos !== null && col + 1 == columns) {

          // End of line by end of row

          // Save path for rendering
          renderLines.push([
            [
              (col+1) * pixel_size - pixel_size/2,
              row * pixel_size
            ],
            [
              start_line_pos * pixel_size - pixel_size/2,
              row * pixel_size
            ]
          ]);

          // Clear line start flag
          start_line_pos = null
        }

      }
    }
    paths = paths.concat(renderLines);
    //*/

    // Vertical Lines (|)
    // console.log(vertical_hatches)
    //*
    renderLines = []
    for (let col = 0; col < columns; col++) {
      let start_line_pos = null
      for (let row = 0; row < rows; row++) {

        if (vertical_hatches[row][col]) {
          // Start a new line if the the row/column should be "active" and a line hasn't yet been started
          if (start_line_pos === null) {
            start_line_pos = row
          }
        } else if (start_line_pos !== null) {

          // End of line, either by pixel value or end of row (last column)

          // Save path for rendering
          renderLines.push([
            [
              col * pixel_size,
              start_line_pos * pixel_size - pixel_size/2
            ],
            [
              col * pixel_size,
              row * pixel_size + pixel_size/2
            ]
          ]);

          // Clear line start flag
          start_line_pos = null
        }

        if (start_line_pos !== null && row + 1 == rows) {

          // End of line, either by pixel value or end of row (last column)

          // Save path for rendering
          renderLines.push([
            [
              col * pixel_size,
              start_line_pos * pixel_size - pixel_size/2
            ],
            [
              col * pixel_size,
              row * pixel_size + pixel_size/2
            ]
          ]);

          // Clear line start flag
          start_line_pos = null
        }


      }
    }
    paths = paths.concat(renderLines);
    //*/

    // Forward Slash Lines (/)
    //*
    renderLines = []
    // https://www.jstips.co/en/javascript/flattening-multidimensional-arrays-in-javascript/
    let forwardslash_hatches_1D = [].concat(...forwardslash_hatches);
    for (let i = 0; i < forwardslash_hatches_1D.length; i++) {

      // Skip to next pixel if current pixel not filled in
      if (forwardslash_hatches_1D[i] == false) {
        continue;
      }

      // Set the current pixel position as the line start position
      let start_row = Math.floor(i/columns)
      let start_col = i % columns;

      // Loop through next eligibile pixels that could connect and extend this line
      let active_line = true
      let end_pos = i
      let j = 1;
      do {

        // First pixel in column connects to self. No need for further analysis
        if (start_col == 0) {
          let active_line = false
          break;
        }

        // Set the array index of the pixel that is in the next position for the line
        let next_pixel = i + (j * (columns - 1))

        // Exit loop if the next pixel is past the end of available pixels
        if (next_pixel > forwardslash_hatches_1D.length) {
          break;
        }

        // If that pixel is a continuation of the line, then update the ending position
        // but if it's not stop the loop
        if (forwardslash_hatches_1D[next_pixel]) {
          end_pos = next_pixel

          // Hide the covered pixel from future iterations
          forwardslash_hatches_1D[next_pixel] = false

        } else {

          // Next pixel is not active, so set flag to exit loop
          active_line = false;
        }

        // Stop checking when the first column is reached
        if (next_pixel % columns == 0) {
          active_line = false
        }

        // Increment counter used to get the next pixel location
        j++;

      } while(active_line);

      // Set the end row and column based on the ending pixel position
      let end_row = Math.floor(end_pos/columns)
      let end_col = end_pos % columns;

      // Add the line to the paths
      renderLines.push([
        [
          start_col * pixel_size + pixel_size/2,
          start_row * pixel_size - pixel_size/2
        ],
        [
          end_col * pixel_size - pixel_size/2,
          end_row * pixel_size + pixel_size/2
        ]
      ]);

    }
    paths = paths.concat(renderLines);
    //*/

    // Back Slash Lines (\)
    //*
    renderLines = []
    // https://www.jstips.co/en/javascript/flattening-multidimensional-arrays-in-javascript/
    let backslash_hatches_1D = [].concat(...backslash_hatches);
    for (let i = 0; i < backslash_hatches_1D.length; i++) {

      // Set the current pixel position as the line start position
      let start_row = Math.floor(i/columns)
      let start_col = i % columns;

      // Skip to next pixel if current pixel not filled in
      if (backslash_hatches_1D[i] == false) {
        continue;
      }

      // Loop through next eligibile pixels that could connect and extend this line
      let active_line = true
      let end_pos = i
      let j = 1;
      do {
        // Set the array index of the pixel that is in the next position for the line
        let next_pixel = i + (j * (columns + 1))

        // Exit loop if the next pixel is past the end of available pixels
        if (next_pixel > backslash_hatches_1D.length) {
          break;
        }

        // Stop checking if the last column
        if (end_pos % columns == (columns-1)) {
          break;
        }

        // If that pixel is a continuation of the line, then update the ending position
        // but if it's not stop the loop
        if (backslash_hatches_1D[next_pixel]) {
          end_pos = next_pixel

          // Hide the covered pixel from future iterations
          backslash_hatches_1D[next_pixel] = false

        } else {

          // Next pixel is not active, so set flag to exit loop
          active_line = false;
        }

        // Increment counter used to get the next pixel location
        j++;

      } while(active_line);

      // Set the end row and column based on the ending pixel position
      let end_row = Math.floor(end_pos/columns)
      let end_col = end_pos % columns;

      // Add the line to the paths
      renderLines.push([
        [
          start_col * pixel_size - pixel_size/2,
          start_row * pixel_size - pixel_size/2
        ],
        [
          end_col * pixel_size + pixel_size/2,
          end_row * pixel_size + pixel_size/2
        ]
      ]);

    }
    paths = paths.concat(renderLines);
    //*/

    // Set for p5 rendering usage
    p5.noFill()

    // Flip start/end points for alternate paths to reduce
    // distance a plotter needs to move with the pen up
    for (let i = 0; i < paths.length; i++) {
      if (i % 2) {
        paths[i] = [
          paths[i][1],
          paths[i][0]
        ]
      }
    }

    // Center the Paths to the canvas
    //*
    let PathHelp = new PathHelper
    let centered_path = new Array();
    for (let c = 0; c < paths.length; c++) {
      centered_path.push(
        PathHelp.translatePath(
          paths[c],
          [
            -(columns/rows) + pixel_size/2,
            -1 + pixel_size/2
          ]
        )
      )
    }
    paths = centered_path;
    //*/

    return paths;
  }

  calcLines(imported_image, noise = false) {

    let PathHelp = new PathHelper;
    let ImageHelp = new ImageHelper

    // Initialize drawing paths
    let paths = new Array();

    // Reduce the dimensions of the image
    let downscale = 1/2;

    // 2: 0 (black), 255 (white)
    // 4: 0 85, 170, 255 (Increments of 255/3)
    let num_shades = 2;

    // Downscale original image
    imported_image.resize(imported_image.width * downscale, imported_image.height * downscale)

    // Reduce the number of tones in the image
    let image_array = ImageHelp.posterize(imported_image, num_shades)

    // console.log(image_array)

    // Render image pixels to paths
    let scale = (5/3) * 2; // Where does this value come from??
    let shift = 0 // -0.5
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

            renderLines.push(
              PathHelp.translatePath(
                [
                  [scale * ((start_col / imported_image.width)),        scale * (row / imported_image.width)],
                  [scale * ((col / imported_image.width)), scale * (row / imported_image.width)],
                ],
                [-5/3, -1]
              )
            );

            start_col = null
          }
        }

        // Terminate line at the end of the row if a line has already been started
        if (start_col !== null && col == image_array[row].length - 1) {
          renderLines.push(
              PathHelp.translatePath(
                [
                  [scale * ((start_col / imported_image.width)),        scale * (row / imported_image.width)],
                  [scale * ((col / imported_image.width)), scale * (row / imported_image.width)],
                ],
                [-5/3, -1]
              )
            );
        }
      }
    }
    //*/

    // Vertical lines
    let verticalLines = new Array();
    /*
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
    // renderLines = renderLines.concat(verticalLines)

    paths = renderLines;

    if (!noise) {
      return [{
        "color": "black",
        "paths": paths
      }]
    }

    // Convert straight lines to wavy lines with Perlin noise
    let segmentation = 0.01
    let perlinLines = new Array();
    for (let l = 0; l < renderLines.length; l++) {
      let perlinLine = new Array();
      // let y_offset = (Math.random() - 0.5) * 0.005
      let y_offset = 0

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

    return [{
      "color": "black",
      "paths": paths
    }];
  }

  calcOutlines(p5, imported_image, color) {

    let PathHelp = new PathHelper()
    let ImageHelp = new ImageHelper

    let layers = new Array();

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
    let image_array = ImageHelp.posterize(imported_image, 16)

    // Contour "Marching Squares"
    let lines = new Array();
    let num_steps = 8
    for (let i = 1; i < num_steps; i++) {

      let lines = new Array();

      // Log progress to console since this is slow
      console.log('Marching Squares Step:', i, 'of', (num_steps - 1))

      let threshold = i * (256/num_steps);
      lines = lines.concat(p5.marchingSquares(image_array, threshold));

      // Combine the 4-point lines sets (x1, y1, x2, y2) into paths
      let line_segments = new Array();
      let scaling_factor = (orig_width * downscale) / 2;
      for (let l = 0; l < lines.length; l++) {
        line_segments.push([
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

      // Join Paths
      let joined_lines = PathHelp.joinPaths(line_segments, 0.01);

      paths = paths.concat(joined_lines)
    }

    // Smooth with an averaging filter
    for (let p = 0; p < paths.length-1; p++) {
      paths[p] = PathHelp.smoothPath(paths[p])
    }

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  fillPixels(p5, imported_image, technique) {

    let PathHelp = new PathHelper;
    let ImageHelp = new ImageHelper

    let connect_pixels = false

    // Initialize drawing paths
    let paths = new Array();

    // Reduce the dimensions of the image
    let desired_pixels_per_side = 16;
    let downscale = 1/(imported_image.width/desired_pixels_per_side);

    // 2: 0 (black), 255 (white)
    // 4: 0 85, 170, 255 (Increments of 255/3)
    let num_shades = 6;

    // Downscale original image
    imported_image.resize(imported_image.width * downscale, imported_image.height * downscale)

    // Render Original Image
    // p5.image(imported_image, 0, 0);

    // Reduce the number of tones in the image
    let image_array = ImageHelp.posterize(imported_image, num_shades)

    // Render image pixels to paths
    let scale = 2;
    let pixel_size = 2 / imported_image.height
    let renderLines = new Array();

    // Render "pixels"
    let num_rows = image_array.length
    let num_columns = image_array[0].length
    for (let row = 0; row < num_rows; row++) {

      for (let j = 0; j < num_columns; j++) {

        // "Snake" through pixels to optimize plotting
        // Odd rows go in reverse order, right-to-left
        let col = j
        if (row % 2 == 1) {
          col = num_columns-1 - j
        }

        // Set the linear index (0 to row * col)  of the pixel
        let index = (row * num_columns) + (col % num_columns)

        // Set the X and Y coordinates of the pixels
        let pixel_x = 2 * ((col / imported_image.width) - 0.5);
        let pixel_y = 2 * (row / imported_image.width - 0.5)

        // Set path to fill the pixel
        let pixel_path = new Array();
        switch(technique) {
          case "weave":
            pixel_path = this.renderWeavePixel(num_shades, image_array[row][col], index)
            break;
          case "box":
            pixel_path = this.renderBoxPixel(num_shades, image_array[row][col], index)
            break;
          case "spiral":
            pixel_path = this.renderSpiralPixel(num_shades, image_array[row][col], index)
          case "fermatSpiral":
            connect_pixels = true
            pixel_path = this.renderFermatSpiralPixel(num_shades, image_array[row][col], [num_rows, num_columns], [row, col], connect_pixels)
          default:
            pixel_path = this.renderBoxPixel(num_shades, image_array[row][col], index)
        }

        // Scale and translate the pixel paths into place on the canvas
        for (let p = 0; p < pixel_path.length; p++) {
          let positioned_pixel_path = PathHelp.translatePath(
            PathHelp.scalePath(pixel_path[p], pixel_size),
            [pixel_x, pixel_y]
          )
          if (connect_pixels) {
            paths = paths.concat(positioned_pixel_path);
          } else {
            paths.push(positioned_pixel_path);
          }
        }
      }
    }

    // Wrap composited path in an array
    if (connect_pixels) {
      paths = [paths]
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

  renderBoxPixel(levels, value, index) {

    let PathHelp = new PathHelper

    let paths = new Array();

    let square = [
      [0,0],
      [0,1],
      [1,1],
      [1,0],
      [0,0]
    ]

    let num = (255 - value)/255 * levels

    // console.log(value, num)

    for (let l = 1; l < num; l++) {
      let scale = l/num
      paths.push(
        PathHelp.translatePath(
          PathHelp.scalePath(square, scale),
          [0.5-scale/2, 0.5-scale/2]
        )
      )
    }

    return paths;

  }

  renderSpiralPixel(levels, value, index) {

    let PathHelp = new PathHelper

    let paths = new Array();

    let spiral = new Array();
    let spiral_sides = 4;
    let phase_offset = Math.PI * (1/4)
    // let phase_offset = Math.PI * (1/2)

    let num = (255 - value)/255 * levels

    let minimum_revolutions = 1
    let revolutions = Math.floor(num) + minimum_revolutions

    let steps = revolutions * spiral_sides;
    for (let s = 0; s < steps; s++) {

      // Note radius multiplier is somewhat arbitrary
      // and controls the margin between pixels
      // 0.75 works well for 4-sided spirals (sqrt(2)/2 ?)
      let radius = (s/steps) * 0.75

      let theta = (s/spiral_sides) * Math.PI * 2
      let x = radius * Math.cos(theta + phase_offset)
      let y = radius * Math.sin(theta + phase_offset)
      spiral.push([x,y])
    }

    if (spiral.length > 0) {
      paths.push(spiral)
    }

    return paths;
  }

  renderFermatSpiralPixel(hue_levels, value, dimensions, index, connect) {

    let PathHelp = new PathHelper

    let paths = new Array();

    let spiral = new Array();
    let spiral_sides = 4;
    let phase_offset = Math.PI * (5/4)
    // let phase_offset = Math.PI * (1/2)

    // If connected pixels, add 180-degree rotation on odd rows
    // to make things line up nice
    if (connect && index[0] % 2) {
      phase_offset += Math.PI
    }

    // Convert pixel value on scale of 0-255 to a
    // number based on the requested Hue hue_levels
    let num = (255 - value)/255 * hue_levels

    let minimum_revolutions = 1
    let revolutions = Math.floor(num) + minimum_revolutions

    // Debugging
    // console.log(index, num, revolutions)

    // Controls "tightness" of spiral. 1.0 is a good value
    const pow_n = 1.0;
    let spiral_scale = 1/8

    // Radius of spiral
    let a = (1 / revolutions) * spiral_scale;

    // Loop through one revolution
    let t_min = revolutions * 0;
    let t_max = revolutions * (2 * Math.PI);
    const t_step = (t_max - t_min) / (revolutions * spiral_sides);

    // Negative Radius
    // Starts top-left and goes to center
    for (var t = t_max; t >= t_min; t -= t_step) {

      // Run the parametric equations
      let x = a * Math.pow(t, pow_n) * Math.cos(t + phase_offset);
      let y = a * Math.pow(t, pow_n) * Math.sin(t + phase_offset);

      // Add coordinates to shape array
      spiral.push([x,y]);
    }

    // Positive Radius
    // center and goes to bottom-right

    // TODO: Refactor this after loop in the "if (connect)" loop?
    if (connect && index[1] < dimensions[1] - 1) {
      t_max = t_max - 2;
    }

    for (var t = t_min; t <= t_max + t_step; t += t_step) {

      // Run the parametric equations
      let x = -a * Math.pow(t, pow_n) * Math.cos(t + phase_offset);
      let y = -a * Math.pow(t, pow_n) * Math.sin(t + phase_offset);

      // Add coordinates to shape array
      spiral.push([x,y]);
    }

    // Manipulate paths to make cleaner connections
    if (connect) {

      // Remove first point if not in the first or last column
      if (index[1] > 0 && index[1] < dimensions[1]) {
        spiral.shift()
      }

      // Remove last point if the last/right-most column
      if(index[1] + 1 == dimensions[1]) {
        spiral.pop()

        // Remove last point if not the final, bottom-right pixel
        if (index[0] + 1 != dimensions[0]) {
          spiral.pop()
        }
      }

      // Remove first point if the first/left-most column
      if(index[1] == 0 && index[0] != 0) {
        spiral.shift()
      }
    }


    if (spiral.length > 0) {
      paths.push(spiral)
    }

    return paths;
  }

  dither(p5, imported_image, split_colors) {

    const scale = 0.25;
    const y_axis_pixel_range = 288
    const x_axis_pixel_range = 480
    const sketch_margin = 48;

    let PathHelp = new PathHelper()
    let ImageHelp = new ImageHelper()

    let layers = new Array();

    let paths = new Array();

    let p5_pixel_size = y_axis_pixel_range / (imported_image.height * scale)

    // Resize image
    imported_image.resize(imported_image.width * scale, imported_image.height * scale)
    let rows = imported_image.height;
    let columns = imported_image.width;
    let pixel_size = 2 / imported_image.height

    // Sample Downscaled image
    imported_image.loadPixels();
    let pixelCount = imported_image.width * imported_image.height;
    let image_array = new Array(imported_image.height).fill(255);
    for (let a = 0; a < image_array.length; a++) {
      image_array[a] = new Array(imported_image.width).fill(255)
    }
    let x = 0;
    let y = 0;
    let samples = PathHelp.getRndInteger(0, pixelCount/2)
    console.log("Sampling " + pixelCount + " pixels")

    let channel_max = 1
    if (split_colors) {
      channel_max = 4
    }

    for (let channel = 0; channel < channel_max; channel++) {

      // Reset paths array
      paths = new Array();

      for (let i = 0; i < pixelCount; i++) {

        let red   = imported_image.pixels[i*4 + 0];
        let green = imported_image.pixels[i*4 + 1];
        let blue  = imported_image.pixels[i*4 + 2];
        let average = Math.round((red + green + blue) / 3);
        // let clamped_intensity = this.p5.round((average/255) * (levels-1)) * (255/(levels-1));
        // console.log(average, clamped_intensity);

        if (split_colors) {
          let cmyk = ImageHelp.rgbToCmyk(red, green, blue)
          average = (1 - cmyk[channel]) * 255
        }

        // Dithering

        if (average < PathHelp.getRndInteger(0,255)) {
          average = 0;
        } else {
          average = 255;
        }

        // Save intensity value to array
        y = Math.floor(i / imported_image.width)
        x = i % imported_image.width
        image_array[y][x] = average
      }

      // Loop through sampled image pixels and draw them
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {

          // Render in "p5 land"
          /*
          p5.noStroke();
          p5.fill(image_array[row][col])
          p5.rectMode(p5.CORNER);
          p5.rect(
            sketch_margin + ((x_axis_pixel_range - (image_array[0].length * p5_pixel_size))/2) + (col * p5_pixel_size),
            sketch_margin + (row * p5_pixel_size),
            p5_pixel_size,
            p5_pixel_size
          )
          //*/

          if (image_array[row][col] == 0) {

            // Diagonal top-left to bottom-right
            /*
            paths.push([
              [
                col * pixel_size - pixel_size/2,
                row * pixel_size - pixel_size/2
              ],
              [
                col * pixel_size + pixel_size/2,
                row * pixel_size + pixel_size/2
              ]
            ]);
            //*/

            // Random
            let r = pixel_size/2;
            let theta = PathHelp.getRandom(0, Math.PI * 2)
            paths.push([
              [
                (col * pixel_size) + (r * Math.cos(theta)),
                (row * pixel_size) + (r * Math.sin(theta))
              ],
              [
                (col * pixel_size) + (r * Math.cos(theta + Math.PI)),
                (row * pixel_size) + (r * Math.sin(theta + Math.PI))
              ]
            ]);

          }

        }
      }

      // Center the Paths to the canvas
      let centered_path = new Array();
      for (let c = 0; c < paths.length; c++) {
        centered_path.push(
          PathHelp.translatePath(
            paths[c],
            [
              -(columns/rows) + pixel_size/2,
              -1 + pixel_size/2
            ]
          )
        )
      }
      paths = centered_path;

      let color = "black"
      let colors = ["cyan", "magenta", "yellow", "black"]
      if (split_colors) {
        color = colors[channel]
      }

      layers.push({
        "color": color,
        "paths": paths
      })

    }

    return layers;
  }

  edgeDetection(p5, p5_imported_image) {

    const debug = false;

    // Square: 180, 240
    // Portrait: 50, 110
    let lower_threshold = 15;
    let upper_threshold = 140;
    // lower_threshold = parseInt(document.querySelector('#sketch-controls > div:nth-child(1) > input').value)
    // upper_threshold = parseInt(document.querySelector('#sketch-controls > div:nth-child(2) > input').value)

    // Display selected value(s)
    document.querySelector('#sketch-controls > div:nth-child(1) > span').innerHTML = lower_threshold;
    document.querySelector('#sketch-controls > div:nth-child(2) > span').innerHTML = upper_threshold;

    console.log(lower_threshold, upper_threshold);

    const scale = 0.5;
    const y_axis_pixel_range = 288
    const x_axis_pixel_range = 480
    const sketch_margin = 48;

    let PathHelp = new PathHelper()
    let ImageHelp = new ImageHelper()

    let layers = new Array();
    let paths = new Array();
    let path = new Array();
    let points = new Array();

    // Resize (downscale) image (p5 Image)
    p5_imported_image.resize(p5_imported_image.width * scale, p5_imported_image.height * scale)

    // Convert p5 Image object to a 2D array of intensity (greyscale values)
    p5_imported_image.loadPixels();
    let image_array = ImageHelp.p5PixelsToIntensityArray(p5_imported_image);

    // Invert image
    // image_array = ImageHelp.invert(image_array);

    // Downsample (Image Array)
    /*
    let downsample_factor = 2
    image_array = ImageHelp.downsample(image_array, downsample_factor)
    rows = rows / downsample_factor
    columns = columns / downsample_factor
    pixel_size = pixel_size * downsample_factor
    p5_pixel_size = p5_pixel_size * downsample_factor
    //*/

    // Boost Contrast
    image_array = ImageHelp.contrast(image_array, 2.0)

    // Blur image to reduce detection of minor edges
    //*
    const gaussian_kernel = ImageHelp.gaussian(3, 1)
    // console.log(gaussian_kernel);
    image_array = ImageHelp.filter(image_array, gaussian_kernel, "neighbor")
    //*/

    // Edge Detection
    // image_array = ImageHelp.sobel(image_array);
    image_array = ImageHelp.canny(image_array, lower_threshold, upper_threshold);

    // Render
    let rows = p5_imported_image.height;
    let columns = p5_imported_image.width;
    let pixel_size = (1 - -1) / p5_imported_image.height
    // let p5_pixel_size = y_axis_pixel_range / (p5_imported_image.height * scale)
    let p5_pixel_size = y_axis_pixel_range / (p5_imported_image.height * 1)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {

        // Render in "p5 land"
        if (debug) {
          let pixel_color = image_array[row][col][0]
          // pixel_color = p5.color('hsl('
          //   + Math.floor(PathHelp.map(image_array[row][col][1], -Math.PI, Math.PI, 0, 360))
          //   + ', 100%'
          //   + ', ' + PathHelp.map(image_array[row][col][0], 0, 255, 0, 100) + '%)'
          // );
          p5.noStroke();
          p5.fill(pixel_color)
          p5.noSmooth();
          p5.rectMode(p5.CORNER);
          p5.rect(
            sketch_margin + ((x_axis_pixel_range - (columns * p5_pixel_size))/2) + (col * p5_pixel_size),
            sketch_margin + (row * p5_pixel_size),
            p5_pixel_size,
            p5_pixel_size
          )
          p5.noFill();
        }

        // Convert pixels to geometry path points
        if (image_array[row][col][0] > 128) {
          points.push([
            col * pixel_size,
            row * pixel_size
          ])
        }

      }
    }

    if (debug) {
      return [{"color": "red", "paths": []}];
    }

    console.log("Number of Points: " + points.length)

    // // Start a new path with the first point
    // //*
    // path = path.concat([
    //   points.shift()
    // ])
    // paths.push(path)
    // paths = PathHelp.pointsToPaths(paths, points, 0, 0.02);
    // //*/

    paths = PathHelp.pointsToPaths2(points, 0.02);

    // Smooth
    //*
    // for (let i = 0; i < 1; i++) {
      paths = paths.map(function(path) {
        return PathHelp.smoothPath(path, 5)
      })
    // }
    //*/

    // Center the Paths to the canvas
    //*
    let centered_path = new Array();
    for (let c = 0; c < paths.length; c++) {
      centered_path.push(
        PathHelp.translatePath(
          paths[c],
          [
            -(columns/rows) + pixel_size/2,
            -1 + pixel_size/2
          ]
        )
      )
    }
    paths = centered_path;
    //*/

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  edgeDetectionConvexHull(p5, p5_imported_image) {

    let PathHelp = new PathHelper()

    // Perform edge detection on image
    let layers = this.edgeDetection(p5, p5_imported_image)

    // Calculate Concave Hullof resulting paths
    let points = layers[0].paths.flat()
    console.log("Calculating Concave Hull")
    let hull = concaveHull.calculate(points, 3);
    if (hull !== null) {

      // // Offset hull
      // let parallel = new Array();
      // for (let i = 0; i < hull.length-1; i++) {
      //   let parallel_segment = PathHelp.parallelPath(hull[i], hull[i+1], 0.1)
      //   parallel.push(parallel_segment[0])
      // }
      // parallel.push(parallel[0])
      // hull = parallel;

      // // Smooth path. Subdivide for better results
      // hull = PathHelp.subdividePath(hull)
      // hull.push(hull[0])
      // hull = PathHelp.smoothPath(hull, 5)

      layers.push({
        "color": "blue",
        "paths": [hull]
      })
    }

    // Calculate the bounding box for paths of layer (the Hull in this case)
    let bounding_boxes = new Array();
    for (let p of layers[1].paths) {
      bounding_boxes.push(
        PathHelp.boundingBox(p)
      )
    }

    // Background lines
    let num_lines = 80;
    let p1,p2
    let max_x = 5/3;
    let min_x = -5/3;
    let max_y = 1;
    let min_y = -1;
    let paths = new Array();
    for(let i = 0; i <= num_lines; i++) {

      let y = (max_y - min_y) * (i/num_lines) + min_y;

      // Left-most Point of horizontal line
      p1 = [min_x, y];

      // Right-most point of horizontal line
      p2 = [max_x, y];

      // Bounding Box Intersection
      // Check Y-Dimension
      if (y > bounding_boxes[0][1][0] && y < bounding_boxes[0][1][1]) {

        // Check X-Dimension
        paths.push(
          [
            [p1[0], y],
            [bounding_boxes[0][0][0], y]
          ],
          [
            [bounding_boxes[0][0][1], y],
            [p2[0], y]
          ]
        );

        continue;
      }

      // TODO: Calculate intersections with Hull

      // let intersect_1 = PathHelp.intersect_point(p1,p2,triangle[0],triangle[1]);
      // if (p1[1] >= triangle[0][1]) {
      //   paths.push([
      //     [intersect_1[0], p1[1]],
      //     p2
      //   ]);
      // }

      paths.push([p1,p2]);
    }

    layers.push({
      "color": "red",
      "paths": paths
    })

    return layers
  }

  combo(p5, imported_image) {
    let layers;

    // This must be calculated first because "dither" changes "imported_iamge"
    let top_layers = this.edgeDetection(p5, imported_image)

    // Base Layer
    // layers = this.dither(p5, imported_image);
    // layers = this.drawHatchSolid(p5, imported_image);
    layers = this.calcLines(imported_image, true)
    // layers = this.calcOutlines(p5, imported_image, "black")

    layers = layers.concat(top_layers);

    return layers
  }

}
