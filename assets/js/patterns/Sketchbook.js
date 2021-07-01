/**
 * General Sketchbook
 */
class Sketchbook {

  constructor() {

    this.key = "sketchbook";

    this.name = "Sketchbook";

    this.constrain = false

    this.title = "Concave Hull"
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
    return this.concaveHull();
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

    // Note: Convex Hull is [7, 2, 5, 13, 0, 11, 10, 12, 9, 17]
    let points = [
      [
        0.7438854677770076,
        -0.2794490150906719
      ],
      [
        0.19316064164670432,
        0.18392217661438748
      ],
      [
        0.3419442026497984,
        0.315895175238903
      ],
      [
        0.029684678363623207,
        -0.21531091784534073
      ],
      [
        -0.5326825611210722,
        -0.29583390683641975
      ],
      [
        0.3692983857862123,
        0.21348765229455857
      ],
      [
        -0.6269111098827056,
        0.150827534291329
      ],
      [
        0.18828772455855824,
        0.4977987730394826
      ],
      [
        -0.5713060903898933,
        -0.4216786905374248
      ],
      [
        -0.7594094243742526,
        0.2578594523166655
      ],
      [
        -0.6372356730832148,
        -0.4654488764827698
      ],
      [
        0.3653593228227717,
        -0.30664402166203986
      ],
      [
        -0.7609229267160833,
        0.12088711772756588
      ],
      [
        0.5827826854708699,
        0.0782575399954053
      ],
      [
        -0.07541453319713232,
        -0.18556956196556063
      ],
      [
        0.32702616585448785,
        -0.19992391086263628
      ],
      [
        -0.6265125911219276,
        0.1479946332831117
      ],
      [
        -0.8319372481468628,
        0.47246305511925457
      ],
      [
        -0.2569678175425497,
        -0.2258057714115289
      ],
      [
        -0.4868673940605869,
        0.010617368712530162
      ]
    ]

    // Random Starting points
    /*
    let num_points = 20;
    let padding = 0.5;
    let points = new Array();
    for (let i = 0; i < num_points; i++) {
      points.push([
        (1 - padding) * PathHelp.getRandom(-5/3, 5/3),
        (1 - padding) * PathHelp.getRandom(-1, 1)
      ])
    }
    console.log(points);
    //*/

    // Debugging: Render points in p5 land
    //*
    for (let i = 0; i < points.length; i++) {
      this.p5.noStroke();
      this.p5.fill(0,0,255);
      let x = this.p5.width/2 + 288/2 * points[i][0];
      let y = this.p5.height/2 + 288/2 * points[i][1]
      this.p5.ellipse(x, y, 5, 5);
      this.p5.text(i, x + 4, y + 5);
      this.p5.noFill();
    }
    //*/

    // layers.push({
    //   "color": "blue",
    //   "paths": [points]
    // })

    // Calculate Concave Hull
    let hull = concaveHull.calculate(points, 3);
    console.log("concaveHull() hull: ", hull);
    layers.push({
      "color": "black",
      "paths": [hull]
    })

    // Convex Hull
    /*
    layers.push({
      "color": "red",
      "paths": [
        [
          points[7],
          points[2],
          points[5],
          points[13],
          points[0],
          points[11],
          points[10],
          points[12],
          points[9],
          points[17],
          points[7]
        ]
      ]
    })
    //*/

    return layers;
  }
}