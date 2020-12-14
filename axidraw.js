let sketch = function(p) {

  /*
  See SVG Documentation at https://github.com/zenozeng/p5.js-svg/blob/master/doc/overview.md
  */

  p.setup = function() {

    // Create SVG Canvas (6" x 4" @ 96pts/inch)
    p.createCanvas(576, 384, p.SVG);

    // Set stroke
    p.strokeWeight(1.42);
    p.stroke(0, 0, 0);
    p.noFill();

    // Download controls
    downloadButton = p.createButton('Download')
      // .parent('download');
    downloadButton.mousePressed(download);

    console.log(downloadButton)
    console.log(document.querySelector('button'));

    p.noLoop();
  }

  p.draw = function() {
    fibonacci()
  }

  function fibonacci()
  {
    let x = p.width / 2;
    let y = p.height / 2;
    let i_max = 100;
    let theta = 0;

    for (let i = 0; i < i_max; i++) {
      r = (i/i_max) * p.width;
      theta += (Math.PI * (3 - Math.sqrt(5)));
      x = x + r * Math.cos(theta);
      y = y + r * Math.sin(theta);
      if (Math.abs(x) < p.width && Math.abs(y) < p.height) {
        p.ellipse(x, y, 10 + 100 * (i/i_max), 10 + 100 * (i/i_max))
      }
    }
  }

  function download()
  {
    let d = new Date();
    let filename = "p5js-axi-drawer_" + d.toISOString() + ".svg";
    p.save(filename);
  }
};

// new p5(null, document.getElementById("p5js-canvas")); // global init p5

let myp5 = new p5(sketch, document.getElementById("p5js-canvas"));
