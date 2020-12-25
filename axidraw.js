let sketch = function(p) {

  // Set sketch margin in inches
  let margin = 0.25 * 96;

  var Patterns = {
    "cycloid": new Cycloid(),
    "fibonacci": new Fibonacci(),
    "lindenmayer": new Lindenmayer(),
    "spiral": new Spiral()
  }

  let selectedPattern = "lindenmayer";

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

    // Draw axis
    /*
    p.line(0,p.height/2,0, -p.height/2)
    p.line(-p.width/2, 0, p.width/2, 0)
    //*/

    for (i = 0; i < paths.length; i++) {
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
