/**
 * 3D
 */
class ThreeD {

  constructor() {

    this.key = "3d";

    this.name = "3D";

    this.constrain = false
  }

  /**
   * Draw path
   */
  draw() {
    return this.sketch1()
  }

  sketch1() {

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
}