class Radiography {

  constructor() {
    this.key = "radiography";
    this.name = "Radiography";
    this.title = "Radial Design Study"
    this.constrain = false
  }

  draw() {
    // return this.draw1();
    return this.draw3D();
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

  draw3D() {

    let PathHelp = new PathHelper;

    let ThreeDimensions = new ThreeD();

    let layers = new Array();

    let paths = new Array();
    let paths3D = new Array();

    // Create design
    let paths2D = this.draw1();

    // Define how the 3D world will be transformed
    let worldTransformations = new Array();
    const rotateWorldX = ThreeDimensions.rotateX(-(6/32) * (2 * Math.PI));
    const rotateWorldY = ThreeDimensions.rotateY((5/32) * (2 * Math.PI));;
    const rotateWorldZ = ThreeDimensions.rotateZ((2/16) * (2 * Math.PI));;
    // worldTransformations = [rotateWorldY, rotateWorldX]
    worldTransformations = [rotateWorldX]

    // Loop through paths and convert to 3D
    let i_max = paths2D.length;
    for (let i = 0; i < i_max; i++) {

      // Add a 3rd "Z" dimension to each point in the path
      paths2D[i].map(function(a){
        return a.push(
          // PathHelp.map(i, 0, i_max, -0.1, 0.1)
          0
        )
      })

      let path_3D = ThreeDimensions.project3D(paths2D[i], worldTransformations, 2, 2)[0]
      paths3D.push(path_3D)
    }

    // 2D Version
    //*
    layers.push({
      "color": "cyan",
      "paths": paths2D
    })
    //*/

    layers.push({
      "color": "black",
      "paths": paths3D
    })

    return layers;
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