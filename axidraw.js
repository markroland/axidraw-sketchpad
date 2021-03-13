let sketch_title = ''
let selectedPattern = "bezier"
let orientation = 'landscape'
let showDate = false
let showSignature = false

let sketch = function(p) {

  // Set sketch margin in inches
  let margin = 0.25 * 96;

  let imported_svg

  let imported_image

  let svg_title
  let svg_date
  let svg_signature

  var Patterns = {
    "bezier": new Bezier(),
    "cycloid": new Cycloid(),
    "extrusion": new Extrusion(),
    "fibonacci": new Fibonacci(),
    "flowfield": new FlowField(),
    "genuary": new Genuary(),
    "grid": new Grid(),
    "heart": new Heart(),
    "lindenmayer": new Lindenmayer(),
    "lineimage": new LineImage(),
    "lissajous": new Lissajous(),
    "negativespace": new NegativeSpace(),
    "radiallines": new RadialLines(),
    "radiography": new Radiography(),
    "spiral": new Spiral()
  }

  // Preload data
  p.preload = function() {
    if (selectedPattern == "lineimage") {
      imported_image = p.loadImage("assets/data/landscape.jpg",
        success => { /* console.log('jpg success') */ },
        fail => { /* console.log('jpg fail') */ }
      );
    }
  }

  p.setup = function() {

    // Create SVG Canvas (6" x 4" @ 96pts/inch)
    p.createCanvas(576, 384, p.SVG); // p.SVG

    // Does not work with p.SVG Canvas
    // p.blendMode(p.MULTIPLY)

    // Load the font JSON data
    $.getJSON('/assets/js/hersheytext.min.json', function(fonts){

      let svg_text = ''

      // Title
      //*
      if (sketch_title != '') {
        let svg_title;
        let font_size = 12;

        // Temporary fix of spacing being too narrow on the Space character
        sketch_title = sketch_title.replace(/\s+/g, '     ')

        let title_svg = renderText(sketch_title, {
          font: fonts['EMSTech'],
          pos: {x: 0, y: 0},
          scale: 2,
          charWidth: 8,
        });
        svg_title = '<g transform="translate(' + margin + ',' + ((2 * margin - font_size)/2) + ') scale(' + (font_size/21) + ',' + (font_size/21) + ')">' + title_svg + "</g>"
        svg_text += svg_title
      }
      //*/

      // Date
      if (showDate) {
        let svg_date
        font_size = 8;
        let now = new Date();
        let date_svg = renderText(
          (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear(),
          {
            font: fonts['EMSTech'],
            pos: {x: 0, y: 0},
            scale: 2,
            charWidth: 8,
          }
        );
        svg_date = '<g transform="translate(' + margin + ',' + ((p.height - 2 * margin) + ((2 * margin - font_size)/2)) + ') scale(' + (font_size/21) + ',' + (font_size/21) + ')">' + date_svg + "</g>"
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

      // Doesn't work
      /*
      var node = document.createElement('g');
      node.innerHTML = svg_test;
      // let node_paths = document.createElement(svg_test)
      // node.appendChild(node_paths)
      document.querySelector('#defaultCanvas0>svg').appendChild(node);
      //*/

    });

    p.noLoop();

    // Set stroke
    p.strokeWeight(1.42);
    p.stroke(0, 0, 0);
    p.noFill();

    // Download controls
    downloadButton = p.createButton('Download SVG')
      .parent('download');
    downloadButton.mousePressed(download);
  }

  p.draw = function() {

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

    // Draw Border
    /*
    p.stroke(255, 0, 128);
    p.beginShape();
    p.vertex(-p.width/2 + margin, p.height/2 - margin)
    p.vertex(p.width/2 - margin, p.height/2 - margin)
    p.vertex(p.width/2 - margin, -p.height/2 + margin)
    p.vertex(-p.width/2 + margin, -p.height/2 + margin)
    p.vertex(-p.width/2 + margin, p.height/2 - margin)
    p.endShape();
    //*/

    // Draw Area
    /*
    p.stroke(0, 128, 255);
    p.beginShape();
    p.vertex(-p.width/2 + 2 * margin, p.height/2 - 2 * margin)
    p.vertex(p.width/2 - 2 * margin, p.height/2 - 2 * margin)
    p.vertex(p.width/2 - 2 * margin, -p.height/2 + 2 * margin)
    p.vertex(-p.width/2 + 2 * margin, -p.height/2 + 2 * margin)
    p.vertex(-p.width/2 + 2 * margin, p.height/2 - 2 * margin)
    p.endShape();
    //*/

    // Draw axis
    /*
    p.stroke(0, 255, 128);
    p.line(0,p.height/2,0, -p.height/2)
    p.line(-p.width/2, 0, p.width/2, 0)
    //*/

    let constrain = false;
    if (Patterns[selectedPattern].constrain !== undefined) {
      constrain = Patterns[selectedPattern].constrain;
    }

    // Set the "canvas unit" as the number of pixels between
    // the center of the canvas and the nearest margin
    let canvas_unit = ((p.min(p.width, p.height)/2) - margin * 2)

    p.stroke(0);

    for (l = 0; l < layers.length; l++) {

      // Solid stroke
      p.stroke(layers[l].color)

      let paths = layers[l].paths

      for (i = 0; i < paths.length; i++) {

        p.beginShape();
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
      }
    }

    p.pop();
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

    let g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g1.setAttribute("transform", "scale(1,1) scale(1,1)");
      g1.setAttribute("transform", "translate(" + width/2 + "," + height/2 + ")");

    // let layers = new Array();
    // layers.push(paths);

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
        g1.setAttribute("transform", "scale(1,1) scale(1,1)");
        layer.setAttribute("transform", "translate(" + width/2 + "," + height/2 + ")");

      // Temporary: Alternate between Cyan, Magent, Yellow... for fun... because I can
      // let stroke
      // if (p1 % 3 == 0) {
      //   stroke = "rgb(0,255,255)"
      // }
      // if (p1 % 3 == 1) {
      //   stroke = "rgb(255,0,255)"
      // }
      // if (p1 % 3 == 2) {
      //   stroke = "rgb(255,255,0)"
      // }

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

      // g1.appendChild(layer)
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
