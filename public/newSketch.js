let walls;
let ray;
let particle;

let start; let end;

let width = 600; let height = 400;
let canWid = 800; let canHei = 600;

let population = [];
let savedParticles = [];

const TOTAL = 200; const mutateRate = 0.05;

let speedSlider;

let inside; let outside; let checkpoints;

const totPoints = 30; const LIFESPAN = 300;

function setup(){
  createCanvas(canWid, canHei);

  tf.setBackend('cpu');
  background(0);
  buildTrack();
  for(let i = 0 ; i < TOTAL; i++){
    population[i] = new Particle();
  }

  speedSlider = createSlider(1, 10, 1);
}

function draw(){
  const cycles = speedSlider.value();
  background(0);

  for(let n = 0; n < cycles; n++){
    for(let particle of population){
      particle.look(walls);
      particle.check(checkpoints);
      particle.update();
      particle.bounds();
    }

    for(let i = population.length - 1; i >= 0; i--){
      const particle = population[i];
      if(particle.dead || particle.finished){
        savedParticles.push(population.splice(i, 1)[0]);
      }
    }

    if(population.length == 0){
      buildTrack();
      nextGeneration();
    }
  }

  for(let wall of walls){
    wall.display();
  }

  for(points of checkpoints){
    stroke('blue');
    fill(255);
    const mid = points.midpoint();
    ellipse(mid.x, mid.y, 4, 4);
}

  for(let particle of population){
    particle.display();
  }

  stroke('orange');
  fill(255);
  ellipse(start.x, start.y, 4, 4);

  stroke('green');
  fill(255);
  ellipse(end.x, end.y, 4, 4);
}

function buildTrack(){
  walls = [];
  inside = [];
  outside = [];
  checkpoints = [];
  stroke(255);
  noFill();
  let startX = random(1000);
  let startY = random(1000);
  let noiseMax = 2;
  for(let i = 0; i < totPoints; i++){
    let a = map(i, 0, totPoints, 0, TWO_PI);
    let xoff = map(cos(a), -1, 1, 0, noiseMax + startX);
    let yoff = map(sin(a), -1, 1, 0, noiseMax + startY);
    let r = map(noise(xoff, yoff), 0, 1, 100, height / 2 + 100);
    let x1 = (width + 50) / 2 + (r - 50) * cos(a);
    let y1 = (height + 150) / 2 + (r - 50) * sin(a);
    let x2 = (width + 50) / 2 + (r + 50) * cos(a);
    let y2 = (height + 150) / 2 + (r + 50) * sin(a);
    inside.push(createVector(x1, y1));
    outside.push(createVector(x2, y2));
    checkpoints.push(new Boundary(x1, y1, x2, y2));
  }

  for(let i = 0; i < totPoints; i++){
    let in1 = inside[i];
    let in2 = inside[(i+1) % totPoints];
    walls.push(new Boundary(in1.x, in1.y, in2.x, in2.y));
    let out1 = outside[i];
    let out2 = outside[(i+1) % totPoints];
    walls.push(new Boundary(out1.x, out1.y, out2.x, out2.y));
  }

  walls.push(new Boundary(inside[totPoints - 1].x, inside[totPoints - 1].y, outside[totPoints - 1].x, outside[totPoints - 1].y))
  start = checkpoints[0].midpoint();
  end = checkpoints[totPoints - 2].midpoint();
}
