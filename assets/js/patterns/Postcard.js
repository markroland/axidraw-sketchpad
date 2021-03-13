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

    // Add SVG Text
    let svg = '';
    let margin = 48
    let font_size = 12
    let svg_font_text = renderText(
      'Hello World' + "\n"
        + 'Line Two',
      {
        font: fonts['EMSTech'],
        pos: {x: 0, y: 0},
        scale: 2,
        charWidth: 8
      }
    );
    let svg_group = '<g transform="translate(' + margin + ',' + ((2 * margin - font_size)/2) + ') scale(' + (font_size/21) + ',' + (font_size/21) + ')">' + svg_font_text + "</g>"
    svg += svg_group

    layers.push({
      "color": "black",
      "paths" : [],
      "svg": svg
    })

    return layers
  }
}