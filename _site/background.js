
let areaPerBall, collisionDist, balls, mouseBall;

function setup() {
  createCanvas(windowWidth, windowHeight);

  areaPerBall = 12500;
  collisionDist = 150;
  balls = [];

  mouseBall = new Ball(0, mouseX, mouseY, collisionDist, 0, 0);
  balls.push(mouseBall);

  let numBalls = (windowWidth * windowHeight) / areaPerBall;
  for (let i = 1; i < numBalls+1; i++) {
    balls.push(new Ball(i,
      randInt(0, windowWidth),
      randInt(0, windowHeight),
      collisionDist,
      Math.random() * 0.2,
      Math.random() * Math.PI));
  }
}

function draw() {
  background(color(44, 62, 80));

  mouseBall.x = mouseX;
  mouseBall.y = mouseY;

  for (let ball of balls) {
    ball.update();
    ball.connectNearest2();
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
      balls.push(new Ball(balls.length + i, randInt(0, windowWidth), randInt(0, windowHeight), 2, Math.random() * 0.2, Math.random() * Math.PI));
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
  constructor(index, initX, initY, size, initForce, initForceDir) {
    this.id = index;
    this.x = initX;
    this.y = initY;
    this.size = size;
    this.deltaX = Math.cos(initForceDir)*initForce;
    this.deltaY = Math.sin(initForceDir)*initForce * -1; //-1 because y increases downwards
  }

  update() {

    //flip deltaX when out of bounds
    if(this.x > windowWidth || this.x < 0) {
      this.deltaX *= -1;
    }

    //flip deltaY when out of bounds
    if(this.y > windowHeight || this.y < 0) {
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

  connectNearest2() {
    for(let i = this.id; i < balls.length; i++) {
      let ball = balls[i];

      if(ball != this) {
        if(collideCircleCircle(this.x, this.y, this.size, ball.x, ball.y, ball.size)) {
          let dist = this.distToBall(ball);
          let alpha = map(dist, 0, this.size * 2, 0.5, 0);

          stroke('rgba(46, 204, 113,' + alpha + ')');
          line(this.x, this.y, ball.x, ball.y);
        }
      }
    }
  }
}
