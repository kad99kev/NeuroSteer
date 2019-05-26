# Neuro-Evolution Steering
Using **Genetic Algorithms** and **Neural Networks** ([check out NEAT](https://en.wikipedia.org/wiki/Neuroevolution_of_augmenting_topologies)), a car can teach itself to drive around a track (any track).  
The track is divided into **checkpoints** that rewards the car for crossing it.  
Once a generation has either completed or died, using **mutation**, the next generation is spawned with **slight variation** in each member.  
In order to avoid overfitting, the track is randomised (kind of) using [Perlin noise.](https://en.wikipedia.org/wiki/Perlin_noise)  
The above points mentioned are the basic features of this project.  
### What I hope to include:
1. Feature to display only the best car from the previous generation.
2. The 3 best cars from the previous generation and have them race.
3. Giving a fixed starting point to each car instead of spawning all at one place and make each car avoid the other (no car should crash into each other). This and the above point should hopefully create an interesting race.
### Resources:
* The Coding Train on YouTube.
  Suggested videos to watch (in order).
  1. [Ray Casting.](https://youtu.be/TOEi6T2mtHo)
  2. [How to use tensorflow.js](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YIeVA3dNxbR9PYj4wV31oQ)
  3. [The actual "putting together" of everything learnt thus far.](https://youtu.be/mXDrH0wStHs)
* Coding Bullet  
  [A 16 minute gist of everything to be done.](https://youtu.be/r428O_CMcpI)
