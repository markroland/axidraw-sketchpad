/**
 * Geo JSON
 */
class GeoJSON {

  constructor() {

    this.key = "geojson";

    this.name = "GeoJSON";

    this.constrain = false

    this.title = "GeoJSON test"
  }

  /**
   * Draw path
   */
  draw(p5) {
    return this.default()
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