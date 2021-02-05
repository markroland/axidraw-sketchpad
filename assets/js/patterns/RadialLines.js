class RadialLines {

  draw() {

    // Create paths array to return
    let paths = new Array();

    let num_lines = 8 * 20;

    let inner_radius = 0.125;
    let outter_radius = 2.0;

    let num_rings = 4;

    let radius_increment = (1 - inner_radius) / num_rings;

    let radius = 0;

    for (let i = 0; i < num_lines; i++) {

        if (i % 8 == 0) {
            radius = inner_radius + 0 * radius_increment;
        } else if (i % 4 == 0) {
            radius = inner_radius + 1 * radius_increment;
        } else if (i % 2 == 0) {
            radius = inner_radius + 2 * radius_increment;
        } else {
            radius = inner_radius + 3 * radius_increment;
        }

        paths.push([
            [
                radius * Math.cos(i/num_lines * Math.PI * 2),
                radius * Math.sin(i/num_lines * Math.PI * 2)
            ],
            [
                outter_radius * Math.cos(i/num_lines * Math.PI * 2),
                outter_radius * Math.sin(i/num_lines * Math.PI * 2)
            ]
        ]);
    }

    return paths;
  }

}