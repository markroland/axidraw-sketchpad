/**
 * Geo JSON
 */
class GeoJSON {

  constructor() {

    this.key = "geojson";

    this.name = "GeoJSON";

    this.constrain = false

    this.title = "Bahrain Grand Prix Circuit"
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
    let geoPath = this.getGeoData();

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

  getGeoData() {

    // Bahrain Grand Prix data from https://github.com/bacinger/f1-circuits/blob/master/circuits/bh-2002.geojson
    return {
      "bbox": [
        50.510278,
        26.026086,
        50.518387,
        26.036885
      ],
      "features": [
        {
          "bbox": [
            50.510278,
            26.026086,
            50.518387,
            26.036885
          ],
          "geometry": {
            "coordinates": [
              [
                50.510539,
                26.031766
              ],
              [
                50.510633,
                26.034797
              ],
              [
                50.510722,
                26.036782
              ],
              [
                50.510764,
                26.036871
              ],
              [
                50.510852,
                26.036885
              ],
              [
                50.510947,
                26.036862
              ],
              [
                50.511018,
                26.036815
              ],
              [
                50.511474,
                26.0364
              ],
              [
                50.511598,
                26.036358
              ],
              [
                50.511734,
                26.036367
              ],
              [
                50.512527,
                26.036598
              ],
              [
                50.512717,
                26.036617
              ],
              [
                50.512889,
                26.036607
              ],
              [
                50.518091,
                26.035702
              ],
              [
                50.518269,
                26.035655
              ],
              [
                50.518364,
                26.035566
              ],
              [
                50.518387,
                26.035452
              ],
              [
                50.518369,
                26.035344
              ],
              [
                50.51831,
                26.035222
              ],
              [
                50.518198,
                26.035099
              ],
              [
                50.518068,
                26.035
              ],
              [
                50.51789,
                26.034877
              ],
              [
                50.517263,
                26.034458
              ],
              [
                50.516759,
                26.033987
              ],
              [
                50.516635,
                26.033878
              ],
              [
                50.516535,
                26.033723
              ],
              [
                50.51631,
                26.033265
              ],
              [
                50.516233,
                26.033166
              ],
              [
                50.516114,
                26.033096
              ],
              [
                50.515996,
                26.033039
              ],
              [
                50.515807,
                26.03302
              ],
              [
                50.515238,
                26.033105
              ],
              [
                50.515084,
                26.0331
              ],
              [
                50.514925,
                26.033072
              ],
              [
                50.514794,
                26.033011
              ],
              [
                50.514635,
                26.032879
              ],
              [
                50.51348,
                26.031564
              ],
              [
                50.513368,
                26.031474
              ],
              [
                50.513208,
                26.031451
              ],
              [
                50.513108,
                26.031521
              ],
              [
                50.513072,
                26.031663
              ],
              [
                50.513078,
                26.031879
              ],
              [
                50.513356,
                26.033369
              ],
              [
                50.513516,
                26.034302
              ],
              [
                50.51354,
                26.034486
              ],
              [
                50.51351,
                26.034656
              ],
              [
                50.513469,
                26.034783
              ],
              [
                50.513386,
                26.03491
              ],
              [
                50.512912,
                26.035278
              ],
              [
                50.512847,
                26.035306
              ],
              [
                50.512776,
                26.035288
              ],
              [
                50.512735,
                26.035222
              ],
              [
                50.512563,
                26.034071
              ],
              [
                50.512516,
                26.033303
              ],
              [
                50.512433,
                26.031922
              ],
              [
                50.512374,
                26.030479
              ],
              [
                50.512314,
                26.029164
              ],
              [
                50.512338,
                26.028948
              ],
              [
                50.512433,
                26.02882
              ],
              [
                50.512581,
                26.02875
              ],
              [
                50.512788,
                26.028712
              ],
              [
                50.513001,
                26.028726
              ],
              [
                50.513267,
                26.028773
              ],
              [
                50.51354,
                26.028891
              ],
              [
                50.51377,
                26.029037
              ],
              [
                50.513995,
                26.029244
              ],
              [
                50.514132,
                26.029447
              ],
              [
                50.514386,
                26.030041
              ],
              [
                50.514528,
                26.030291
              ],
              [
                50.514664,
                26.030437
              ],
              [
                50.514842,
                26.030569
              ],
              [
                50.515055,
                26.030687
              ],
              [
                50.515351,
                26.030753
              ],
              [
                50.515676,
                26.030758
              ],
              [
                50.515907,
                26.03071
              ],
              [
                50.516215,
                26.030578
              ],
              [
                50.517026,
                26.030216
              ],
              [
                50.517192,
                26.030107
              ],
              [
                50.517334,
                26.02998
              ],
              [
                50.517405,
                26.029862
              ],
              [
                50.517493,
                26.02973
              ],
              [
                50.517493,
                26.029612
              ],
              [
                50.517422,
                26.02949
              ],
              [
                50.51728,
                26.029367
              ],
              [
                50.517085,
                26.029235
              ],
              [
                50.510941,
                26.026143
              ],
              [
                50.510829,
                26.026091
              ],
              [
                50.510651,
                26.026086
              ],
              [
                50.510574,
                26.026152
              ],
              [
                50.510302,
                26.026671
              ],
              [
                50.510278,
                26.026878
              ],
              [
                50.510284,
                26.027269
              ],
              [
                50.510361,
                26.029414
              ],
              [
                50.510539,
                26.031766
              ]
            ],
            "type": "LineString"
          },
          "properties": {
            "Location": "Sakhir",
            "Name": "Bahrain International Circuit",
            "altitude": -16,
            "firstgp": 2004,
            "id": "bh-2002",
            "length": 5412,
            "opened": 2002
          },
          "type": "Feature"
        }
      ],
      "name": "bh-2002",
      "type": "FeatureCollection"
    }
  }

}