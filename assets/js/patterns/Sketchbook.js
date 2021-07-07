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

    let paths = new Array();

    // Note: Convex Hull is [7, 2, 5, 13, 0, 11, 10, 12, 9, 17]
    let pointsA = [
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

    let pointsB = [
      [-0.2, -0.8],
      [ 0.1, -0.8],
      [ 0.5, -0.7],
      [ 0.6, -0.6],
      [-0.5, -0.5],
      [ 0.3, -0.4],
      [-0.6, -0.2],
      [-0.35, -0.18],
      [0.05, -0.2],
      [-0.1, 0.1],
      [-0.6, 0.2],
      [0.05, 0.4],
      [-0.5, 0.5],
      [ 0.5, 0.55],
      [-0.1, 0.7],
      [ 0.2, 0.8]
    ]

    // Random points
    //*
    let num_points = 60;
    let padding = 0.5;
    let pointsC = new Array();
    for (let i = 0; i < num_points; i++) {
      pointsC.push([
        (1 - padding) * PathHelp.getRandom(-5/3, 5/3),
        (1 - padding) * PathHelp.getRandom(-1, 1)
      ])
    }
    console.log("Point Set: ", pointsC)
    //*/

    let pointsD = [
        [
            -0.6717058234672476,
            -0.36067035786057655
        ],
        [
            0.8300752969067849,
            0.35195148308031543
        ],
        [
            -0.22182157220998588,
            -0.4830104691540238
        ],
        [
            -0.351285323079165,
            0.25654227286472775
        ],
        [
            0.07674137785209756,
            0.3113190558940957
        ],
        [
            -0.4677598703292085,
            0.11118262069516671
        ],
        [
            -0.2642826338487966,
            -0.37292159553569015
        ],
        [
            -0.3933035920110036,
            0.33346852206268296
        ],
        [
            -0.06509087919061607,
            0.3780246095718496
        ],
        [
            0.28130138754873213,
            -0.16465602900598908
        ]
    ]

    let pointsE = [
    [
        0.16029647697324878,
        -0.3151870713687899
    ],
    [
        -0.2880337057689838,
        0.1328264319112995
    ],
    [
        -0.4564476446796188,
        -0.07054090962244985
    ],
    [
        -0.21796325020426754,
        0.29399013156699727
    ],
    [
        0.11900584485207844,
        0.06694707653914223
    ],
    [
        0.4713977959088519,
        -0.13242768900368707
    ],
    [
        -0.4374772971978791,
        -0.4989791649452473
    ],
    [
        0.49282411054539244,
        0.4437022481112831
    ],
    [
        -0.5771362552610464,
        -0.2948565621477366
    ],
    [
        0.5736483724789746,
        -0.2692874858202181
    ],
    [
        -0.25331343678162477,
        0.4650545814462739
    ],
    [
        0.48955249690822245,
        -0.359209287811723
    ],
    [
        -0.17472455117102859,
        -0.4282475321139214
    ],
    [
        0.13150113578146472,
        0.37558536524480757
    ],
    [
        0.1516882356135455,
        0.21775755324788615
    ],
    [
        0.799096594806339,
        -0.4401436735321622
    ],
    [
        0.24860905153731705,
        0.06047202927270923
    ],
    [
        -0.7258998898857283,
        0.05274713900136785
    ],
    [
        0.7669817227910173,
        -0.36026247053122273
    ],
    [
        -0.3266526045863768,
        0.2523370601988386
    ]
];

    let points = pointsC;
    // console.log(points);

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

    // layers.push({
    //   "color": "blue",
    //   "paths": [points]
    // })

    // Calculate Concave Hull
    let hull = concaveHull.calculate(points, 3);
    if (hull !== null) {
      paths = [hull]
    }

    layers.push({
      "color": "black",
      "paths": paths
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