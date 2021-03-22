/**
 * Postcard
 */
class Postcard {

  constructor() {

    this.key = "postcard";

    this.name = "Postcard";

    this.char_width = 1;
    this.char_height = this.char_width * 2;
    this.line_height = 2 * this.char_height;

    this.config = {
      "font": {
        "name": "Font Face",
        "value": "EMSTech",
        "input": {
          "type": "createSelect",
          "options": {
            "astrology": "astrology",
            "cursive": "cursive",
            "cyrillic": "cyrillic",
            "EMSAllure": "EMSAllure",
            "EMSElfin": "EMSElfin",
            "EMSFelix": "EMSFelix",
            "EMSNixish": "EMSNixish",
            "EMSNixishItalic": "EMSNixishItalic",
            "EMSOsmotron": "EMSOsmotron",
            "EMSReadability": "EMSReadability",
            "EMSReadabilityItalic": "EMSReadabilityItalic",
            "EMSTech": "EMSTech",
            "HersheyGothEnglish": "HersheyGothEnglish",
            "HersheySans1": "HersheySans1",
            "HersheySansMed": "HersheySansMed",
            "HersheyScript1": "HersheyScript1",
            "HersheyScriptMed": "HersheyScriptMed",
            "HersheySerifBold": "HersheySerifBold",
            "HersheySerifBoldItalic": "HersheySerifBoldItalic",
            "HersheySerifMed": "HersheySerifMed",
            "HersheySerifMedItalic": "HersheySerifMedItalic",
            "futural": "futural",
            "futuram": "futuram",
            "gothiceng": "gothiceng",
            "gothicger": "gothicger",
            "gothicita": "gothicita",
            "greek": "greek",
            "japanese": "japanese",
            // "markers": "markers",
            // "mathlow": "mathlow",
            // "mathupp": "mathupp",
            "meteorology": "meteorology",
            "music": "music",
            "scriptc": "scriptc",
            "scripts": "scripts",
            "symbolic": "symbolic",
            "timesg": "timesg",
            "timesi": "timesi",
            // "timesib": "timesib",
            "timesr": "timesr",
            // "timesrb": "timesrb"
          }
        }
      },
      "font_size": {
        "name": "Font Size",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            5,
            14,
            8,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "address": {
        "name": "Address",
        "value": null,
        "input": {
          "type": "createTextarea",
          "attributes" : {
            "rows": 4,
            "cols": 25,
          },
          "value" : "Name\n1234 Main St.\nCity, State ZIP",
          "params" : []
        }
      },
      "message": {
        "name": "Message",
        "value": null,
        "input": {
          "type": "createTextarea",
          "attributes" : {
            "rows": 11,
            "cols": 25,
          },
          "value" : "Dear friend," + "\n\n"
            + "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." + "\n\n" + "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt." + "\n\n"
            + "All the best,",
          "params" : []
        }
      }
    };

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

    // Set margin in pixels
    let margin = 24

    let font_face = document.querySelector('#sketch-controls > div:nth-child(1) > select').value
    let font_size = document.querySelector('#sketch-controls > div:nth-child(2) > input').value

    // Display selected value(s)
    document.querySelector('#sketch-controls > div:nth-child(2) > span').innerHTML = font_size;

    // This scales the font source data to the requested font size input.
    // This is still a rough estimate based on what works with the current font data
    let font_size_factor = 1/20
    if (font_face.match(/^(EMS|Hershey)/)) {
      font_size_factor *= 1/30;
    }

    // Set the line weight. Most pens for plotting are specified in millimeters
    let line_weight_mm = 0.5;
    let line_weight_px = line_weight_mm * 3.78; // 1mm = 3.78 pixels

    // Font parameters in Points (pts)
    let charWidth = font_size; // This is still somewhat arbitrary
    let charHeight = (1/font_size_factor); // font_size * 4; // This is still somewhat arbitrary

    let svg_group

    // Address SVG Text
    let address_string = address.name + "\n"
       + address.street + "\n"
       + address.city + ", " + address.state + " " + address.postal + "\n"
       + address.country

    // "nth-child" value corresponds to position in this.configs
    address_string = document.querySelector('#sketch-controls > div:nth-child(3) > textarea').value;

    let address_font_svg = renderText(
      address_string,
      {
        font: fonts[font_face],
        charWidth: charWidth,
        charHeight: charHeight,
        lineHeight: 2.0
      }
    );
    // let svg_group = '<g transform="translate(' + margin + ',' + ((2 * margin - font_size)/2) + ') scale(' + (font_size/21) + ',' + (font_size/21) + ')">' + address_font_svg + "</g>"
    svg_group = '<g transform="translate(' + 24 + ',' + -24 + ') scale(' + (font_size * font_size_factor) + ',' + (font_size * font_size_factor) + ')" stroke-width="' + (line_weight_px / (font_size * font_size_factor)) + '">' + address_font_svg + "</g>"
    svg += svg_group

    // Message SVG Text
    let message = "Dear friend," + "\n\n"
      + "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." + "\n\n" + "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt." + "\n\n"
      + "All the best,"

    // "nth-child" value corresponds to position in this.configs
    message = document.querySelector('#sketch-controls > div:nth-child(4) > textarea').value;

    // Text Box width in Pixels
    let text_box_width = 220;

    let svg_font_text = renderText(
      message,
      {
        font: fonts[font_face],
        // charWidth: charWidth,
        charHeight: charHeight,
        lineHeight: 2.0,
        wrapWidth: (text_box_width/font_size_factor) / font_size // font: 6 -> 820, 8 -> 600, 10 -> 500, 12 -> 400
      }
    );

    // Wrap the rendered text in an SVG group at translate it into position using P5 Coordinates
    // -p5.width/2 + margin, -p5.height/2 + margin
    svg_group = '<g transform="translate(' + (-288 + 24) + ',' + (-192 + 24) + ') scale(' + (font_size * font_size_factor) + ',' + (font_size * font_size_factor) + ')" stroke-width="' + (line_weight_px / (font_size * font_size_factor )) + '">' + svg_font_text + "</g>"
    svg += svg_group

    layers.push({
      "color": "black",
      "paths" : [],
      "svg": svg
    })

    return layers
  }
}