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

    let address = {
      "name": "First Last",
      "street": "Street Number",
      "city": "City",
      "state": "State",
      "postal": "Postal",
      "country": "Country"
    }

    let layers = new Array()

    let paths = new Array();

    // Center Divider Line
    paths.push([
      [0, -1],
      [0, 1]
    ])

    // Message bounding box
    /*
    paths.push([
      [-5/3, -1],
      [0, -1],
      [0, 1],
      [-5/3, 1],
      [-5/3, -1]
    ]);
    //*/

    // Address bounding box
    /*
    paths.push([
      [0.25, -0.25],
      [0.25,  0.5],
      [ 5/3,   0.5],
      [ 5/3, -0.25],
      [0.25, -0.25]
    ])
    //*/

    // Add Paths to Layer
    layers.push({
      "color": "black",
      "paths": paths
    })

    let svg = '';
    let margin = 48
    let font_size = 8
    const font_size_factor = 1/21;
    let svg_group

    // Address SVG Text
    let address_font_svg = renderText(
      address.name + "\n"
       + address.street + "\n"
       + address.city + ", " + address.state + " " + address.postal + "\n"
       + address.country,
      {
        font: fonts['EMSTech'],
        pos: {x: 0, y: 0},
        scale: 2,
        charWidth: 8,
        charHeight: 36
      }
    );
    // let svg_group = '<g transform="translate(' + margin + ',' + ((2 * margin - font_size)/2) + ') scale(' + (font_size/21) + ',' + (font_size/21) + ')">' + address_font_svg + "</g>"
    svg_group = '<g transform="translate(' + 42 + ',' + -30 + ') scale(' + (font_size * font_size_factor) + ',' + (font_size * font_size_factor) + ')">' + address_font_svg + "</g>"
    svg += svg_group

    // Message SVG Text
    let message = "Dear friend," + "\n\n"
      + "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." + "\n\n" + "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt." + "\n\n"
      + "All the best,"
    let svg_font_text = renderText(
      message,
      {
        font: fonts['EMSTech'],
        pos: {x: 0, y: 0},
        scale: 2,
        charWidth: 8,
        charHeight: 36,
        wrapWidth: 500
      }
    );
    // let svg_group = '<g transform="translate(' + margin + ',' + ((2 * margin - font_size)/2) + ') scale(' + (font_size/21) + ',' + (font_size/21) + ')">' + svg_font_text + "</g>"
    svg_group = '<g transform="translate(' + (-(5/3) * 144) + ',' + -1 * 140 + ') scale(' + (font_size * font_size_factor) + ',' + (font_size * font_size_factor) + ')">' + svg_font_text + "</g>"
    svg += svg_group

    layers.push({
      "color": "black",
      "paths" : [],
      "svg": svg
    })

    return layers
  }
}