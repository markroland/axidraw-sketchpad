class Extrusion {

  draw() {

    let paths = new Array();

    let PathHelp = new PathHelper();

    let square = PathHelp.polygon(4, 0.3, 0 *Math.PI/4);

    for (let i = 0; i <= 60; i++) {
      paths.push(
        PathHelp.translatePath(
          PathHelp.rotatePath(square, i/60 * Math.PI * 2),
          [-1.2 + 0.04 * i, 0]
        )
      );
    }

    return paths;
  }

}