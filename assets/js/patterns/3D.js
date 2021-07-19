/**
 * 3D
 *
 * Transformation code modified from Coding Train "3D Rendering with Rotation and Projection"
 *  - https://thecodingtrain.com/CodingChallenges/112-3d-rendering.html
 *  - https://editor.p5js.org/codingtrain/sketches/r8l8XXD2A
 *
 */
class ThreeD {

  constructor() {
    this.key = "3d";
    this.name = "3D";
    this.title = "";
    this.constrain = false
  }

  /**
   * Draw path
   */
  draw(p5) {
    // return this.simpleCube()
    return this.cube2()
    // return this.anaglyphCube()
    // return this.cubeGrid(2)
    // return this.isometricPlanes()
    // return this.sphere()
    // return this.sphereSpiral()
    // return this.noisePlane(p5)
    // return this.geoData()
    // return this.grandPrix()
    // return this.geoIsolines(p5)
    // return this.attractor()
    // return this.spikeBall();
    // return this.sphereCircles();
  }

  simpleCube() {

    let PathHelp = new PathHelper;
    let layers = new Array();
    let paths = new Array();
    let path = new Array();

    // Set angle of shape rotation
    let angle = (5/100) * (2 * Math.PI);

    // Define 3D shape (cube) (x,y,z)
    let points = [
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5]
    ];

    const rotationZ = [
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle),  Math.cos(angle), 0],
      [0, 0, 1]
    ];

    const rotationX = [
      [1, 0, 0],
      [0, Math.cos(angle), -Math.sin(angle)],
      [0, Math.sin(angle),  Math.cos(angle)]
    ];

    const rotationY = [
      [ Math.cos(angle), 0, Math.sin(angle)],
      [0, 1, 0],
      [-Math.sin(angle), 0, Math.cos(angle)]
    ];

    let projected = [];

    // Loop through Model points and apply transformation and projection
    for (let i = 0; i < points.length; i++) {

      // Apply rotation

      let rotated = this.matrixMultiply(rotationY, points[i]);
      rotated = this.matrixMultiply(rotationX, rotated);

      let distance = 2;
      let z = 1 / (distance - rotated[2]);
      const projection = [
        [z, 0, 0],
        [0, z, 0]
      ];
      rotated = this.matrixMultiply(rotationZ, rotated);

      // Project model onto 2D surface
      let projected2d = this.matrixMultiply(projection, rotated);

      // Scale as necessary
      projected2d = this.matrixMultiply(projected2d, 0.5)

      // Push point to path
      path.push([
        projected2d[0], projected2d[1]
      ])
    }

    // Connect points to create paths (edges)
    for (let i = 0; i < 4; i++) {
      paths.push(
        new Array(
          path[i],
          path[(i + 1) % 4]
        )
      );
      paths.push(
        new Array(
          path[i + 4],
          path[((i + 1) % 4) + 4],
        )
      );
      paths.push(
        new Array(
          path[i],
          path[i + 4]
        )
      );
    }

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  cube2() {

    let PathHelp = new PathHelper;
    let layers = new Array();
    let paths = new Array();
    let path = new Array();

    // Define 3D shape (cube) (x,y,z)
    let points = [
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5]
    ];

    // Translate the points
    points = this.translatePoints3D(points, [0.5, 0.5, 0.0])

    // Rotate the world and Project (flatten) 3D world to 2D
    const rotateWorldX = this.rotateX((1/16) * (2 * Math.PI));
    const rotateWorldY = this.rotateY((2/16) * (2 * Math.PI));;
    const rotateWorldZ = this.rotateZ((2/16) * (2 * Math.PI));;
    let points3D = this.project3D(points, [rotateWorldY, rotateWorldX], 6, 12)[0]

    // Connect points to create paths (edges)
    for (let i = 0; i < 4; i++) {
      paths.push(
        new Array(
          points3D[i],
          points3D[(i + 1) % 4]
        )
      );
      paths.push(
        new Array(
          points3D[i + 4],
          points3D[((i + 1) % 4) + 4],
        )
      );
      paths.push(
        new Array(
          points3D[i],
          points3D[i + 4]
        )
      );
    }

    layers.push({
      "color": "black",
      "paths": paths
    })

    // Create a 2nd cube that's modified on it's own, but shares the same world projection

    let points2 = points;
    points2 = this.rotatePoints3dX(points2, (1/32) * (2 * Math.PI))
    points2 = this.translatePoints3D(points2, [0.1, 0.1, 0.2])
    let points2_3D = this.project3D(points2, [rotateWorldY, rotateWorldX], 6, 12)[0]

    // Connect points to create paths (edges)
    paths = new Array();
    for (let i = 0; i < 4; i++) {
      paths.push(
        new Array(
          points2_3D[i],
          points2_3D[(i + 1) % 4]
        )
      );
      paths.push(
        new Array(
          points2_3D[i + 4],
          points2_3D[((i + 1) % 4) + 4],
        )
      );
      paths.push(
        new Array(
          points2_3D[i],
          points2_3D[i + 4]
        )
      );
    }

    layers.push({
      "color": "blue",
      "paths": paths
    })

    return layers
  }

  anaglyphCube() {

    let PathHelp = new PathHelper;
    let layers = new Array();
    let paths = new Array();
    let path = new Array();

    let paths2 = new Array();
    let path2 = new Array();

    // Set angle of shape rotation
    let angle = 0.08 * (2 * Math.PI);

    // Define 3D shape (cube) (x,y,z)
    let points = [
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5]
    ];

    const rotationZ = [
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle),  Math.cos(angle), 0],
      [0, 0, 1]
    ];

    const rotationX = [
      [1, 0, 0],
      [0, Math.cos(angle), -Math.sin(angle)],
      [0, Math.sin(angle),  Math.cos(angle)]
    ];

    const rotationY = [
      [ Math.cos(angle), 0, Math.sin(angle)],
      [0, 1, 0],
      [-Math.sin(angle), 0, Math.cos(angle)]
    ];

    let projected = [];

    // Loop through Model points and apply transformation and projection
    for (let i = 0; i < points.length; i++) {

      // Apply rotation

      let rotated = this.matrixMultiply(rotationY, points[i]);
      rotated = this.matrixMultiply(rotationX, rotated);

      let distance = 2;
      let z = 1 / (distance - rotated[2]);
      // let z = 1
      const projection = [
        [z, 0, 0],
        [0, z, 0]
      ];
      rotated = this.matrixMultiply(rotationZ, rotated);

      let shape2 = [...rotated]

      // Translate X
      let offset = 0.025
      rotated[0] += offset
      shape2[0] -= offset

      // Project model onto 2D surface
      let projected2d = this.matrixMultiply(projection, rotated);
      let projectedshape2 = this.matrixMultiply(projection, shape2);

      // Scale as necessary
      projected2d = this.matrixMultiply(projected2d,2)
      projectedshape2 = this.matrixMultiply(projectedshape2, 2)

      // Push point to path
      path.push([
        projected2d[0], projected2d[1]
      ])

      path2.push([
        projectedshape2[0], projectedshape2[1]
      ])
    }

    // Connect points to create paths (edges)
    for (let i = 0; i < 4; i++) {
      paths.push(
        new Array(
          path[i],
          path[(i + 1) % 4]
        )
      );
      paths.push(
        new Array(
          path[i + 4],
          path[((i + 1) % 4) + 4],
        )
      );
      paths.push(
        new Array(
          path[i],
          path[i + 4]
        )
      );
    }

    for (let i = 0; i < 4; i++) {
      paths2.push(
        new Array(
          path2[i],
          path2[(i + 1) % 4]
        )
      );
      paths2.push(
        new Array(
          path2[i + 4],
          path2[((i + 1) % 4) + 4],
        )
      );
      paths2.push(
        new Array(
          path2[i],
          path2[i + 4]
        )
      );
    }

    layers.push({
      "color": "cyan",
      "paths": paths
    })

    layers.push({
      "color": "magenta",
      "paths": paths2
    })

    return layers;
  }

  cubeGrid(gridScale) {

    let PathHelp = new PathHelper;
    let layers = new Array();

    // Grid test
    let rows = 3 * gridScale;
    let columns = 5 * gridScale;
    // let side_length = (1/rows);
    let side_length = (1/gridScale) * 0.33

    // Define 3D shape (cube) (x,y,z)
    let points = [
      [-side_length, -side_length, -side_length],
      [ side_length, -side_length, -side_length],
      [ side_length,  side_length, -side_length],
      [-side_length,  side_length, -side_length],
      [-side_length, -side_length,  side_length],
      [ side_length, -side_length,  side_length],
      [ side_length,  side_length,  side_length],
      [-side_length,  side_length,  side_length]
    ];

    // Fill Grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {

        let paths = new Array();
        let path = new Array();

        // Index position
        let id = (r * columns) + c;

        // Set angle of shape rotation
        // let angle = (c / columns) * (0.5 * Math.PI);
        let angle = (id / (rows * columns)) * (2 * Math.PI);

        // Set Transformation matrices (rotrations)
        const rotationZ = [
          [Math.cos(angle), -Math.sin(angle), 0],
          [Math.sin(angle),  Math.cos(angle), 0],
          [0, 0, 1]
        ];
        const rotationX = [
          [1, 0, 0],
          [0, Math.cos(angle), -Math.sin(angle)],
          [0, Math.sin(angle),  Math.cos(angle)]
        ];
        const rotationY = [
          [ Math.cos(angle), 0, Math.sin(angle)],
          [0, 1, 0],
          [-Math.sin(angle), 0, Math.cos(angle)]
        ];

        // Loop through Model points and apply transformation and projection
        let projected = [];
        for (let i = 0; i < points.length; i++) {

          // Apply rotation
          let rotated = this.matrixMultiply(rotationY, points[i]);
          rotated = this.matrixMultiply(rotationX, rotated);
          rotated = this.matrixMultiply(rotationZ, rotated);

          // Project model onto 2D surface
          // Calculate "weak perspective" on Z Axis
          let distance = 2;
          let z = 1 / (distance - rotated[2]);
          const projection = [
            [z, 0, 0],
            [0, z, 0]
          ];
          let projected2d = this.matrixMultiply(projection, rotated);

          // Push point to path
          path.push([
            projected2d[0], projected2d[1]
          ])
        }

        // Connect points to create paths (edges)
        for (let i = 0; i < 4; i++) {
          paths.push(
            new Array(
              path[i],
              path[(i + 1) % 4]
            )
          );
          paths.push(
            new Array(
              path[i + 4],
              path[((i + 1) % 4) + 4],
            )
          );
          paths.push(
            new Array(
              path[i],
              path[i + 4]
            )
          );
        }

        // Translate to position on grid
        for (let i = 0; i < paths.length; i++) {

          // Distribute shapes across grid
          // Top-left of this is at local origin (center of canvas)
          paths[i] = PathHelp.translatePath(
            paths[i],
            [
              (2 * (columns/rows) * (c/columns)),
              (2 * (r/rows))
            ]
          )

          // Move from center to top-left
          paths[i] = PathHelp.translatePath(
            paths[i],
            [
              -5/3 + 1/rows,
              -1 + 1/rows
            ]
          )
        }

        // Put each model/shape on its own layer
        layers.push({
          "color": "cyan",
          "paths": paths
        })

      }
    }

    return layers;
  }

  isometricPlanes() {

    let PathHelp = new PathHelper;
    let layers = new Array();
    let paths = new Array();
    let path = new Array();

    // Define 3D shape (cube) (x,y,z)
    let side_length = 1;
    let planes = [
      [
        [-side_length, 0, -side_length],
        [ side_length, 0, -side_length],
        [ side_length, 0, side_length],
        [-side_length, 0, side_length]
      ]
      ,
      [
        [-side_length, -side_length, 0],
        [ side_length, -side_length, 0],
        [ side_length, side_length, 0],
        [-side_length, side_length, 0]
      ]
      ,
      [
        [0, -side_length, -side_length],
        [0,  side_length, -side_length],
        [0,  side_length,  side_length],
        [0, -side_length,  side_length]
      ]
    ];

    // https://en.wikipedia.org/wiki/Rotation_matrix
    const x_rotation = (0/16) * (2 * Math.PI)
    const rotationX = [
      [1, 0, 0],
      [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
      [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
    ];

    const y_rotation = (0/16) * (2 * Math.PI)
    const rotationY = [
      [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
      [0, 1, 0],
      [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
    ];

    const z_rotation = (1/16) * (2 * Math.PI)
    const rotationZ = [
      [Math.cos(z_rotation), -Math.sin(z_rotation), 0],
      [Math.sin(z_rotation),  Math.cos(z_rotation), 0],
      [0, 0, 1]
    ];

    let z
    let projected = [];

    // Loop through Model points and apply transformation and projection
    for (let h = 0; h < planes.length; h++) {
      let points = planes[h];
      let paths = new Array();
      let path = new Array();
      for (let i = 0; i < points.length; i++) {

        // Apply rotation
        let world = points[i]

        world = this.matrixMultiply(rotationY, world);
        world = this.matrixMultiply(rotationX, world);
        world = this.matrixMultiply(rotationZ, world);

        // Set projection matrix
        let distance = 8;
        // z = 1
        z = 1 / (distance - world[2]);
        const projection = [
          [z, 0, 0],
          [0, z, 0]
        ];

        // Translate Y
        // world[1] += 0.5;

        // Project model onto 2D surface
        let projected2d = this.matrixMultiply(projection, world);

        // Scale as necessary
        projected2d = this.matrixMultiply(projected2d, 4)

        // Push point to path
        path.push([
          projected2d[0], projected2d[1]
        ])
      }

      // And first point to close path
      path.push(path[0])

      // Add path to Paths
      paths.push(path);

      let color = "black"
      switch(h) {
        case 0:
          color = "green"
          break;
        case 1:
          color = "blue"
          break;
        case 2:
          color = "red"
          break;
        default:
          color = "black"
      }

      layers.push({
        "color": color,
        "paths": paths
      })
    }

    return layers;
  }

  sphere() {

    let PathHelp = new PathHelper;
    let layers = new Array();
    let paths = new Array();
    let path = new Array();

    // Define Model(s)
    let shapes = new Array();
    let shape = new Array();
    let sides = 48;
    let rings = 24;
    let radius = 2;
    for (let a = 1; a < rings; a++) {
      // if (a % 2 == 0) { continue }
      let shape = new Array();
      let y = PathHelp.map(a, 0, rings, -radius, radius)
      let theta_2 = Math.asin(y/radius)
      for (let i = 0; i < sides; i++) {
        let x = radius * Math.sin(theta_2 + Math.PI/2) * Math.cos(i/sides * 2 * Math.PI)
        let z = radius * Math.sin(theta_2 + Math.PI/2) * Math.sin(i/sides * 2 * Math.PI)
        shape.push([x,y,z])
      }
      shapes.push(shape);
    }

    // Define Transformations
    const x_rotation = (1/16) * (2 * Math.PI)
    const rotationX = [
      [1, 0, 0],
      [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
      [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
    ];

    const y_rotation = (2/16) * (2 * Math.PI)
    const rotationY = [
      [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
      [0, 1, 0],
      [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
    ];

    const z_rotation = (0/16) * (2 * Math.PI)
    const rotationZ = [
      [Math.cos(z_rotation), -Math.sin(z_rotation), 0],
      [Math.sin(z_rotation),  Math.cos(z_rotation), 0],
      [0, 0, 1]
    ];

    // Loop through Model points and apply transformation and projection
    for (let h = 0; h < shapes.length; h++) {

      // Perspective
      let paths = this.transform(shapes[h], [rotationY, rotationX], 6, 12)

      // Orthographic
      // let paths = this.transform(shapes[h], [rotationY, rotationX], 0.5, 1)

      let color = "black"
      switch(h) {
        case 0:
          color = "red"
          break;
        case 1:
          color = "green"
          break;
        case 2:
          color = "blue"
          break;
        default:
          color = "black"
      }

      layers.push({
        "color": color,
        "paths": paths
      })
    }

    return layers;
  }

  sphereSpiral() {

    let PathHelp = new PathHelper;
    let layers = new Array();

    // Define Model(s)
    let shapes = new Array();
    let shape = new Array();
    let sides = 48;
    let revolutions = 32;
    let radius = 2;
    for (let a = 0; a < revolutions; a++) {
      for (let i = 0; i < sides; i++) {
        let y = PathHelp.map(a*sides + i, 0, revolutions*sides, -radius, radius)
        let theta_2 = Math.asin(y/radius)
        let x = radius * Math.sin(theta_2 + Math.PI/2) * Math.cos(i/sides * 2 * Math.PI)
        let z = radius * Math.sin(theta_2 + Math.PI/2) * Math.sin(i/sides * 2 * Math.PI)
        shape.push([x,y,z])
      }
    }
    shapes.push(shape);

    // Define Transformations
    const x_rotation = (2/16) * (2 * Math.PI)
    const rotationX = [
      [1, 0, 0],
      [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
      [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
    ];

    const y_rotation = (0/16) * (2 * Math.PI)
    const rotationY = [
      [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
      [0, 1, 0],
      [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
    ];

    const z_rotation = (0/16) * (2 * Math.PI)
    const rotationZ = [
      [Math.cos(z_rotation), -Math.sin(z_rotation), 0],
      [Math.sin(z_rotation),  Math.cos(z_rotation), 0],
      [0, 0, 1]
    ];

    // Loop through Model points and apply transformation and projection
    for (let h = 0; h < shapes.length; h++) {

      // Perspective
      let paths = this.transform(shapes[h], [rotationY, rotationX], 6, 12)

      // Orthographic
      // let paths = this.transform(shapes[h], [rotationY, rotationX], 0.5, 1)

      let color = "black"
      switch(h) {
        case 0:
          color = "red"
          break;
        case 1:
          color = "green"
          break;
        case 2:
          color = "blue"
          break;
        default:
          color = "black"
      }

      layers.push({
        "color": color,
        "paths": paths
      })
    }

    return layers;
  }

  sphereCircles() {

    let PathHelp = new PathHelper;
    let layers = new Array();
    let paths = new Array();
    let path = new Array();
    let transformations;
    let rotationX, rotationY, rotationZ;

    // Create a circle
    // Since PathHelper.polygon is only in 2 dimensions a Z component must be added
    let circle = PathHelp.polygon(120, 1)
    circle.map(function(a){
      return a.push(0)
    })

    // Loop through Model points and apply transformation and projection
    let i_max = 50;
    for (let i = 0; i < i_max; i++) {

      // let shape = circle;
      let shape = circle.map(function(a){
        return [
          a[0] * (1 + 2 * i/i_max),
          a[1] * (1 + 2 * i/i_max),
          a[2] * (1 + 2 * i/i_max)
        ]
      })

      // Define Transformations for Model
      let x_rotation = (-0.0 * Math.PI)
      rotationX = [
        [1, 0, 0],
        [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
        [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
      ];

      let y_rotation = 0.05 * Math.sin(3 * i/i_max * 2 * Math.PI)
      rotationY = [
        [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
        [0, 1, 0],
        [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
      ];

      // Rotate in Z to hide pen up/down in dense line areas
      let z_rotation = -0.5 * Math.PI;
      rotationZ = [
        [Math.cos(z_rotation), -Math.sin(z_rotation), 0],
        [Math.sin(z_rotation),  Math.cos(z_rotation), 0],
        [0, 0, 1]
      ];

      path = new Array();
      transformations = [rotationZ, rotationX, rotationY]
      for (let point of shape) {
        for (let transform of transformations) {
          point = this.matrixMultiply(transform, point);
        }
        path.push(point)
      }

      paths.push(path);
    }

    // Draw Axes to help debug orientation
    /*
    let axes = this.axisPaths();
    // let path = this.transform(axes, [rotationZ], 0.5, 1)
    layers.push({
      "color": "red",
      "paths": [axes[0]]
    })
    layers.push({
      "color": "green",
      "paths": [axes[1]]
    })
    layers.push({
      "color": "blue",
      "paths": [axes[2]]
    })
    //*/

    // Draw art shapes
    layers.push({
      "color": "black",
      "paths": paths
    })

    // Transform World
    for (let l = 0; l < layers.length; l++) {
      let temp = new Array();
      for (let p = 0; p < layers[l].paths.length; p++) {

        // Define Transformations for Model
        let x_rotation = -0.375 * Math.PI
        rotationX = [
          [1, 0, 0],
          [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
          [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
        ];

        let y_rotation = 0.0 * Math.PI
        rotationY = [
          [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
          [0, 1, 0],
          [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
        ];

        let z_rotation = 0.25 * Math.PI
        rotationZ = [
          [Math.cos(z_rotation), -Math.sin(z_rotation), 0],
          [Math.sin(z_rotation),  Math.cos(z_rotation), 0],
          [0, 0, 1]
        ];

        // Transform
        temp.push(this.transform(layers[l].paths[p], [rotationZ, rotationX], 4, 8)[0])
      }
      layers[l].paths = temp
    }

    // Center to canvas
    layers[0].paths = PathHelp.centerPaths(layers[0].paths)

    return layers;
  }

  spikeBall() {

    let PathHelp = new PathHelper;
    let layers = new Array();

    // Define Model(s)
    let shapes = new Array();
    let sides = 96;
    let revolutions = 32;
    let radius = 2;
    for (let a = 0; a < revolutions; a++) {
      let shape = new Array();
      for (let i = 0; i < sides; i++) {
        let y = PathHelp.map(a*sides + i, 0, revolutions*sides, -radius, radius)
        let theta_2 = Math.asin(y/radius)
        let x = radius * Math.sin(theta_2 + Math.PI/2) * Math.cos(i/sides * 2 * Math.PI)
        let z = radius * Math.sin(theta_2 + Math.PI/2) * Math.sin(i/sides * 2 * Math.PI)
        if (((a * sides) + i) % 11 == 0) {

          shapes.push([
            // [0,0,0],
            [
              x/3, y/3, z/3
            ],
            [x,y,z]
          ]);
        }
      }
    }

    // Define Transformations
    const x_rotation = (2/16) * (2 * Math.PI)
    const rotationX = [
      [1, 0, 0],
      [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
      [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
    ];

    const y_rotation = (0/16) * (2 * Math.PI)
    const rotationY = [
      [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
      [0, 1, 0],
      [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
    ];

    const z_rotation = (0/16) * (2 * Math.PI)
    const rotationZ = [
      [Math.cos(z_rotation), -Math.sin(z_rotation), 0],
      [Math.sin(z_rotation),  Math.cos(z_rotation), 0],
      [0, 0, 1]
    ];

    // Loop through Model points and apply transformation and projection
    for (let h = 0; h < shapes.length; h++) {
      let paths = this.transform(shapes[h], [rotationY, rotationX], 6, 12)
      layers.push({
        "color": "black",
        "paths": paths
      })
    }

    return layers;
  }

  noisePlane(p5) {

    let PathHelp = new PathHelper;
    let layers = new Array();

    // Define Model(s)
    let shapes = new Array();
    let gridSize = 50;
    let noiseInScale = 10; // 10
    let noiseOutScale = 0.5; // 0.5
    let side_length = 4
    for (let x = 0; x < gridSize; x++) {
      let shape = new Array();
      for (let z = 0; z < gridSize; z++) {
        let y = noiseOutScale * p5.noise(noiseInScale * x/gridSize, noiseInScale * z/gridSize)
        shape.push([
          PathHelp.map(x, 0, gridSize, -side_length, side_length),
          y,
          PathHelp.map(z, 0, gridSize, -side_length, side_length)
        ])
      }
      shapes.push(shape);
    }

    for (let z = 0; z < gridSize; z++) {
      let shape = new Array();
      for (let x = 0; x < gridSize; x++) {
        let y = noiseOutScale * p5.noise(noiseInScale * x/gridSize, noiseInScale * z/gridSize)
        shape.push([
          PathHelp.map(x, 0, gridSize, -side_length, side_length),
          y,
          PathHelp.map(z, 0, gridSize, -side_length, side_length)
        ])
      }
      shapes.push(shape);
    }

    console.log(shapes);

    // Define Transformations
    const x_rotation = 0.05 * (2 * Math.PI)
    const rotationX = [
      [1, 0, 0],
      [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
      [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
    ];

    const y_rotation = (2/16) * (2 * Math.PI)
    const rotationY = [
      [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
      [0, 1, 0],
      [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
    ];

    // Loop through Model points and apply transformation and projection
    for (let h = 0; h < shapes.length; h++) {

      // Perspective
      let paths = this.transform(shapes[h], [rotationY, rotationX], 4, 12)

      // Orthographic
      // let paths = this.transform(shapes[h], [rotationY, rotationX], 0.5, 1)

      layers.push({
        "color": "black",
        "paths": paths
      })
    }

    return layers;
  }

  geoData() {

    let Iso = new Isolines();
    let geoData = Iso.getData();
    let geoDataMin = Iso.getDataMin(geoData)
    let geoDataMax = Iso.getDataMax(geoData)

    let PathHelp = new PathHelper;
    let layers = new Array();

    // Define Model(s)
    let shapes = new Array();
    let x_max = geoData[0].length;
    let z_max = geoData.length;

    // Note: This may be mirrored along the x or z axis

    let grid_unit = 4
    for (let x = 0; x < x_max; x++) {
      let shape = new Array();
      for (let z = 0; z < z_max; z++) {
        let y = 0;
        shape.push([
          PathHelp.map(x, 0, x_max, -grid_unit, grid_unit),
          PathHelp.map(-geoData[x][z], geoDataMin, geoDataMax, 0, 0.5),
          PathHelp.map(z, 0, z_max, -grid_unit, grid_unit)
        ])
      }
      shapes.push(shape);
    }

    for (let z = 0; z < z_max; z++) {
      let shape = new Array();
      for (let x = 0; x < x_max; x++) {
        let y = 0;
        shape.push([
          PathHelp.map(x, 0, x_max, -grid_unit, grid_unit),
          PathHelp.map(-geoData[x][z], geoDataMin, geoDataMax, 0, 0.5),
          PathHelp.map(z, 0, z_max, -grid_unit, grid_unit)
        ])
      }
      shapes.push(shape);
    }

    // Define Transformations
    const x_rotation = .09 * (2 * Math.PI)
    const rotationX = [
      [1, 0, 0],
      [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
      [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
    ];

    const y_rotation = (3/8) * (2 * Math.PI)
    const rotationY = [
      [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
      [0, 1, 0],
      [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
    ];

    // Loop through Model points and apply transformation and projection
    for (let h = 0; h < shapes.length; h++) {

      // Perspective
      let paths = this.transform(shapes[h], [rotationY, rotationX], 4, 14)

      // Orthographic
      // let paths = this.transform(shapes[h], [rotationY, rotationX], 0.5, 1)

      layers.push({
        "color": "black",
        "paths": paths
      })
    }

    return layers;
  }

  grandPrix() {

    let Iso = new Isolines();

    // Load Geo Data
    let geoData = f1.track.terrain.elevations

    let lat_min = f1.track.terrain.bbox[1] // y
    let lat_max = f1.track.terrain.bbox[3]
    let long_min = f1.track.terrain.bbox[0] // x
    let long_max = f1.track.terrain.bbox[2]

    let geoDataMin = Iso.getDataMin(geoData)
    let geoDataMax = Iso.getDataMax(geoData)

    let PathHelp = new PathHelper;
    let layers = new Array();

    // Define Model(s)
    let shapes = new Array();
    let shapes_belowsealevel = new Array();
    let x_max = geoData[0].length;
    let y_max = geoData.length;

    // Note: This may be mirrored along the x or z axis

    let grid_unit = 5

    let elevation_scale = 1.5
    let scale = 5; // 5
    let distance = 12;
    let crop = 6;

    // Vertical Lines of constant Longitude
    //*
    for (let x = 0 + crop; x < x_max - crop; x+=1) {
      let shape = new Array();
      let shape_below_sealevel = new Array();
      for (let y = 0 + crop; y < y_max - crop; y+=1) {

        let px = PathHelp.map(x, 0, x_max, -grid_unit, grid_unit)
        let py = PathHelp.map(y, 0, y_max, -grid_unit, grid_unit)
        let pz = PathHelp.map(geoData[y][x], geoDataMin, geoDataMax, 0, elevation_scale)

        // Trim to circle
        // if (Math.abs(py) > Math.abs(0.75 * grid_unit * Math.sin(Math.atan2(py,px)))) {
        if (Math.abs(py) > Math.abs((y_max - 2 * crop)/(y_max-1) * grid_unit * Math.sin(Math.atan2(py,px)))) {
          continue;
        }

        if (geoData[y][x] < 0) {

          // Below Sea Levl

          // Previous point above sea level (ASL)
          if (geoData[y-1][x] >= 0) {
            // Add last point of above sea level points to prevent drawing gaps
            shape_below_sealevel = shape_below_sealevel.concat(shape.slice(-1))

            // Close above-sea-level path
            shapes.push(shape)
            shape = new Array();
          }

          shape_below_sealevel.push([px, py, pz])
        } else {

          // Above Sea Level

          // Previous point below sea level (BSL)
          if (geoData[y-1][x] <= 0) {
            // Add last point of BSL points to prevent drawing gaps
            shape = shape.concat(shape_below_sealevel.slice(-1))

            // Close BSL path
            shapes_belowsealevel.push(shape_below_sealevel)
            shape_below_sealevel = new Array();
          }

          shape.push([px, py, pz])
        }
      }
      shapes.push(shape);
      shapes_belowsealevel.push(shape_below_sealevel)
    }

    //*/

    // Horizontal Lines of constant Latitude
    //*
    for (let y = 0 + crop; y < y_max - crop; y+=1) {
      let shape = new Array();
      let shape_below_sealevel = new Array();
      for (let x = 0 + crop; x < x_max - crop; x+=1) {

        let px = PathHelp.map(x, 0, x_max, -grid_unit, grid_unit)
        let py = PathHelp.map(y, 0, y_max, -grid_unit, grid_unit)
        let pz = PathHelp.map(geoData[y][x], geoDataMin, geoDataMax, 0, elevation_scale)

        // Trim to circle
        if (Math.abs(px) > Math.abs((x_max - 2 * crop)/(x_max-1) * grid_unit * Math.cos(Math.atan2(py,px)))) {
          continue;
        }

        if (geoData[y][x] < 0) {

          // Below Sea Levl

          // Previous point above sea level (ASL)
          if (geoData[y][x-1] >= 0) {
            // Add last point of above sea level points to prevent drawing gaps
            shape_below_sealevel = shape_below_sealevel.concat(shape.slice(-1))

            // Close above-sea-level path
            shapes.push(shape)
            shape = new Array();
          }

          shape_below_sealevel.push([px, py, pz])
        } else {

          // Above Sea Levl

          // Previous point below sea level (BSL)
          if (geoData[y][x-1] <= 0) {
            // Add last point of BSL points to prevent drawing gaps
            shape = shape.concat(shape_below_sealevel.slice(-1))

            // Close BSL path
            shapes_belowsealevel.push(shape_below_sealevel)
            shape_below_sealevel = new Array();
          }

          shape.push([px, py, pz])
        }
      }
      shapes.push(shape);
      shapes_belowsealevel.push(shape_below_sealevel)
    }
    //*/

    // Define Transformations
    const x_rotation = (-2.5/16) * (2 * Math.PI) // -2.5
    const rotationX = [
      [1, 0, 0],
      [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
      [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
    ];

    const y_rotation = (0/16) * (2 * Math.PI) // 3/8
    const rotationY = [
      [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
      [0, 1, 0],
      [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
    ];

    const z_rotation = (1/16) * (2 * Math.PI) // -1/16
    const rotationZ = [
      [Math.cos(z_rotation), -Math.sin(z_rotation), 0],
      [Math.sin(z_rotation),  Math.cos(z_rotation), 0],
      [0, 0, 1]
    ];

    // Loop through Model points and apply transformation and projection
    let paths = new Array();
    for (let h = 0; h < shapes.length; h++) {

      if (shapes[h].length == 0){
        continue;
      }

      // Perspective
      paths = paths.concat(this.transform(shapes[h], [rotationZ, rotationY, rotationX], scale, distance));

      // Orthographic
      // paths = paths.concat(this.transform(shapes[h], [rotationZ, rotationY, rotationX], 0.5, 1));
    }
    layers.push({
      "color": "green",
      "paths": paths
    })

    paths = new Array();
    for (let h = 0; h < shapes_belowsealevel.length; h++) {
      if (shapes_belowsealevel[h].length == 0){
        continue;
      }
      paths = paths.concat(this.transform(shapes_belowsealevel[h], [rotationZ, rotationY, rotationX], scale, distance));
    }
    layers.push({
      "color": "blue",
      "paths": paths
    })


    //////// TRACK

    shapes = new Array();
    let shape = new Array();

    // Extract Track coordinates to a polyline
    let path = new Array();
    for (let coordinate of f1.track.track.features[0].geometry.coordinates) {
      let x = PathHelp.map(
        PathHelp.map(coordinate[0], long_min, long_max, 0, x_max),
        0, x_max, -grid_unit, grid_unit
      );

      let y = PathHelp.map(
        PathHelp.map(coordinate[1], lat_min, lat_max, 0, y_max),
        0, y_max, grid_unit, -grid_unit
      )
      path.push([x,y])
    }

    // Expand single path to parallel paths
    let parallel_paths = new Array();
    parallel_paths.push(path);
    parallel_paths = parallel_paths.concat(PathHelp.expandPath(path, 0.025, 0.025, 'open'));
    // parallel_paths = parallel_paths.concat(PathHelp.expandPath(path, 0.05, 0.05, 'open'));

    for (let i = 0; i < parallel_paths.length; i++) {
      shape = new Array();
      for (let point of parallel_paths[i]) {
        // Interpolate Z value from terrain
        let coordinate_x = PathHelp.map(point[0], -grid_unit, grid_unit, 0, x_max)
        let nearest_x_min = Math.floor(coordinate_x)
        let nearest_x_max = Math.ceil(coordinate_x)

        let coordinate_y = PathHelp.map(point[1], -grid_unit, grid_unit, 0, x_max)
        let nearest_y_min = Math.floor(coordinate_y)
        let nearest_y_max = Math.ceil(coordinate_y)

        // Nearest Neighbor
        // let z = PathHelp.map(geoData[nearest_y_min][nearest_x_min], geoDataMin, geoDataMax, 0, elevation_scale)

        // Bilinear interpolation
        let interpolated_elevation = PathHelp.map(
          coordinate_y,
          nearest_y_min,
          nearest_y_max,
          PathHelp.map(coordinate_x, nearest_x_min, nearest_x_max, geoData[nearest_y_min][nearest_x_min], geoData[nearest_y_min][nearest_x_max]),
          PathHelp.map(coordinate_x, nearest_x_min, nearest_x_max, geoData[nearest_y_max][nearest_x_min], geoData[nearest_y_max][nearest_x_max])
        )
        let z = PathHelp.map(interpolated_elevation, geoDataMin, geoDataMax, 0, elevation_scale)

        shape.push([point[0],point[1],z])
      }
      shapes.push(shape);
    }

    // Loop through Model points and apply transformation and projection
    paths = new Array();
    for (let h = 0; h < shapes.length; h++) {

      // Perspective
      paths = paths.concat(this.transform(shapes[h], [rotationZ, rotationY, rotationX], scale, distance))

      // Orthographic
      // paths = paths.concat(this.transform(shapes[h], [rotationY, rotationX, rotationZ], 0.5, 1))
    }
    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }

  geoIsolines(p5) {

    // Get Geo Elevation Isolines from other class
    let Iso = new Isolines();

    let isoline_layers = Iso.drawIsolines(p5)
    // console.log(isoline_layers)

    let PathHelp = new PathHelper();

    let layers = new Array();

    // Note: This may be mirrored along the x or z axis
    let shapes = new Array();
    for (let a = 0; a < isoline_layers.length; a++) {
      let layer = isoline_layers[a];
      let paths = layer.paths
      for (let b = 0; b < paths.length; b++) {
        let path = paths[b];
        let shape = new Array()
        for (let c = 0; c < path.length; c++) {
          let point = path[c]
          shape.push([
            point[0],
            PathHelp.map(-a, 0, isoline_layers.length, 0, 0.2),
            // -b * 0.005,
            point[1],
          ])
        }
        shapes.push(shape);
      }
    }

    // Define Transformations
    const x_rotation = (2/32) * (2 * Math.PI)
    const rotationX = [
      [1, 0, 0],
      [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
      [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
    ];

    const y_rotation = (2/16) * (2 * Math.PI)
    const rotationY = [
      [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
      [0, 1, 0],
      [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
    ];

    // Loop through Model points and apply transformation and projection
    for (let h = 0; h < shapes.length; h++) {

      // Perspective
      let paths = this.transform(shapes[h], [rotationY, rotationX], 14, 12)

      // Orthographic
      // let paths = this.transform(shapes[h], [rotationY, rotationX], 0.5, 1)

      layers.push({
        "color": "black",
        "paths": paths
      })
    }

    return layers;
  }

  attractor() {

    let PathHelp = new PathHelper;
    let layers = new Array();
    let paths = new Array();
    let path = new Array();

    // Perspective
    let distance = 4;
    let scale = 6;


    // --- TRANSFORMATIONS

    // Define Transformations
    const x_rotation = (-3/16) * (2 * Math.PI)
    const rotationX = [
      [1, 0, 0],
      [0,  Math.cos(x_rotation), Math.sin(x_rotation)],
      [0, -Math.sin(x_rotation), Math.cos(x_rotation)]
    ];

    const y_rotation = (4/32) * (2 * Math.PI)
    const rotationY = [
      [ Math.cos(y_rotation), 0, Math.sin(y_rotation)],
      [0, 1, 0],
      [-Math.sin(y_rotation), 0, Math.cos(y_rotation)]
    ];

    const z_rotation = (0/16) * (2 * Math.PI)
    const rotationZ = [
      [Math.cos(z_rotation), -Math.sin(z_rotation), 0],
      [Math.sin(z_rotation),  Math.cos(z_rotation), 0],
      [0, 0, 1]
    ];


    // --- CUBE

    /*

    // Define 3D shape (cube) (x,y,z)
    let points = [
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5]
    ];

    // Connect points to create paths (edges)
    let shapes = new Array();
    for (let i = 0; i < 4; i++) {
      shapes.push(
        new Array(
          points[i],
          points[(i + 1) % 4]
        )
      );
      shapes.push(
        new Array(
          points[i + 4],
          points[((i + 1) % 4) + 4],
        )
      );
      shapes.push(
        new Array(
          points[i],
          points[i + 4]
        )
      );
    }

    // Loop through Model points and apply transformation and projection
    paths = new Array();
    for (let h = 0; h < shapes.length; h++) {
      paths = paths.concat(this.transform(shapes[h], [rotationZ, rotationY, rotationX], scale, distance));
    }

    layers.push({
      "color": "black",
      "paths": paths
    })

    //*/


    // --- ATTRACTOR

    // Attractor
    path = this.lorenzAttractor(10000);
    paths = this.transform(path, [rotationZ, rotationY, rotationX], scale, distance)

    // Split path into sub-paths to plot with different colors
    let subpath = new Array();
    let red_paths = new Array();
    let blue_paths = new Array();
    let subpath_length = 100;
    for (let i = 0; i < paths[0].length; i++) {

      subpath.push(paths[0][i]);

      // Create new sub-path every 100 points
      if (i % subpath_length == 0) {

        if ( (i / subpath_length) % 2 == 1 ) {
          red_paths.push(subpath)
        } else {
          blue_paths.push(subpath)
        }

        // Clear subpath and start it with the last point of the previous subpath
        let last_point = subpath.slice(-1)
        subpath = new Array();
        subpath = subpath.concat(last_point);
      }
    }

    layers.push({
      "color": "red",
      "paths": red_paths
    })

    layers.push({
      "color": "blue",
      "paths": blue_paths
    })

    return layers;
  }

  /**
   * Lorenz Attractor
   * https://en.wikipedia.org/wiki/Lorenz_system
   * Implementation inspiredhttps://thecodingtrain.com/CodingChallenges/012-lorenzattractor.html
   * - https://github.com/CodingTrain/website/blob/main/CodingChallenges/CC_012_LorenzAttractor/P5/sketch.js
   */
  lorenzAttractor(iterations) {

    // Scale factor to apply to the output
    let scale = 0.02;

    // Sigma
    let a = 10;

    // Rho
    let b = 28;

    // Beta
    let c = 8.0/3.0

    // Initial positions
    let x = 0.01;
    let y = 0.0;
    let z = 0.0;

    // Time step
    let dt = 0.005

    // Derivatives for x, y, z
    let dx, dy, dz;

    let points = new Array();

    for (let i = 0; i < iterations; i++) {

      // Calculate derivatives
      dx = a * (y - x) * dt;
      dy = (x * (b - z) - y) * dt;
      dz = (x * y - c * z) * dt;

      // Add derivatives to positions
      x = x + dx;
      y = y + dy;
      z = z + dz;

      // Add the point an array of points
      points.push([
        scale * x,
        scale * y,
        scale * z
      ])
    }

    return points;
  }

  axisPaths() {
    return [
      [
        [0,0,0],
        [1,0,0]
      ],
      [
        [0,0,0],
        [0,1,0]
      ],
      [
        [0,0,0],
        [0,0,1]
      ]
    ]
  }

  transform(points, transforms, scale = 1, distance = 1) {

    let paths = new Array();
    let path = new Array();
    let z;
    for (let i = 0; i < points.length; i++) {

      // Convert 2D (x,y) points to 3D in the z=0 plane
      if (points[i].length == 2) {
        points[i].push(0)
      }

      // Apply transformation(s)
      let world = points[i]
      for (let transform of transforms) {
        world = this.matrixMultiply(transform, world);
      }

      // Set projection matrix
      z = distance;
      if (distance > 1) {
        z = 1 / (distance - world[2]);
      }
      let projection = [
        [z, 0, 0],
        [0, z, 0]
      ];

      // Project model onto 2D surface
      let projected2d = this.matrixMultiply(projection, world);

      // Scale
      if (scale !== 1) {
        projected2d = this.matrixMultiply(projected2d, scale)
      }

      // Push point to path
      path.push([
        projected2d[0], projected2d[1]
      ])
    }

    // Add path to Paths
    paths.push(path);

    return paths;
  }

  /**
   * This is a better name for this function, but
   * I want the previously written code to work as well.
   */
  project3D(points, transforms, scale = 1, distance = 1) {
    return this.transform(points, transforms, scale, distance)
  }

  translatePoints3D(points, translation) {
    for (let i = 0; i < points.length; i++) {

      // A 4th point is required for the matrix multiplication
      points[i] = points[i].concat(1)

      points[i] = this.matrixMultiply(
        [
          [1,0,0, translation[0]],
          [0,1,0, translation[1]],
          [0,0,1, translation[2]],
          [0,0,0, 1]
        ],
        points[i]
      );

      // Remove 4th point
      points[i].pop();
    }
    return points
  }

  rotateX(angle) {
    return [
      [1, 0, 0],
      [0,  Math.cos(angle), Math.sin(angle)],
      [0, -Math.sin(angle), Math.cos(angle)]
    ];
  }

  rotateY(angle) {
    return [
      [ Math.cos(angle), 0, Math.sin(angle)],
      [0, 1, 0],
      [-Math.sin(angle), 0, Math.cos(angle)]
    ]
  }

  rotateZ(angle) {
    return [
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle),  Math.cos(angle), 0],
      [0, 0, 1]
    ]
  }

  rotatePoints3dX(points, angle) {
    for (let i = 0; i < points.length; i++) {
      points[i] = this.matrixMultiply(
        this.rotateX(angle),
        points[i]
      );
    }
    return points;
  }

  rotatePoints3dY(points, angle) {
    for (let i = 0; i < points.length; i++) {
      points[i] = this.matrixMultiply(
        this.rotateY(angle),
        points[i]
      );
    }
    return points;
  }

  rotatePoints3dZ(points, angle) {
    for (let i = 0; i < points.length; i++) {
      points[i] = this.matrixMultiply(
        this.rotateZ(angle),
        points[i]
      );
    }
    return points;
  }

  /**
   * Multiply two matrices
   * @param Array Input Matrix
   * @param Array Input Matrix
   * @return Array
   */
  matrixMultiply(a, b) {
    let result = new Array(b.length)
    for (let i = 0; i < a.length; i++) {
      if (Array.isArray(b)) {
        result[i] = this.dotProduct(a[i], b)
      } else {
        result[i] = a[i] * b
      }
    }
    return result;
  }

  /**
   * Perform the dot product between two matrices
   * @param Array Input Matrix
   * @param Array Input Matrix
   * @return Integer Scalar dot product
   */
  dotProduct(a, b) {
    let dot_product = 0;
    for (let i = 0; i < a.length; i++) {
      dot_product += a[i] * b[i]
    }
    return dot_product;
  }

}