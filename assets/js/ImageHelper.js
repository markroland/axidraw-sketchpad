class ImageHelper {

  downsample(data, factor) {
    let resample = new Array();

    let columns = data.length / factor
    let rows = data[0].length / factor

    for (let row = 0; row < rows; row++) {
      if (resample[row] === undefined) {
        resample[row] = new Array(columns);
      }
      for (let col = 0; col < columns; col++) {
        let sum = 0;
        for (let i = 0; i < factor; i++) {
          for (let j = 0; j < factor; j++) {
            sum += data[row*factor + i][col*factor + j]
          }
        }
        resample[row][col] = sum / Math.pow(factor,2)
      }
    }

    return resample;
  }

  /*
   * Image Filter
   */
  filter(data, kernel, edge) {

    let filteredData = new Array();

    const rows = data.length;
    const columns = data[0].length;
    for (let row = 0; row < rows; row++) {

      for (let col = 0; col < columns; col++) {

        // Initialize array
        if (filteredData[row] === undefined) {
          filteredData[row] = new Array();
        }

        // kernel sum for the current pixel starts as 0
        let sum = 0;

        // Do not blur edges (top row, bottom row, left column, right column)
        if ((row == 0 || row == rows-1) || (col == 0 || col == columns-1)) {
          filteredData[row][col] = sum
          if (edge == "neighbor") {
            // TODO: I think this value needs to be averaged between previous and next rows
            filteredData[row][col] = data[row][col]
          }
          continue;
        }

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            let x_pos = col + kx
            let y_pos = row + ky

            let val = data[y_pos][x_pos]

            // accumulate the  kernel sum
            // kernel is a 3x3 matrix
            // kx and ky have values -1, 0, 1
            // if we add 1 to kx and ky, we get 0, 1, 2
            // with that we can use it to iterate over kernel
            // and calculate the accumulated sum
            // sum += kernel[kx+1][ky+1] * val;
            sum += kernel[ky+1][kx+1] * val;
          }
        }

        filteredData[row][col] = sum
      }
    }

    return filteredData;
  }

  /**
   * Adjust image Contrast
   * @param Array data Image array data
   * @param float The contrast factor, min: 0, no change: 1
   * @param integer Optional brightness factor
   */
  contrast (data, alpha, beta = undefined) {
    const rows = data.length;
    const columns = data[0].length;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        data[row][col] = this.constrain(
          parseInt(alpha * (data[row][col] - 128)) + 128,
          0,
          255
        )
      }
    }
    return data;
  }

  /**
   * Invert an image
   */
  invert (data) {
    const rows = data.length;
    const columns = data[0].length;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (!Array.isArray(data[row][col])) {
          data[row][col] = 255 - data[row][col]
        }
      }
    }
    return data;
  }

  constrain (n, min, max) {
    if (n < min) {
      return min;
    }
    if (n > max) {
      return max;
    }
    return n
  }

  // https://www.rapidtables.com/convert/color/rgb-to-cmyk.html
  rgbToCmyk(red, green, blue) {
    let key     = 1 - (Math.max(red, green, blue)/255)
    let cyan    = (1 - red/255 - key) / (1 - key)
    let magenta = (1 - green/255 - key) / (1 - key)
    let yellow  = (1 - blue/255 - key) / (1 - key)
    return [cyan, magenta, yellow, key]
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

  p5PixelsToIntensityArray(p5image) {
    let pixelCount = p5image.width * p5image.height;
    console.log("Sampling " + pixelCount + " pixels...")
    let image_array = new Array(p5image.height).fill(255);
    for (let a = 0; a < image_array.length; a++) {
      image_array[a] = new Array(p5image.width).fill(255)
    }
    let x = 0;
    let y = 0;
    for (let i = 0; i < pixelCount; i++) {

      // Get average intensity of RGB color channels
      let average = Math.round(
        (p5image.pixels[i*4 + 0] + p5image.pixels[i*4 + 1] + p5image.pixels[i*4 + 2])
        / 3
      );
      // let clamped_intensity = this.p5.round((average/255) * (levels-1)) * (255/(levels-1));
      // console.log(average, clamped_intensity);

      // Save intensity value to array
      y = Math.floor(i / p5image.width)
      x = i % p5image.width
      image_array[y][x] = average
    }
    return image_array;
  }

  sobel(image) {

    let filtered_image = new Array();

    // Perform edge detection horizontally and vertically
    const Gx_kernel = [
      [1,0,-1],
      [2,0,-2],
      [1,0,-1]
    ]
    const Gy_kernel = [
      [-1,-2,-1],
      [ 0, 0 ,0],
      [ 1, 2, 1]
    ]
    let gx = this.filter(image, Gx_kernel)
    let gy = this.filter(image, Gy_kernel)

    // Loop through filtered image pixels and calculate edge magnitude and direction
    let rows = image.length;
    let columns = image[0].length;
    for (let row = 0; row < rows; row++) {

      // Initialize columns of row
      filtered_image[row] = new Array(columns);

      for (let col = 0; col < columns; col++) {

        // Magnitude of change
        let g = Math.sqrt(
          Math.pow(gx[row][col], 2)
          +
          Math.pow(gy[row][col], 2)
        );

        // Direction of change
        let theta = Math.atan2(gy[row][col], gx[row][col]) // + Math.PI/2
        /*
        if (theta < 0) {
          theta = (2 * Math.PI) + theta;
        }
        //*/

        // Return magnitude and direction of pixel "edginess"
        filtered_image[row][col] = [g, theta];
      }
    }

    return filtered_image;
  }

}