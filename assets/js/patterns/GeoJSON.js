/**
 * Geo JSON
 */
class GeoJSON {

  constructor() {

    this.key = "geojson";

    this.name = "GeoJSON";

    this.constrain = false

    this.title = "Portimao Grand Prix Circuit"
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

    // Load GeoJSON data
    let geoPath = f1.track.track;

    // Extract the coordinates to a polyline
    let path = new Array();
    for (let coordinate of geoPath.features[0].geometry.coordinates) {
        path.push(coordinate)
    }

    // Flip vertically to account for p5js's inverted y-axis
    path = PathHelp.scalePath(path, [1,-1]);

    // Get path info
    let path_info = PathHelp.info(path)

    // Translate the path to the center of the canvas
    path = PathHelp.translatePath(path,
        [
            -path_info.center[0],
            -path_info.center[1]
        ]
    )

    // Re-get path info and scale to the canvas constraint (y-axis in this case)
    path_info = PathHelp.info(path)
    let scaleFactor = 1/path_info.max[1]
    path = PathHelp.scalePath(path, scaleFactor);

    // Expand/offset path to create 2 paths
    let paths2 = PathHelp.expandPath(path, 0.015, 0.015, 'open')
    paths = paths.concat(paths2)

    layers.push({
      "color": "black",
      "paths": paths
    })

    return layers;
  }
}