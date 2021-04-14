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
}