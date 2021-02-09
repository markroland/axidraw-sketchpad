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
    let num_shades = 2;

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
      let average = (imported_image.pixels[i*4 + 0] + imported_image.pixels[i*4 + 1] + imported_image.pixels[i*4 + 2]) / 3;

      average = p5.round((average/255) * num_shades) * (256/num_shades);

      imported_image.pixels[i*4 + 0] = average;
      imported_image.pixels[i*4 + 1] = average;
      imported_image.pixels[i*4 + 2] = average;
      imported_image.pixels[i*4 + 3] = 255;

      y = Math.floor(i / imported_image.width)
      x = i % imported_image.width

      // Save intensity value to new array
      if (image_array[y] == undefined) {
        image_array[y] = new Array();
      }
      image_array[y][x] = average
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

        // Hatch: Diagonal top-left to bottom-right
        if (image_array[a][b] < 255) {

          // Render in "p5 land"
          // p5.fill(0)
          // p5.rect(100 + b * 3, a * 3, 3, 3)

          paths.push([
            [2 * ((b / imported_image.width) - 0.5), 2 * (a / imported_image.width - 0.5)],
            [2 * ((b / imported_image.width) - 0.5) + pixel_size, 2 * (a / imported_image.width - 0.5) + pixel_size],
          ])
        }

        // Hatch: Diagonal top-right to bottom-left
        //*
        if (image_array[a][b] < 255/3) {
          paths.push([
            [2 * ((b / imported_image.width) - 0.5) + pixel_size, 2 * (a / imported_image.width - 0.5)],
            [2 * ((b / imported_image.width) - 0.5), 2 * (a / imported_image.width - 0.5) + pixel_size],
          ])
        }
        //*/
      }
    }
    p5.noFill()

    return paths;
  }

}
