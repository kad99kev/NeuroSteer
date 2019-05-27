
function nextGeneration(){
  calculateFitness(end);
  for(let i = 0; i < TOTAL; i++){
    population[i] = pickOne(savedParticles);
  }
  for(let i = 0; i < TOTAL; i++){
    savedParticles[i].dispose();
  }
  savedParticles = [];
  savedParticles = [...population];
}


function pickOne(savedParticles){
  let index = 0;
  let r = random(1);

  while (r > 0) {
    r -= savedParticles[index].fitness;
    index += 1;
  }
  index -= 1;
  let particle = savedParticles[index];
  let child = new Particle(particle.brain);
  child.mutate();
  return child;
}

//Normalizing the fitness of all population
function calculateFitness(target){
  //Calculating fitness for each particle
  for(let particle of savedParticles){
    particle.calculateFitness();
  }

  //Adding all scores and dividing by sum to calculate fitness
  let sum = 0;
  for(let particle of savedParticles){
    sum += particle.fitness;
  }

  for(let particle of savedParticles){
    particle.fitness = particle.fitness / sum;
  }
}
