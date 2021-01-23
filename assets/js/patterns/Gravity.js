/*
 * Gravity Pattern
 * Inspired by Daniel Shiffman's "Nature of Code"
 */
class Gravity {

  constructor() {

    this.key = "gravity";

    this.name = "Gravity";

    this.movers;
    this.attractors = [];
  }

  /**
   * Calculate coordinates
   **/
  calc(steps) {

    let path = new Array();
    let point = new Array();
    let force = new p5.Vector(0, 0);
    // let forces = new Array();
    // let attractor_force = new p5.Vector(0, 0);
    let force1;
    let force2;

    // Loop through an arbitrary number of time iterations
    for (var i = 0; i < steps; i++) {

      // Sum the forces of the Attractors
      // This didn't work
      /*
      for (var j = 0; j < this.attractors.length; j++) {
        attractor_force = this.attractors[j].calculateAttraction(this.mover, 5, 20);
        force = p5.Vector.add(force, attractor_force);
      }
      //*/
      force1 = this.attractors[0].calculateAttraction(this.mover, 5, 20);
      force2 = this.attractors[1].calculateAttraction(this.mover, 5, 20);
      force = p5.Vector.add(force1, force2);

      // Apply the force to the Mover
      this.mover.applyForce(force);

      // Update the position, velocity and acceleration of the mover
      this.mover.update();

      // Save the Mover position to a Path position
      point = [
        this.mover.position.x,
        this.mover.position.y
      ];

      // Add the position to the Path if it is within the bounds of the table
      // if ((point[0] > -(max_x - min_x)/2 && point[0] < (max_x - min_x)/2)
        // && (point[1] > -(max_y - min_y)/2 && point[1] < (max_y - min_y)/2)) {
        path.push(point);
      // }
    }

    return path;
  }
}

/*
 * Attractor Class
 * Credit to Daniel Shiffman (Nature of Code)
 * Reference Sketch: https://editor.p5js.org/jcponce/sketches/OTt5ZZqT9
 */
class Attractor {

  constructor(G, m, x, y) {
    this.position = new p5.Vector(x,y);
    this.mass = m;
    this.G = G;
  }

  calculateAttraction(mover, min_distance = 5, max_distance = 20) {

    // Calculate direction of force
    let force = p5.Vector.sub(this.position, mover.position);

    // Distance between objects
    let distance = force.mag();

    // Limiting the distance to eliminate "extreme" results for very close or very far objects
    distance = this.constrain(distance, min_distance, max_distance);

    // Normalize vector (distance doesn't matter here, we just want this vector for direction)
    force.normalize();

    // Calculate gravitional force magnitude
    let strength = (this.G * this.mass * mover.mass) / (distance * distance);

    // Get force vector --> magnitude * direction
    force.mult(strength);

    return force;
  }


  constrain(val, min, max) {
    if (val < min) {
        return min
    } else if (val > max) {
        return max
    }
    return val
  }
}

/*
 * Mover Class
 * Credit to Daniel Shiffman (Nature of Code)
 * Reference Sketch: https://editor.p5js.org/jcponce/sketches/OTt5ZZqT9
 */
class Mover {

  constructor(m, x, y, vx, vy) {
    this.mass = m;
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(vx, vy);
    this.acceleration = new p5.Vector(0, 0);
  }

  applyForce(force) {
    let acceleration = p5.Vector.div(force, this.mass);
    this.acceleration.add(acceleration);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
}
