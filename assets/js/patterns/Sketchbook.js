/**
 * General Sketchbook
 */
class Sketchbook {

  constructor() {

    this.key = "sketchbook";

    this.name = "Sketchbook";

    this.constrain = false

    this.title = "Crop to Circle Study"
  }

  /**
   * Draw path
   */
  draw(p5) {
    this.p5 = p5
    // return this.default()
    // return this.toxiclibtest()
    // return this.tree();
    // return this.resolutionTest(5 * 48, 3 * 48);
    // return this.concaveHull();
    // return this.hyperbolicSpirals();
    return this.circleCrop();
  }

  default() {

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    paths.push(
      PathHelp.polygon(6, 0.5, 0)
    )

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  // https://editor.p5js.org/codingtrain/sketches/xTjmYXU3q
  tree() {

    let PathHelp = new PathHelper;

    let layers = new Array();

    this.treePaths = new Array();

    // Draw trunk
    this.treePaths.push([[0,-1], [0,0]]);

    // Start recursion
    this.draw_tree([0,0],0,1,8);

    // Scale down and flip
    let paths = this.treePaths.map(function(path){
      return PathHelp.scalePath(path, [0.5, -0.5])
    });

    // Center to path
    paths = PathHelp.centerPaths(paths);

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  draw_tree(position, angle, i, max_i) {

    // Final case
    if (i >= max_i) {
      return;
    }

    let PathHelp = new PathHelper;

    // Define path as "unit" line in Y direction
    let unit_path = [
      [0,0],
      [0,1]
    ]

    // Set the branch angle and length scale factor
    let unit_angle = Math.PI/9;
    let scale_factor = 0.8;

    // --- Branch A ---

    // Scale path down each time based on iteration count
    let path1 = unit_path;
    path1 = PathHelp.scalePath(path1, Math.pow(scale_factor, i))

    // Rotate path based on iteration count
    path1 = PathHelp.rotatePath(path1, angle + unit_angle);

    // Translate path to end of branch
    path1 = PathHelp.translatePath(path1, position)

    // Add to paths
    this.treePaths.push(path1)

    this.draw_tree(path1[1], angle + unit_angle, i + 1, max_i)

    // --- Branch B ---
    let path2 = unit_path;
    path2 = PathHelp.scalePath(path2, Math.pow(scale_factor, i))
    path2 = PathHelp.rotatePath(path2, angle - unit_angle);
    path2 = PathHelp.translatePath(path2, position)
    this.treePaths.push(path2)
    this.draw_tree(path2[1], angle - unit_angle, i + 1, max_i)
  }

  /*
   * http://haptic-data.com/toxiclibsjs/examples/polygon-clipping-p5
   * http://toxiclibs.org/docs/core/
   * https://en.wikipedia.org/wiki/Sutherland–Hodgman_algorithm
   **/
  toxiclibtest() {

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    let path = new Array();

    // Circle 1
    let circle1 = new toxi.geom.Circle(1.0);
    circle1.x = 0.5
    let polyCircle1 = circle1.toPolygon2D(120);

    // Convert to Polyline
    path = new Array();
    for (let point of polyCircle1.vertices) {
      path.push([point.x, point.y])
    }
    path.push(path[0])
    paths.push(path);

    // Circle 2
    let circle2 = new toxi.geom.Circle(1.0);
    circle2.x = -0.5
    let polyCircle2 = circle2.toPolygon2D(120);

    // Convert to Polyline
    /*
    path = new Array();
    for (let point of polyCircle2.vertices) {
      path.push([point.x, point.y])
    }
    path.push(path[0])
    paths.push(path);
    */

    // Use rectangle to clip Circle 2
    var clipper = new toxi.geom.SutherlandHodgemanClipper(
      new toxi.geom.Rect(-2,0,4,0.5)
    );
    let clippedShape = clipper.clipPolygon(polyCircle2);
    console.log(clippedShape);

    // Convert to Polyline
    path = new Array();
    for (let point of clippedShape.vertices) {
      path.push([point.x, point.y])
    }
    path.push(path[0])
    paths.push(path);

    // Add paths to layer
    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;

  }

  resolutionTest(width, height) {
    let layers = new Array();

    let paths = new Array()

    let PathHelp = new PathHelper;

    // Vertical Lines
    let vert_path = [
      [0,-1],
      [0,1],
    ]

    for (let i = 0; i <= width; i++) {

      // Toggle path direction for plotting efficiency
      vert_path.reverse();

      paths.push(
        PathHelp.translatePath(
          vert_path,
          [
            PathHelp.map(i, 0, width, -5/3, 5/3),
            0
          ]
        )
      )
    }

    // Horizontal Lines
    let horizontal_path = [
      [-5/3,0],
      [5/3,0],
    ]
    for (let j = 0; j <= height; j++) {

      // Toggle path direction for plotting efficiency
      horizontal_path.reverse();

      paths.push(
        PathHelp.translatePath(
          horizontal_path,
          [
            0,
            PathHelp.map(j, 0, height, -1, 1)
          ]
        )
      )
    }

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  concaveHull() {

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    // Random points
    //*
    let num_points = 60;
    let padding = 0.5;
    let points = new Array();
    for (let i = 0; i < num_points; i++) {
      points.push([
        (1 - padding) * PathHelp.getRandom(-5/3, 5/3),
        (1 - padding) * PathHelp.getRandom(-1, 1)
      ])
    }
    // console.log("Point Set: ", points)
    //*/

    // Debugging: Render points in p5 land
    //*
    for (let i = 0; i < points.length; i++) {
      this.p5.noStroke();
      this.p5.fill(0,0,255);
      let x = this.p5.width/2 + 288/2 * points[i][0];
      let y = this.p5.height/2 + 288/2 * points[i][1]
      this.p5.ellipse(x, y, 3, 3);
      this.p5.textSize(8)
      this.p5.text(i, x + 4, y + 3);
      this.p5.noFill();
    }
    //*/

    // Calculate Concave Hull
    let hull = concaveHull.calculate(points, 3);
    if (hull !== null) {
      paths = [hull]
    }

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  hyperbolicSpirals() {

    let num_spirals = 7;

    let PathHelp = new PathHelper;
    let layers = new Array();
    let paths = new Array()
    let path, bbox;
    let Spir = new Spiral;

    for (let i = 0; i < num_spirals; i++) {

      // Set parameters
      let a = PathHelp.getRandom(0.1, 5/3);
      let revolutions = PathHelp.getRandom(0.1, 5.0);
      let max_x = PathHelp.getRandom(0.5, 2);
      let flip = false;
      if (Math.random() > 0.5) {
        flip = true;
      }

      // calculate spiral and move to bottom-center of canvas
      path = Spir.hyperbolic(a, revolutions, max_x)
      bbox = PathHelp.boundingBox(path);
      path = PathHelp.translatePath(path, [-bbox[0][1], -bbox[1][1]])
      path = PathHelp.rotatePath(path, Math.PI/2)
      if (flip) {
        path = PathHelp.scalePath(path, [-1, 1]);
      }
      path = PathHelp.translatePath(path, [0, 1])
      paths.push(path)
    }

    layers.push({
      "color": "green",
      "paths": paths
    })

    return layers;
  }

  circleCrop() {

    const max_radius = (Math.min(canvas_x_max - canvas_x_min, canvas_y_max - canvas_y_min) / 2);

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    // Design
    const num_lines = 50;
    for (let i = 0; i < num_lines; i++) {

      let steps = 120;
      let line = new Array();
      for (let j = 0; j < steps; j++) {
        line.push([
          PathHelp.map(j, 0, steps, canvas_x_min, canvas_x_max),
          PathHelp.map(i, 0, num_lines, 1.25 * canvas_y_min, 1.25 * canvas_y_max)
            + 0.1 * Math.cos((4 + 4 * (i/num_lines)) * (j/steps) * (2 * Math.PI))
        ])
      }
      paths.push(line);
    }

    // Debug test override
    /*
    paths = [
      [
        [-1.1, -0.2],
        [-0.5, -0.5]
      ],
      [
        [-5/3, 0.5],
        [0, 0.5]
      ]
    ]
    //*/

    /*
    // Show paths before crop
    layers.push({
      "color": "cyan",
      "paths": paths
    })
    //*/

    // Crop Paths
    paths = PathHelp.cropToCircle(paths, [0,0], 0.95 * max_radius)

    // Draw border circle
    //*
    layers.push({
      "color": "red",
      "paths": [PathHelp.polygon(60, max_radius, 0)]
    })
    //*/

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }
}