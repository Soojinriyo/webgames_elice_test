const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let frames = 0;
const GRAVITY = 0.25;
const FLAP = -4.5;
let bird = { x: 50, y: 150, w: 34, h: 24, velocity: 0 };
let pipes = [];
let score = 0;
let gameOver = false;

function reset() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frames = 0;
  gameOver = false;
}

document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    if (gameOver) { reset(); return; }
    bird.velocity = FLAP;
  }
});

function drawBird() {
  ctx.fillStyle = '#ffeb3b';
  ctx.beginPath();
  ctx.ellipse(bird.x, bird.y, bird.w/2, bird.h/2, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.stroke();
}

function drawPipes() {
  ctx.fillStyle = '#388e3c';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.w, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.w, canvas.height - pipe.bottom);
  });
}

function draw() {
  ctx.fillStyle = '#81d4fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  ctx.fillStyle = '#222';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
  if (gameOver) {
    ctx.fillStyle = '#d32f2f';
    ctx.font = '36px Arial';
    ctx.fillText('Game Over', 70, 240);
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Restart', 60, 270);
  }
}

function update() {
  if (gameOver) return;
  frames++;
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;
  if (frames % 90 === 0) {
    let top = Math.random() * 200 + 20;
    let gap = 100;
    pipes.push({
      x: canvas.width,
      w: 40,
      top: top,
      bottom: top + gap
    });
  }
  pipes.forEach(pipe => {
    pipe.x -= 2;
  });
  // Remove off-screen pipes
  if (pipes.length && pipes[0].x + pipes[0].w < 0) pipes.shift();
  // Collision
  pipes.forEach(pipe => {
    if (
      bird.x + bird.w/2 > pipe.x && bird.x - bird.w/2 < pipe.x + pipe.w &&
      (bird.y - bird.h/2 < pipe.top || bird.y + bird.h/2 > pipe.bottom)
    ) {
      gameOver = true;
    }
  });
  // Ground or ceiling
  if (bird.y + bird.h/2 > canvas.height || bird.y - bird.h/2 < 0) {
    gameOver = true;
  }
  // Score
  pipes.forEach(pipe => {
    if (!pipe.passed && bird.x > pipe.x + pipe.w) {
      score++;
      pipe.passed = true;
    }
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
