/**
 * General Sketchbook
 */
class Sketchbook {

  constructor() {

    this.key = "sketchbook";

    this.name = "Sketchbook";

    this.constrain = false
  }

  /**
   * Draw path
   */
  draw(p5) {
    return default()
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
}