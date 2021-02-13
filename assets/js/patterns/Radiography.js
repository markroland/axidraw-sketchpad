class Radiography {

  draw() {
    return this.draw1();
  }

  draw1() {

    let PathHelp = new PathHelper;

    // Create paths array to return
    let paths = new Array();

    for (let i = 0; i < 5; i++) {
      let start = PathHelp.getRandom(0, 1);
      let end = start + PathHelp.getRandom(-0.9, 0.9)
      let inner = PathHelp.getRandom(0.1, 0.9)
      let outer = inner + PathHelp.getRandom(0, (1-inner))
      paths.push(
        this.drawArc(start, end, inner, outer)
      );
    }

    return paths;
  }

  drawArc(start, stop, innerRadius, outerRadius) {

    let shape = new Array();

    for (let i = 0; i < 60; i++) {
      shape.push([
        innerRadius * Math.cos( (stop - start) * (i/60) * (Math.PI * 2) + start),
        innerRadius * Math.sin( (stop - start) * (i/60) * (Math.PI * 2) + start)
      ])
    }

    // Note: Go opposite direction
    for (let i = 59; i >= 0; i--) {
      shape.push([
        outerRadius * Math.cos( (stop - start) * (i/60) * (Math.PI * 2) + start),
        outerRadius * Math.sin( (stop - start) * (i/60) * (Math.PI * 2) + start)
      ])
    }

    // Close shape
    shape.push(shape[0])

    return shape;
  }

}