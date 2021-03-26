/**
 * Cassini Oval
 *
 * https://mse.redwoods.edu/darnold/math50c/CalcProj/sp07/ken/CalcPres.pdf
 */
class CassiniOval {

  constructor() {

    this.key = "cassinioval";

    this.name = "Cassini Oval";

    this.constrain = false
  }

  /**
   * Draw path
   */
  draw(p5) {

    let PathHelp = new PathHelper;

    let layers = new Array();

    let paths = new Array();

    let path = new Array();

    let segments = 240;

    let n = 2
    let r

    // a > 1
    for (let a = 1.1; a < 5; a += 0.5) {

      path = Array();

      for (let i = 0; i <= segments; i++) {
        let theta = (i/segments) * Math.PI * 2

        // Cassini Oval
        // https://www.2dcurves.com/higher/highercc.html
        // https://mathworld.wolfram.com/CassiniOvals.html
        r = Math.pow(
          Math.cos(n * theta) + Math.sqrt(a - Math.pow(Math.sin(n * theta),2)),
          1/n
        );

        // Scale down
        // r = r * 0.5

        let coordinates = PathHelp.polarToRect(r, theta);

        path.push(coordinates)
      }

      paths.push(path)
    }

    // a = 1
    let a = 1;
    path = Array();
    for (let i = -0.5 * segments; i <= 0.5 * segments; i++) {

      let theta = (i/(0.5 * segments)) * 0.5 * Math.asin(Math.pow(a,2))

      // Cassini Oval
      // https://www.2dcurves.com/higher/highercc.html
      // https://mathworld.wolfram.com/CassiniOvals.html
      r = Math.pow(
        Math.cos(n * theta) + Math.sqrt(a - Math.pow(Math.sin(n * theta),2)),
        1/n
      );
      // r = r * 0.5
      let coordinates = PathHelp.polarToRect(r, theta);
      path.push(coordinates)
    }
    paths.push(path)

    path = Array();
    for (let i = -0.5 * segments; i <= 0.5 * segments; i++) {

      let theta = (i/(0.5 * segments)) * 0.5 * Math.asin(Math.pow(a,2))

      // Cassini Oval
      // https://www.2dcurves.com/higher/highercc.html
      // https://mathworld.wolfram.com/CassiniOvals.html
      r = - Math.pow(
        Math.cos(n * theta) + Math.sqrt(a - Math.pow(Math.sin(n * theta),2)),
        1/n
      );
      // r = r * 0.5
      let coordinates = PathHelp.polarToRect(r, theta);
      path.push(coordinates)
    }
    paths.push(path)


    // a < 1
    //*
    for (let a = 0.1; a < 1.0; a += 0.5) {
      path = Array();
      for (let i = -0.5 * segments; i <= 0.5 * segments; i++) {
        let theta = (i/(0.5 * segments)) * 0.5 * Math.asin(Math.pow(a,2))
        r = + Math.pow(
          Math.cos(n * theta) + Math.sqrt(a - Math.pow(Math.sin(n * theta),2)),
          1/n
        );
        // r = r * 0.5
        let coordinates = PathHelp.polarToRect(r, theta);
        path.push(coordinates)
      }
      paths.push(path)
    }
    for (let a = 0.1; a < 1.0; a += 0.5) {
      path = Array();
      for (let i = -0.5 * segments; i <= 0.5 * segments; i++) {
        let theta = (i/(0.5 * segments)) * 0.5 * Math.asin(Math.pow(a,2))
        r = + Math.pow(
          Math.cos(n * theta) - Math.sqrt(a - Math.pow(Math.sin(n * theta),2)),
          1/n
        );
        // r = r * 0.5
        let coordinates = PathHelp.polarToRect(r, theta);
        path.push(coordinates)
      }
      paths.push(path)
    }
    for (let a = 0.1; a < 1.0; a += 0.5) {
      path = Array();
      for (let i = -0.5 * segments; i <= 0.5 * segments; i++) {
        let theta = (i/(0.5 * segments)) * 0.5 * Math.asin(Math.pow(a,2))
        r = - Math.pow(
          Math.cos(n * theta) - Math.sqrt(a - Math.pow(Math.sin(n * theta),2)),
          1/n
        );
        // r = r * 0.5
        let coordinates = PathHelp.polarToRect(r, theta);
        path.push(coordinates)
      }
      paths.push(path)
    }
    for (let a = 0.1; a < 1.0; a += 0.5) {
      path = Array();
      for (let i = -0.5 * segments; i <= 0.5 * segments; i++) {
        let theta = (i/(0.5 * segments)) * 0.5 * Math.asin(Math.pow(a,2))
        r = - Math.pow(
          Math.cos(n * theta) + Math.sqrt(a - Math.pow(Math.sin(n * theta),2)),
          1/n
        );
        // r = r * 0.5
        let coordinates = PathHelp.polarToRect(r, theta);
        path.push(coordinates)
      }
      paths.push(path)
    }
    //*/

    layers.push({
      "color": "black",
      "paths": paths
    })

    // console.log(layers)

    return layers;
  }

}