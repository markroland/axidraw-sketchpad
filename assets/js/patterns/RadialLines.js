class RadialLines {

  draw() {

    // Create paths array to return
    let paths = new Array();

    let num_lines = 4 * 40;

    let inner_radius = 0.15;
    let outer_radius = 2.0;

    let radius = 0;

    for (let i = 0; i < num_lines; i++) {

      // Note: I'm sure this logic can be improved

      // A
      radius = inner_radius;

      // D
      if (i % 2 == 1) {
        radius = 8 * inner_radius;
      }

      // C
      if (i % 8 == 2 || i % 8 == 6) {
        radius = 4 * inner_radius;
      }

      // B
      if (i % 8 == 4) {
        radius = 2 * inner_radius;
      }

      paths.push([
        [
          radius * Math.cos(i/num_lines * Math.PI * 2),
          radius * Math.sin(i/num_lines * Math.PI * 2)
        ],
        [
          outer_radius * Math.cos(i/num_lines * Math.PI * 2),
          outer_radius * Math.sin(i/num_lines * Math.PI * 2)
        ]
      ]);
    }

    return paths;
  }

}