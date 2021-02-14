class Radiography {

  draw() {
    return this.draw1();
  }

  draw1() {

    let PathHelp = new PathHelper;

    // Create paths array to return
    let paths = new Array();

    let start = 0, end, inner, outer

    let type_1_count = PathHelp.getRndInteger(4,6)
    for (let i = 0; i < type_1_count; i++) {
      start = (start + PathHelp.getRandom(0, 1)) % 1;
      end = (start + PathHelp.getRandom(0, 0.25)) % 1;
      inner = PathHelp.getRandom(0.1, 0.9)
      outer = inner + PathHelp.getRandom(0, (1-inner))
      paths = paths.concat(
        this.drawArc2(start, end, inner, outer, PathHelp.getRndInteger(1,3))
      )
    }

    let type_2_count = PathHelp.getRndInteger(3,6)
    for (let i = 0; i < type_2_count; i++) {
      start = (start + PathHelp.getRandom(0, 1)) % 1;
      end = (start + PathHelp.getRandom(0, 0.25)) % 1;
      inner = PathHelp.getRandom(0.1, 0.9)
      outer = inner + PathHelp.getRandom(0, (1-inner)/2)
      paths.push(
        this.drawArc(start, end, inner, outer)
      );

      let circle = PathHelp.polygon(12, 0.025)
      let center_radius = (inner + (outer-inner)/2)
      paths.push(
        PathHelp.translatePath(circle,
          [
            center_radius * Math.cos((end + .008/center_radius) * Math.PI * 2),
            center_radius * Math.sin((end + .008/center_radius) * Math.PI * 2)
          ]
        )
      )
    }

    return paths;
  }

  /**
   * Draw the perimeter of an Arc
   **/
  drawArc(start, stop, innerRadius, outerRadius) {

    let shape = new Array();

    for (let i = 0; i < 60; i++) {
      shape.push([
        innerRadius * Math.cos( (start + (stop - start) * (i/60)) * (Math.PI * 2)),
        innerRadius * Math.sin( (start + (stop - start) * (i/60)) * (Math.PI * 2))
      ])
    }

    // Note: Go opposite direction
    for (let i = 59; i >= 0; i--) {
      shape.push([
        outerRadius * Math.cos( (start + (stop - start) * (i/60)) * (Math.PI * 2)),
        outerRadius * Math.sin( (start + (stop - start) * (i/60)) * (Math.PI * 2))
      ])
    }

    // Close shape
    shape.push(shape[0])

    return shape;
  }

  /**
   * Fill an arc
   **/
  drawArc2(start, stop, innerRadius, outerRadius, style) {

    let PathHelp = new PathHelper;

    let shapes = new Array();

    // Radial lines, spaced evenly
    if (style == 1) {
      let segments = Math.abs(stop - start) * PathHelp.getRndInteger(60,120)
      for (let i = 0; i < segments; i++) {
        shapes.push([[
            innerRadius * Math.cos( (stop - start) * (i/segments) * (Math.PI * 2) + start),
            innerRadius * Math.sin( (stop - start) * (i/segments) * (Math.PI * 2) + start)
          ],
          [
            outerRadius * Math.cos( (stop - start) * (i/segments) * (Math.PI * 2) + start),
            outerRadius * Math.sin( (stop - start) * (i/segments) * (Math.PI * 2) + start)
          ]
        ])
      }

      return shapes
    }

    // Radial lines, spaced increasingly
    if (style == 2) {
      let position = start;
      let velocity_0 = 0.0;
      let acceleration = 0.01;

      let segments = Math.abs(stop - start) * PathHelp.getRndInteger(60,120)

      for (let i = 0; i < segments; i++) {
        position = velocity_0 * i + 0.5 * acceleration * Math.pow(i,2);
        if (position > stop) {
          break;
        }
        shapes.push([[
            innerRadius * Math.cos(position),
            innerRadius * Math.sin(position)
          ],
          [
            outerRadius * Math.cos(position),
            outerRadius * Math.sin(position)
          ]
        ])
      }

      return shapes
    }

    // Concentric lines
    if (style == 3) {

      let segments = Math.abs(stop - start) * 120
      let rings = PathHelp.getRndInteger(5,10);
      for (let r = 0; r < rings; r++) {
        let shape = new Array();
        for (let i = 0; i < segments; i++) {
          shape.push([
            (innerRadius + (r/rings) * (outerRadius - innerRadius)) * Math.cos( (stop - start) * (i/segments) * (Math.PI * 2) + start),
            (innerRadius + (r/rings) * (outerRadius - innerRadius)) * Math.sin( (stop - start) * (i/segments) * (Math.PI * 2) + start)
          ])
        }
        shapes.push(shape)
      }

      return shapes;
    }

    return shapes;
  }

}