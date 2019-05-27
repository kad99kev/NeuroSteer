function ptLineDistance(p1, p2, x, y){
  const num = abs((p2.y - p1.y) * x - (p2.x - p1.x) * y + p2.x * p1.y - p2.y * p1.x);
  const deno = p5.Vector.dist(p1, p2);
  return num / deno;
}

class Particle{
  constructor(brain){
    this.fitness = 0;
    this.pos = createVector(start.x, start.y);
    this.rays = [];
    this.vel = createVector();
    this.acc = createVector();
    this.heading = 0;
    this.fov = 90;
    this.maxSpeed = 3;
    this.maxForce = 0.5;
    this.sight = 50;
    this.finished = false;
    this.dead = false;
    this.index = 1;
    this.counter = 0;
    this.laps = 0;
    for(let a = -this.fov; a < this.fov; a += 36){
      this.rays.push(new Ray(this.pos, radians(a)));
    }
    if (brain instanceof NeuralNetwork){
      this.brain = brain.copy();
    }
    else {
      this.brain = new NeuralNetwork(null, this.rays.length, this.rays.length, 1);
    }
  }

  mutate(){
    this.brain.mutate(mutateRate);
  }

  dispose(){
    this.brain.dispose();
  }

  applyForce(force){
    this.acc.add(force);
  }

  check(checkpoints){
    const goal = checkpoints[this.index];
    const dist = ptLineDistance(goal.a, goal.b, this.pos.x, this.pos.y);
    if( dist < 5){
      this.index = (this.index + 1) % checkpoints.length;
      this.fitness++;
      this.counter = 0;
      if(this.index == checkpoints.length - 1){
        this.laps += 1;
      }
      if(this.laps == totLaps){
        this.finished = true;
      }
    }
  }

  bounds(){
    if(this.pos.x > canWid || this.pos.x < 0 || this.pos.y < 0 || this.pos.y > canHei){
      this.dead = true;
    }
  }

  update(){
    if(!this.dead && !this.finished){
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.acc.set(0, 0);
      this.counter += 1;
      if(this.counter > LIFESPAN){
        this.dead = true;
      }
    }

    for(let i = 0; i < this.rays.length; i++){
      this.rays[i].rotate(this.vel.heading());
    }
  }

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    const heading = this.vel.heading();
    rotate(heading);
    stroke('white');
    fill(0, 255, 0, 100);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
    pop();
  }

  calculateFitness(){
    this.fitness = pow(2, this.index);
    // if(this.fitness){
    //   this.fitness = this.index;
    // }
    // const dist = p5.Vector.dist(this.pos, target);
    // this.fitness = constrain(1 / dist, 0, 1);
  }

  look(walls){
    let inputs = [];
    for(let i = 0; i < this.rays.length; i++){
      let closest = null;
      let record = this.sight;
      for(let wall of walls){
        let pt = this.rays[i].cast(wall);
        if(pt){
          let dist = p5.Vector.dist(this.pos, pt);
          if(dist < record && dist < this.sight){
            record = dist;
            closest = pt;
          }
        }
      }

      if(record < 5){
        this.dead = true;
      }

      inputs[i] = map(record, 0, this.sight, 1, 0);

      // if(closest){
      //   stroke(200, 200, 250, 100);
      //   const mid = checkpoints[this.index].midpoint();
      //   line(this.pos.x, this.pos.y, closest.x, closest.y);
      // }
    }

    // const vel = this.vel.copy();
    // vel.normalize();
    // inputs.push(vel.x);
    // inputs.push(vel.y);

    const output = this.brain.predict(inputs);
    let angle = map(output[0], 0, 1, -PI, PI);
    angle += this.vel.heading();
    const steering = p5.Vector.fromAngle(angle);
    steering.setMag(this.maxSpeed);
    steering.sub(this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

}
