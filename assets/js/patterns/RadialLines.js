class RadialLines {

  constructor() {
    this.key = "radiallines";
    this.name = "Radial Lines";
    this.title = "Radial Lines"
    this.constrain = false
  }

  draw() {
    return this.draw3();
  }

  draw1() {

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

  draw2() {

    // Create paths array to return
    let paths = new Array();

    let PathHelp = new PathHelper();

    let radius = 0.75

    let sine_wave
    let periods = 1
    sine_wave = new Array();
    for (let a = 0; a < 100; a++) {
      sine_wave.push([
        (radius * 2) * (a/(100)),
        0.1 * Math.sin(a/100 * Math.PI * 2 * periods),
      ])
    }

    let num_lines = 60;
    for (let i = 0; i < num_lines; i++) {
      let theta =  i/num_lines * Math.PI * 2
      paths.push(
        PathHelp.translatePath(
          sine_wave,
          [
            -radius + radius * Math.cos(theta),
            radius * Math.sin(theta),
          ]
        )
      );
    }

    return paths;
  }

  draw3() {

    // Create paths array to return
    let paths = new Array();

    let PathHelp = new PathHelper();

    let circle = PathHelp.polygon(24, 0.05)

    let radius

    let sine_wave
    let periods

    let num_lines = 60;
    for (let i = 0; i < num_lines; i++) {

      let theta =  i/num_lines * Math.PI * 2

      for (let j = 0; j < 2; j++) {
        sine_wave = new Array();
        periods = 0.5 + Math.random()
        radius = (5/3) * (0.25 + Math.random()/2)
        let inner_radius = 0.1 + (Math.random()/5);
        let phase = Math.random() * Math.PI
        for (let a = 0; a < 100; a++) {
          sine_wave.push([
            inner_radius + radius * (a/100),
            0.1 * Math.sin(a/100 * Math.PI * 2 * periods + phase),
          ])
        }

        // Circle at end of Sine wave
        /*
        sine_wave = sine_wave.concat(
          PathHelp.translatePath(circle, [inner_radius + radius + 0.05, sine_wave[sine_wave.length-1][1]])
        );
        //*/

        paths.push(
          PathHelp.rotatePath(
            sine_wave,
            theta + 5 * (Math.random() - 0.5)
          )
        );

      }



    }

    return paths;
  }
}