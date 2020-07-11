
let areaPerBall, balls, mouseBall;

function setup() {
  createCanvas(windowWidth, windowHeight);

  areaPerBall = 7500;
  balls = [];

  mouseBall = new Ball(mouseX, mouseY, 0, 0, 0);
  balls.push(mouseBall);

  let numBalls = (windowWidth * windowHeight) / areaPerBall;
  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball(randInt(0, windowWidth), randInt(0, windowHeight), 2, Math.random() * 0.2, Math.random() * Math.PI));
  }
}

function draw() {
  background(color(44, 62, 80));

  mouseBall.x = mouseX;
  mouseBall.y = mouseY;

  for (let ball of balls) {
    ball.update();
    ball.connectNearest2(150, 10);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  let curAreaPerBall = (windowWidth * windowHeight) / balls.length;
  if(curAreaPerBall < areaPerBall) {
    let diff = balls.length - ((windowWidth * windowHeight) / areaPerBall);

    for(let i = 0; i < diff; i++) {
      balls.pop();
    }
  } else if (curAreaPerBall > areaPerBall) {
    let diff = ((windowWidth * windowHeight) / areaPerBall) - balls.length;

    for(let i = 0; i < diff; i++) {
      balls.push(new Ball(randInt(0, windowWidth), randInt(0, windowHeight), 2, Math.random() * 0.2, Math.random() * Math.PI));
    }
  }
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function map(value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

class Ball {
  constructor(initX, initY, size, initForce, initForceDir) {
    this.x = initX;
    this.y = initY;
    this.size = size;
    this.deltaX = Math.cos(initForceDir)*initForce;
    this.deltaY = Math.sin(initForceDir)*initForce * -1; //-1 because y increases downwards
  }

  update() {

    //flip deltaX when out of bounds
    if(this.x > 800-this.size/2 || this.x < this.size/2) {
      this.deltaX *= -1;
    }

    //flip deltaY when out of bounds (0.95 to soften the bounce)
    if(this.y > 600-this.size/2 || this.y < this.size/2) {
        this.deltaY *= -1;
    }

    this.x += this.deltaX;
    this.y += this.deltaY;
  }

  draw() {
    ellipse(this.x, this.y, this.size, this.size);
  }

  distToBall(ball) {
    return Math.sqrt(Math.pow((this.x - ball.x), 2) + Math.pow((this.y - ball.y), 2));
  }

  connectNearest2(radius, maxConnections) {
    let ballDists = [];
    for (let ball of balls) {
      if(ball != this) {
        let dist = this.distToBall(ball);
        ballDists.push({
          "ball": ball,
          "dist": dist
        })
      }
    }

    ballDists.sort((a, b) => (a.dist > b.dist) ? 1 : -1)

    for(let i = 0; i < Math.min(maxConnections, ballDists.length); i++) {
      if(ballDists[i].dist < radius) {
        let ball = ballDists[i].ball;
        let alpha = map(ballDists[i].dist, 0, radius, 0.5, 0);

        stroke('rgba(46, 204, 113,' + alpha + ')');
        line(this.x, this.y, ball.x, ball.y);
      }
    }
  }
}
