/**
 * Image
 */
class LineImage {

  constructor() {

  }

  draw(p5, imported_image) {
    return this.calc(p5, imported_image);
  }

  calc(p5, imported_image) {

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

}
