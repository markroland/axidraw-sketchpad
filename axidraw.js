let sketch = function(p) {

  // Set sketch margin in inches
  let margin = 0.25 * 96;

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
    fibonacci()
  }

  function fibonacci()
  {
    // Move to center
    p.push();
    p.translate(p.width/2, p.height/2)

    // Shapes
    let x = 0;
    let y = 0;
    let i_max = 200;
    let theta = 0;
    for (let i = 0; i < i_max; i++) {

      // Increase radius as function shape index
      r = (i/i_max) * p.width/2;

      // Calculate how much to rotate the shape around it's own origin
      // in order to "point" torward the center of the sketch
      theta += (Math.PI * (3 - Math.sqrt(5)));
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);
      let shape_theta = Math.atan2(y, x)
      if (shape_theta < 0) {
        shape_theta = (2 * Math.PI) + shape_theta;
      }

      // Apply transformation to shape. Rotate about the origin and then translate it
      p.push()
      p.rotate(shape_theta)
      p.translate(r, 0)

      // Only draw objects within the boundaries of the sketch (for the most part)
      if (Math.abs(x) < (p.width/2 - margin) && Math.abs(y) < (p.height/2 - margin)) {

        // Draw polygon
        p.beginShape();
        let polygon_theta = 0.0;
        let sides = 3;
        let polygon_radius = 5;
        let polygon_phase_offset = Math.PI;
        for (let a = 0; a < sides; a++) {
          polygon_theta = (a/sides) * (2 * Math.PI);
          p.vertex(polygon_radius * Math.cos(polygon_theta + polygon_phase_offset), polygon_radius * Math.sin(polygon_theta + polygon_phase_offset))
        }
        p.endShape(p.CLOSE);

      }

      p.pop()
    }

    p.pop()
  }

  function download()
  {
    let d = new Date();
    let filename = "p5js-axi-drawer_" + d.toISOString() + ".svg";
    p.save(filename);
  }
};

let myp5 = new p5(sketch, document.getElementById("p5js-canvas"));
