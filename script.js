const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('overlay');

let score = 0;
let playerX = 140;
let bullets = [];
let enemies = [];
let gameOver = false;

// Player movement
document.addEventListener('keydown', e => {
  if(gameOver) return;
  if(e.key === 'ArrowLeft') playerX -= 10;
  if(e.key === 'ArrowRight') playerX += 10;
  playerX = Math.max(0, Math.min(280, playerX));
  player.style.left = playerX + 'px';
  if(e.code === 'Space') shoot();
});

// Shoot bullet
function shoot() {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = (playerX + 17) + 'px';
  bullet.style.top = '440px';
  game.appendChild(bullet);
  bullets.push(bullet);
}

// Spawn enemy
function spawnEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = Math.random() * 280 + 'px';
  enemy.style.top = '0px';
  game.appendChild(enemy);
  enemies.push(enemy);
}

// Game loop
function loop() {
  if(gameOver) return;

  // Move bullets
  bullets.forEach((b,i) => {
    b.style.top = (parseInt(b.style.top)-8) + 'px';
    if(parseInt(b.style.top)<0){
      game.removeChild(b);
      bullets.splice(i,1);
    }
  });

  // Move enemies
  enemies.forEach((e,i) => {
    e.style.top = (parseInt(e.style.top)+2) + 'px';
    // Check collision with bullets
    bullets.forEach((b,j) => {
      if(collide(b,e)){
        game.removeChild(e);
        enemies.splice(i,1);
        game.removeChild(b);
        bullets.splice(j,1);
        score += 10;
        scoreEl.textContent = score;
      }
    });
    // Check collision with player
    if(collide(e,player)){
      endGame();
    }
    // Enemy out of bounds
    if(parseInt(e.style.top)>480){
      game.removeChild(e);
      enemies.splice(i,1);
      score -= 5;
      scoreEl.textContent = score;
    }
  });

  requestAnimationFrame(loop);
}

// Collision detection
function collide(a,b){
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

// End game
function endGame(){
  gameOver = true;
  overlay.classList.remove('hidden');
}

// Restart game
function restartGame(){
  overlay.classList.add('hidden');
  bullets.forEach(b => game.removeChild(b));
  enemies.forEach(e => game.removeChild(e));
  bullets = [];
  enemies = [];
  score = 0;
  scoreEl.textContent = score;
  playerX = 140;
  player.style.left = playerX + 'px';
  gameOver = false;
  loop();
}

// Spawn enemies every 1.2s
setInterval(()=>{ if(!gameOver) spawnEnemy(); },1200);
loop();