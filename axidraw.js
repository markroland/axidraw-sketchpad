let sketch = function(p) {

  // Set sketch margin in inches
  let margin = 0.25 * 96;

  var Patterns = {
    "cycloid": new Cycloid(),
    "fibonacci": new Fibonacci(),
    "genuary": new Genuary(),
    "heart": new Heart(),
    "lindenmayer": new Lindenmayer(),
    "spiral": new Spiral()
  }

  let selectedPattern = "genuary";

  p.setup = function() {

    // Create SVG Canvas (6" x 4" @ 96pts/inch)
    p.createCanvas(576, 384, p.SVG);

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
