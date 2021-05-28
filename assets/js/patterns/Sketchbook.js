/**
 * General Sketchbook
 */
class Sketchbook {

  constructor() {

    this.key = "sketchbook";

    this.name = "Sketchbook";

    this.constrain = false

    this.title = "Recursive Tree"
  }

  /**
   * Draw path
   */
  draw(p5) {
    // return this.default()
    // return this.toxiclibtest()
    return this.tree();
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
}