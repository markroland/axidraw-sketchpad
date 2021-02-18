/**
 * Image
 */
class LineImage {

  constructor() {

  }

  draw(p5, imported_image) {
    this.p5 = p5
    return this.calcLines(imported_image);
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


    // paths = renderLines; return paths;

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
