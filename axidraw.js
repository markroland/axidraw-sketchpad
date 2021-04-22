let selectedPattern = "3d"
let sketch_title = ''

// Select sketch from Hash in URL
if (window.location.hash != "") {
  selectedPattern = window.location.hash.replace('#', '')
}

let orientation = 'landscape'
let showDate = true
let showSignature = true
let debugPenDownUp = false
let draw_grid = false

let fonts

let sketch = function(p) {

  // Set sketch margin in inches
  let margin = 0.25 * 96;

  let imported_svg

  let imported_image

  let svg_title
  let svg_date
  let svg_signature

  let draw_count = 0;

  var Patterns = {
    "bezier": new Bezier(),
    "cassinioval": new CassiniOval(),
    "cycloid": new Cycloid(),
    "extrusion": new Extrusion(),
    "fibonacci": new Fibonacci(),
    "flowfield": new FlowField(),
    "genuary": new Genuary(),
    "grid": new Grid(),
    "heart": new Heart(),
    "isolines": new Isolines(),
    "lindenmayer": new Lindenmayer(),
    "lineimage": new LineImage(),
    "lissajous": new Lissajous(),
    "negativespace": new NegativeSpace(),
    "postcard": new Postcard(),
    "radiallines": new RadialLines(),
    "radiography": new Radiography(),
    "sketchbook": new Sketchbook(),
    "spiral": new Spiral(),
    "3d": new ThreeD(),
    "truchet": new Truchet()
  }

  // Preload data
  p.preload = function() {

    // Pre-load an image
    if (selectedPattern == "lineimage") {
      let image_path = "assets/data/portrait.jpg";
      imported_image = p.loadImage(image_path,
        success => { /* console.log('jpg success') */ },
        fail => { /* console.log('jpg fail') */ }
      );
    }

    // Pre-load Hershey Text font data
    fonts = p.loadJSON('assets/js/hersheytext.json')
  }

  p.setup = function() {

    // Create SVG Canvas (6" x 4" @ 96pts/inch)
    p.createCanvas(576, 384, p.SVG); // p.SVG

    // Does not work with p.SVG Canvas
    // p.blendMode(p.MULTIPLY)

    // Pattern selector
    var pattern_select_div = p.createDiv('<label>Sketch</label>')
      .parent('sketch-selector');
    pattern_select = p.createSelect()
      .parent(pattern_select_div)
      .attribute("name", "pattern");

    // Add patterns from object
    var pattern_select_menu = document.querySelector('#sketch-selector > div > select');
    const entries = Object.entries(Patterns)
    for (let [pattern_key, pattern_object] of entries) {
      pattern_select.option(pattern_object.name, pattern_object.key);
    }

    // Set default selected pattern
    pattern_select.selected(selectedPattern);

    if (typeof Patterns[selectedPattern].title !== "undefined") {
      sketch_title = Patterns[selectedPattern].title
    }

    // Add change event handler
    pattern_select.changed(patternSelectEvent);

    draw_title_date_sign()

    p.noLoop();

    // Set stroke
    p.strokeWeight(1.42);
    p.stroke(0, 0, 0);
    p.noFill();

    // Download controls
    downloadButton = p.createButton('Download SVG')
      .parent('download');
    downloadButton.mousePressed(download);

    // Load configs and build menus
    if (Patterns[selectedPattern].config !== undefined) {
      const configs = Object.entries(Patterns[selectedPattern].config);
      buildConfigControls(configs)
    }

  }

  p.draw = function() {

    console.log('Draw Count: ', draw_count)

    // Clear SVG
    if (draw_count > 0) {

      // 3/17/21 - This should work, but it's not working
      // See https://zenozeng.github.io/p5.js-svg/examples/#basic
      // p.clear();

      // document.querySelector('#defaultCanvas0>svg>g:nth-child(3)>g').remove()
      // document.querySelector('#defaultCanvas0>svg>g:nth-child(3)>g').innerHTML = '';
      // console.log('A');

      // This works on first change, but then fails on subsequent
      // console.log(document.querySelector('#defaultCanvas0>svg>g:nth-of-type(2)>g'))
      // document.querySelector('#defaultCanvas0>svg>g:nth-of-type(2)>g').innerHTML = '';
      document.querySelector('#defaultCanvas0>svg>g:nth-child(3)>g').innerHTML = '';
      // console.log(document.querySelector('#defaultCanvas0>svg>g'))
    }

    // Get artwork from Pattern class
    layers = Patterns[selectedPattern].draw(p, imported_image);

    // Convert legacy patterns to new format.
    if (layers[0].paths == undefined) {
      layers = [
        {
          "color": "black",
          "paths": layers
        }
      ]
    }

    p.push();
    p.translate(p.width/2, p.height/2)

    // Draw Margins, Padding and Axis. Useful for debugging or formatting art
    if (draw_grid) {
      draw_helper_grid()
    }

    let constrain = false;
    if (Patterns[selectedPattern].constrain !== undefined) {
      constrain = Patterns[selectedPattern].constrain;
    }

    // Set the "canvas unit" as the number of pixels between
    // the center of the canvas and the nearest margin
    let canvas_unit = ((p.min(p.width, p.height)/2) - margin * 2)

    p.stroke(0);

    // Loop through Layers
    for (l = 0; l < layers.length; l++) {

      // Set stroke color for the layer
      p.stroke(layers[l].color)

      // Loop through all Paths in Layer
      let paths = layers[l].paths
      console.log("Layer " + (l+1) + " Path Count: " + paths.length)
      for (i = 0; i < paths.length; i++) {

        // Indicate where the path starts
        if (debugPenDownUp) {
          p.fill(0,255,0, 128)
          p.noStroke();
          p.ellipse(
            paths[i][0][0] * canvas_unit,
            paths[i][0][1] * canvas_unit,
            5,
            5
          )
          p.noFill();
          p.stroke(layers[l].color)
        }

        p.beginShape();

        // Loop through each Point in Path
        for (j = 0; j < paths[i].length; j++) {

          // Reformat data
          let point = [
            paths[i][j][0],
            paths[i][j][1]
          ]

          // Constrain
          if (constrain && j > 0) {
            point = trim_path(
              paths[i][j-1][0],
              paths[i][j-1][1],
              paths[i][j][0],
              paths[i][j][1]
            )

            // Don't add point if the point is off the canvas
            if (point == null) {
              continue;
            }
          }

          // Draw Vertex in "P5" Land
          p.vertex(
            point[0] * canvas_unit,
            point[1] * canvas_unit
          )
        }

        // TODO: "mode" should be defined by the path
        p.endShape();

        // Indicate where the path stops
        if (debugPenDownUp) {
          p.fill(255,0,0, 128)
          p.noStroke();
          p.ellipse(
            paths[i][paths[i].length-1][0] * canvas_unit,
            paths[i][paths[i].length-1][1] * canvas_unit,
            5,
            5
          )
          p.noFill();
          p.stroke(layers[l].color)
        }
      }

      // Directly insert SVG
      if (layers[l].svg !== undefined) {

        // Identify target element to append the new SVG content
        let this_svg_layer = document.querySelector('#defaultCanvas0>svg>g:nth-child(3)>g')

        // Create a new group in which to place the svg content
        let layer_group_svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
        layer_group_svg.setAttribute("inkscape:groupmode", "layer")
        layer_group_svg.setAttribute("inkscape:label", "Text on Layer " + (l+1))

        // Insert the svg content in to the SVG <g> element
        layer_group_svg.innerHTML = layers[l].svg

        // Add the SVG <g> element to the target group element
        this_svg_layer.appendChild(layer_group_svg)
      }
    }

    p.pop();

    // Count how many times draw() has run
    draw_count++
  }

  // p.keyPressed = function() {
  //   console.log("keyPressed");
  //   p.redraw()
  // }

  // p.mouseClicked = function() {
  //   console.log("mouseClicked");
  // }

  function draw_title_date_sign() {

    let svg_text = ''

    font_face = 'EMSTech'

    // This scales the font source data to the requested font size input.
    // This is still a rough estimate based on what works with the current font data
    let font_size_factor = 1/20
    if (font_face.match(/^(EMS|Hershey)/)) {
      font_size_factor *= 1/30;
    }

    // Font parameters in Points (pts)
    let charHeight = (1/font_size_factor); // font_size * 4; // This is still somewhat arbitrary

    // Set the line weight. Most pens for plotting are specified in millimeters
    let line_weight_mm = 0.5;
    let line_weight_px = line_weight_mm * 3.78; // 1mm = 3.78 pixels


    // Title
    if (sketch_title != '') {
      let svg_title;
      let font_size = 8;

      let title_svg = renderText(sketch_title, {
        font: fonts[font_face],
        charWidth: font_size,
        charHeight: charHeight
      });

      svg_title = '<g transform="translate(' + margin + ',' + (margin + font_size/2) + ')'
          + ' scale(' + (font_size * font_size_factor).toFixed(6)  + ',' + (font_size * font_size_factor).toFixed(6)  + ')"'
          + ' stroke-width="' + (line_weight_px / (font_size * font_size_factor)).toFixed(2) + '"'
        + '>' + title_svg + "</g>"

      svg_text += svg_title
    }

    // Date
    if (showDate) {
      let svg_date
      font_size = 6;
      let now = new Date();
      let date_svg = renderText(
        (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear(),
        {
          font: fonts[font_face],
          charWidth: font_size,
          charHeight: charHeight
        }
      );

      svg_date = '<g transform="translate(' + margin + ',' + ((p.height - margin) + font_size/2) + ')'
          + ' scale(' + (font_size * font_size_factor).toFixed(6) + ',' + (font_size * font_size_factor).toFixed(6) + ')"'
          + ' stroke-width="' + (line_weight_px / (font_size * font_size_factor)).toFixed(2) + '"'
        + '>' + date_svg + "</g>";

      svg_text += svg_date
    }

    // Initials
    if (showSignature) {
      let svg_signature
      let initials_rotation = "0";
      let initials_position = '542,354';
      if (orientation == "portrait") {
        initials_rotation = "-90";
        initials_position = '532,30';
      }
      svg_signature  = '<g transform="translate(' + initials_position + ') rotate(' + initials_rotation + ' 5 5)">'
      svg_signature += '<path fill="none" stroke="rgb(0,0,0)" paint-order="fill stroke markers" stroke-opacity="1" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.42" d="M 0.52831513,9.9326943 2.8794102,-0.05945861 4.0549577,6.1121658 6.6999395,0.52831513 5.5243921,11.108241" id="path1421" /><path fill="none" stroke="rgb(0,0,0)" paint-order="fill stroke markers" stroke-opacity="1" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.42"  d="m 7.3002589,10.146612 0.458014,-9.61829687 c 0,0 3.7857471,0.3053972 4.1221261,1.83205677 0.336379,1.5266596 -3.2060981,3.6641137 -3.2060981,3.6641137 L 13.712455,10.37562" id="path1423" />';
      svg_signature += '</g>'
      svg_text += svg_signature
      // document.querySelector('#defaultCanvas0>svg>g').innerHTML = '<g transform="translate(' + initials_position + ') rotate(' + initials_rotation + ' 5 5)">' + initials + "</g>";
    }

    // Add SVG to document
    if (svg_text != '' && document.querySelector('#defaultCanvas0>svg>g')) {
      document.querySelector('#defaultCanvas0>svg>g').setAttribute("inkscape:groupmode", "layer")
      document.querySelector('#defaultCanvas0>svg>g').setAttribute("inkscape:label", "1 - labels")
      document.querySelector('#defaultCanvas0>svg>g').innerHTML = svg_text;
    }
  }

  function draw_helper_grid() {

    // Draw Border
    p.stroke(255, 0, 128);
    p.beginShape();
    p.vertex(-p.width/2 + margin, p.height/2 - margin)
    p.vertex(p.width/2 - margin, p.height/2 - margin)
    p.vertex(p.width/2 - margin, -p.height/2 + margin)
    p.vertex(-p.width/2 + margin, -p.height/2 + margin)
    p.vertex(-p.width/2 + margin, p.height/2 - margin)
    p.endShape();

    // Draw Area
    p.stroke(0, 128, 255);
    p.beginShape();
    p.vertex(-p.width/2 + 2 * margin, p.height/2 - 2 * margin)
    p.vertex(p.width/2 - 2 * margin, p.height/2 - 2 * margin)
    p.vertex(p.width/2 - 2 * margin, -p.height/2 + 2 * margin)
    p.vertex(-p.width/2 + 2 * margin, -p.height/2 + 2 * margin)
    p.vertex(-p.width/2 + 2 * margin, p.height/2 - 2 * margin)
    p.endShape();

    // Draw axis
    p.stroke(0, 255, 128);
    p.line(0,p.height/2,0, -p.height/2)
    p.line(-p.width/2, 0, p.width/2, 0)
  }

  function patternSelectEvent() {
    selectedPattern = document.querySelector('#sketch-selector > div > select').value
    console.log('patternSelectEvent. selectedPattern: ', selectedPattern)
    location.href = 'http://localhost:8000/#' + selectedPattern;
    location.reload();
  }

  function buildConfigControls(configs) {
    for (let [key, val] of configs) {

      // Create a new object
      var control = new Object();

      // Create the div that contains the control
      control.div = p.createDiv('<label>' + val.name + '</label>')
        .parent('sketch-controls')
        .addClass('sketch-control');

      // Create the control form input
      if (val.input.type == "createSelect") {
        control.input = p.createSelect()
          .attribute('name', key)
          .parent(control.div)
          .addClass(val.input.class);
        const entries = Object.entries(val.input.options)
        for (let [key, object] of entries) {
          control.input.option(object, key);
        }
        if (val.value) {
          control.input.selected(val.value);
        }
      } else if (val.input.type == "createSlider") {
        control.input = p.createSlider(
          val.input.params[0],
          val.input.params[1],
          val.value ? val.value : val.input.params[2],
          val.input.params[3]
        )
        .attribute('name', key)
        .parent(control.div)
        .addClass(val.input.class);
      } else if (val.input.type == "createCheckbox") {
        // control.input = createInput(val.input.params[0], "checkbox") // Should it be this?
        control.input = p.createInput(
          val.input.params[0],
          val.input.params[1],
          val.input.params[2]
        )
        .attribute("type", "checkbox")
        .attribute('name', key)
        .attribute('checkbox', null)
        .parent(control.div);
        if (val.input.params[2] == 1) {
          control.input.attribute('checked', 'checked');
        } else if (val.value) {
          control.input.attribute('checked', 'checked');
        }
      } else if (val.input.type == "createInput") {
        control.input = p.createInput(
          val.value ? val.value : val.input.params[0],
          val.input.params[1]
        )
        .attribute('name', key)
        .parent(control.div);
      } else if (val.input.type == "createTextarea") {
        control.input = p.createElement(
          "textarea",
          val.value ? val.value : val.input.value
        )
        .attribute("rows", val.input.attributes.rows)
        .attribute("cols", val.input.attributes.cols)
        .attribute('name', key)
        .parent(control.div);
      }

      // Add change event handler
      // TODO: This doesn't work well for Textareas
      control.input.changed(function(){
        p.redraw()
      });

      // Create a span element to display the current input's value (useful for Sliders)
      if (val.input.displayValue) {
        let radius_value = p.createSpan('0')
          .parent(control.div);
      }
    }
  }

  function trim_path(x0, y0, x1, y1) {
    let x = x1;
    let y = y1;
    let intersect;

    let x_max = 5/3;
    let x_min = -5/3;
    let y_max = 1;
    let y_min = -1;

    // Return null if current point and previous point are out of bounds
    if (
      (y0 > y_max && y1 > y_max)
      || (y0 < y_min && y1 < y_min)
    ) {
      return;
    }

    if (x > x_max) {
      intersect = intersect_point([x_max,y_min], [x_max,y_max], [x0, y0], [x1, y1])
      x = intersect[0]
      y = intersect[1]
    } else if (x < x_min) {
      intersect = intersect_point([x_min,y_min], [x_min,y_max], [x0, y0], [x1, y1])
      x = intersect[0]
      y = intersect[1]
    }

    if (y > 1) {
      intersect = intersect_point([-5/3,1], [5/3,1], [x0, y0], [x, y])
      x = intersect[0]
      y = intersect[1]
    } else if (y < -1) {
      intersect = intersect_point([-5/3,-1], [5/3,-1], [x0, y0], [x, y])
      x = intersect[0]
      y = intersect[1]
    }

    return [x,y]
  }

  function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  }

  // Copied from https://editor.p5js.org/mwburke/sketches/h1ec1s6LG
  function intersect_point(p1, p2, p3, p4) {
    const ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) -
      (p4[1] - p3[1]) * (p1[0] - p3[0])) /
      ((p4[1] - p3[1]) * (p2[0] - p1[0]) -
      (p4[0] - p3[0]) * (p2[1] - p1[1]));

    const ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) -
      (p2[1] - p1[1]) * (p1[0] - p3[0])) /
      ((p4[1] - p3[1]) * (p2[0] - p1[0]) -
      (p4[0] - p3[0]) * (p2[1] - p1[1]));

    const x = p1[0] + ua * (p2[0] - p1[0]);
    const y = p1[1] + ua * (p2[1] - p1[1]);

    return [x, y]
  }

  function download()
  {

    // Set filename
    let now = new Date();
    let filename = "axidraw_" + selectedPattern + "_" + now.toISOString() + ".svg";

    // Option 1: Using p5's SVG download
    // p.save(filename); return;

    // Option 2: Using custom SVG with layer support

    let width = 576;
    let height = 384;

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("height", height);
      svg.setAttribute("width", width);
      svg.setAttribute("version", "1.1");
      svg.setAttribute("viewBox", "0 0 " + width + " " + height);
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
      svg.setAttribute("xmlns:inkscape","http://www.inkscape.org/namespaces/inkscape");

    // Load Title, Date and Signature from DOM
    svg.appendChild(document.querySelector('#defaultCanvas0>svg>g').cloneNode(true))

    // Convert legacy patterns to new format.
    if (layers[0].paths == undefined) {
      layers = [
        {
          "color": "black",
          "paths": layers
        }
      ]
    }

    for (let l = 0; l < layers.length; l++) {

      let layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
        layer.setAttribute("inkscape:groupmode", "layer")
        layer.setAttribute("inkscape:label", (l + 2) + " - " + layers[l].color)
        layer.setAttribute("transform", "translate(" + width/2 + "," + height/2 + ")");

      for (let p1 = 0; p1 < layers[l].paths.length; p1++) {

        // Assemble path points
        // TODO: This don't appear to be quite in their intended position
        let x_dim = (width - 4 * margin) / 2;
        let y_dim = (height - 4 * margin) / 2;
        let d = "M " + ((layers[l].paths[p1][0][0] / (5/3)) * x_dim) + " " + ((layers[l].paths[p1][0][1] / (1)) * y_dim);
        for (let p2 = 1; p2 < layers[l].paths[p1].length; p2++) {
          d = d + " L " + ((layers[l].paths[p1][p2][0] / (5/3)) * x_dim) + " " + ((layers[l].paths[p1][p2][1] / (1)) * y_dim)
        }

        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", d);
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", layers[l].color);
          path.setAttribute("paint-order", "fill stroke markers");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-miterlimit", "10");
          path.setAttribute("stroke-opacity", "1");
          path.setAttribute("stroke-width", "1.42");

        layer.appendChild(path);
      }

      // Directly insert SVG
      if (layers[l].svg !== undefined) {

        // Load Content from existing DOM content
        // Note: The "l + 2" bit may not be correct for different number of layers - only tested with 1
        layer.appendChild(document.querySelector('#defaultCanvas0>svg>g:nth-child(' + (l + 2) + ')>g>g').cloneNode(true))
      }

      svg.appendChild(layer)
    }

    // Create hidden link element
    var element = document.createElement('a');
    element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.outerHTML));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);

    // Trigger Load
    element.click();

    // Remove element
    document.body.removeChild(element);
  }
};

let myp5 = new p5(sketch, document.getElementById("p5js-canvas"));
