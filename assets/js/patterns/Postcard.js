/**
 * Postcard
 */
class Postcard {

  constructor() {

  this.key = "postcard";

  this.name = "Postcard";

  }

  /**
   * Draw path
   */
  draw() {

    let layers = new Array()

    let paths = new Array();

    // Center Divider Line
    paths.push([
      [0, -1],
      [0, 1]
    ])

    // Message bounding box
    let path = [
      [-5/3, -1],
      [0, -1],
      [0, 1],
      [-5/3, 1],
      [-5/3, -1]
    ]

    // Add path to array of paths
    paths.push(path)

    // Address bounding box
    paths.push([
      [0.25, -0.25],
      [0.25,  0.5],
      [ 5/3,   0.5],
      [ 5/3, -0.25],
      [0.25, -0.25]
    ])

    // Add Paths to Layer
    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers
  }
}