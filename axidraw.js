let sketch = function(p) {

  // Set sketch margin in inches
  let margin = 0.25 * 96;

  var Patterns = {
    "bezierquadratic": new BezierQuadratic(),
    "cycloid": new Cycloid(),
    "fibonacci": new Fibonacci(),
    "genuary": new Genuary(),
    "heart": new Heart(),
    "lindenmayer": new Lindenmayer(),
    "negativespace": new NegativeSpace(),
    "lissajous": new Lissajous(),
    "spiral": new Spiral()
  }

  let selectedPattern = "negativespace";

  p.setup = function() {

    // Create SVG Canvas (6" x 4" @ 96pts/inch)
    p.createCanvas(576, 384, p.SVG);

    // Load the font JSON data
    $.getJSON('/assets/js/hersheytext.min.json', function(fonts){

      let svg_text = '';

      // Title
      /*
      let font_size = 12;
      let title_svg = renderText('', {
        font: fonts['futural'],
        pos: {x: 0, y: 0},
        scale: 2,
        charWidth: 8,
      });
      svg_text = '<g transform="translate(' + margin + ',' + ((2 * margin - font_size)/2) + ') scale(' + (font_size/21) + ',' + (font_size/21) + ')">' + title_svg + "</g>"
      //*/

      // Date
      font_size = 8;
      let now = new Date();
      let date_svg = renderText(
        (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear(),
        {
          font: fonts['futural'],
          pos: {x: 0, y: 0},
          scale: 2,
          charWidth: 8,
        }
      );
      svg_text += '<g transform="translate(' + margin + ',' + ((p.height - 2 * margin) + ((2 * margin - font_size)/2)) + ') scale(' + (font_size/21) + ',' + (font_size/21) + ')">' + date_svg + "</g>"

      // Initials
      //*
      let initials_rotation = "0"; let initials_position = '532,354'; // Landscape
      // let initials_rotation = "-90"; let initials_position = '532,30'; // Portrait
      svg_text += '<g transform="translate(' + initials_position + ') rotate(' + initials_rotation + ' 5 5)">'
      svg_text += '<path fill="none" stroke="rgb(0,0,0)" paint-order="fill stroke markers" stroke-opacity="1" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.42" d="M 0.52831513,9.9326943 2.8794102,-0.05945861 4.0549577,6.1121658 6.6999395,0.52831513 5.5243921,11.108241" id="path1421" /><path fill="none" stroke="rgb(0,0,0)" paint-order="fill stroke markers" stroke-opacity="1" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.42"  d="m 7.3002589,10.146612 0.458014,-9.61829687 c 0,0 3.7857471,0.3053972 4.1221261,1.83205677 0.336379,1.5266596 -3.2060981,3.6641137 -3.2060981,3.6641137 L 13.712455,10.37562" id="path1423" />';
      svg_text += '</g>'
      // document.querySelector('#defaultCanvas0>svg>g').innerHTML = '<g transform="translate(' + initials_position + ') rotate(' + initials_rotation + ' 5 5)">' + initials + "</g>";
      //*/

      document.querySelector('#defaultCanvas0>svg>g').innerHTML = svg_text;

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
    downloadButton = p.createButton('Download')
      .parent('download');
    downloadButton.mousePressed(download);
  }

  p.draw = function() {

    paths = Patterns[selectedPattern].draw();

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

    let constrain = true;

    // Set the "canvas unit" as the number of pixels between
    // the center of the canvas and the nearest margin
    let canvas_unit = ((p.min(p.width, p.height)/2) - margin * 2)

    p.stroke(0);
    for (i = 0; i < paths.length; i++) {

      /*
      // Randomize stroke. This can help identify shapes if they overlap
      p.stroke(
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
      );
      //*/

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

    if (x1 > x_max) {
      intersect = intersect_point([x_max,y_min], [x_max,y_max], [x0, y0], [x1, y1])
      x = intersect[0]
      y = intersect[1]
    } else if (x1 < x_min) {
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
    let d = new Date();
    let filename = "axidraw_" + selectedPattern + "_" + d.toISOString() + ".svg";
    p.save(filename);
  }
};

let myp5 = new p5(sketch, document.getElementById("p5js-canvas"));
