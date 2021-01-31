let sketch = function(p) {

  // Set sketch margin in inches
  let margin = 0.25 * 96;

  var Patterns = {
    "cycloid": new Cycloid(),
    "fibonacci": new Fibonacci(),
    "genuary": new Genuary(),
    "heart": new Heart(),
    "lindenmayer": new Lindenmayer(),
    "lissajous": new Lissajous(),
    "spiral": new Spiral()
  }

  let selectedPattern = "genuary";

  p.setup = function() {

    // Create SVG Canvas (6" x 4" @ 96pts/inch)
    p.createCanvas(576, 384, p.SVG);

    // Initials
    //*
    let initials_rotation = "0"; let initials_position = '532,340'; // Landscape
    // let initials_rotation = "-90"; let initials_position = '532,30'; // Portrait
    let initials = '<path fill="none" stroke="rgb(0,0,0)" paint-order="fill stroke markers" stroke-opacity="1" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.42" d="M 0.52831513,9.9326943 2.8794102,-0.05945861 4.0549577,6.1121658 6.6999395,0.52831513 5.5243921,11.108241" id="path1421" /><path fill="none" stroke="rgb(0,0,0)" paint-order="fill stroke markers" stroke-opacity="1" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.42"  d="m 7.3002589,10.146612 0.458014,-9.61829687 c 0,0 3.7857471,0.3053972 4.1221261,1.83205677 0.336379,1.5266596 -3.2060981,3.6641137 -3.2060981,3.6641137 L 13.712455,10.37562" id="path1423" />';
    document.querySelector('#defaultCanvas0>svg>g').innerHTML = '<g transform="translate(' + initials_position + ') rotate(' + initials_rotation + ' 5 5)">' + initials + "</g>";
    //*/

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
        let x = paths[i][j][0] * ((p.min(p.width, p.height)/2) - margin * 2);
        let y = paths[i][j][1] * ((p.min(p.width, p.height)/2) - margin * 2);
        p.vertex(x, y)
      }
      // TODO: "mode" should be defined by the path
      p.endShape();
    }

    p.pop();
  }

  function download()
  {
    let d = new Date();
    let filename = "axidraw_" + selectedPattern + "_" + d.toISOString() + ".svg";
    p.save(filename);
  }
};

let myp5 = new p5(sketch, document.getElementById("p5js-canvas"));
