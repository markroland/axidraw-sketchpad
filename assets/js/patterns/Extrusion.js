class Extrusion {

  draw() {

    let paths = new Array();

    let PathHelp = new PathHelper();

    // Triangle
    let triangle = PathHelp.polygon(3, 0.3, Math.PI/6);
    for (let i = 0; i <= 60; i++) {
      paths.push(
        PathHelp.translatePath(
          PathHelp.rotatePath(triangle, i/60 * Math.PI * 2 / 3),
          [-1.2 + 0.04 * i, -0.7]
        )
      );
    }

    // Square
    let square = PathHelp.polygon(4, 0.3, Math.PI/4);
    for (let i = 0; i <= 60; i++) {
      paths.push(
        PathHelp.translatePath(
          PathHelp.rotatePath(square, i/60 * (2 * Math.PI / 4)),
          [-1.2 + 0.04 * i, 0]
        )
      );
    }

    // Circle
    let circle = PathHelp.polygon(60, 0.3, 0);
    for (let i = 0; i <= 60; i++) {
      paths.push(
        PathHelp.translatePath(
          PathHelp.rotatePath(circle, i/60 * (2 * Math.PI / 4)),
          [-1.2 + 0.04 * i, 0.7]
        )
      );
    }

    return paths;
  }

}