import * as THREE from 'three';

// --- Scene Setup ---
const container = document.getElementById('app');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050510, 0.02); // matches bg color

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

const pointLight = new THREE.PointLight(0x00f3ff, 2, 50);
pointLight.position.set(0, 2, 5);
scene.add(pointLight);

// --- Objects ---
// Track / Grid
const gridHelper = new THREE.GridHelper(100, 100, 0x00f3ff, 0x00f3ff);
gridHelper.position.y = -0.5;
gridHelper.material.opacity = 0.3;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Player
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x00f3ff,
  emissive: 0x00f3ff,
  emissiveIntensity: 0.5,
  roughness: 0.2,
  metalness: 0.8
});
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 0;
scene.add(player);

// Obstacles
const obstacles = [];
const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
const obstacleMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xff00ea,
  emissive: 0xff00ea,
  emissiveIntensity: 0.6,
  roughness: 0.3,
  metalness: 0.7
});

// --- Game Variables ---
let isGameRunning = false;
let score = 0;
let speed = 0.2;
let obstacleSpawnTimer = 0;
let obstacleSpawnRate = 60; // Frames between spawns

// UI Elements
const uiScore = document.getElementById('score');
const uiFinalScore = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// --- Input Handling ---
let targetX = 0;
const moveLimit = 4; // How far left/right player can go

window.addEventListener('keydown', (e) => {
  if (!isGameRunning) return;
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    targetX -= 2;
  } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    targetX += 2;
  }
  // Clamp
  targetX = Math.max(-moveLimit, Math.min(moveLimit, targetX));
});

// Touch controls for mobile
window.addEventListener('touchstart', (e) => {
  if (!isGameRunning) return;
  const touchX = e.touches[0].clientX;
  const halfWidth = window.innerWidth / 2;
  if (touchX < halfWidth) {
    targetX -= 2; // Left
  } else {
    targetX += 2; // Right
  }
  targetX = Math.max(-moveLimit, Math.min(moveLimit, targetX));
});


// --- Game Logic ---
function spawnObstacle() {
  const obs = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  // Random position in lanes: -4, -2, 0, 2, 4
  const lane = Math.floor(Math.random() * 5) - 2; // -2 to 2
  obs.position.set(lane * 2, 0, -40);
  scene.add(obs);
  obstacles.push(obs);
}

function resetGame() {
  score = 0;
  speed = 0.2;
  targetX = 0;
  player.position.x = 0;
  uiScore.innerText = score;
  
  // Clear obstacles
  obstacles.forEach(obs => scene.remove(obs));
  obstacles.length = 0;
  
  obstacleSpawnTimer = 0;
}

function startGame() {
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  resetGame();
  isGameRunning = true;
}

function gameOver() {
  isGameRunning = false;
  uiFinalScore.innerText = Math.floor(score);
  gameOverScreen.classList.remove('hidden');
}

// --- Event Listeners ---
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();

  if (isGameRunning) {
    // Smoothly interpolate player position
    player.position.x += (targetX - player.position.x) * 10 * delta;
    
    // Add subtle bobbing animation to player
    player.rotation.x += delta * 2;
    player.rotation.y += delta * 2;
    
    // Animate grid to look like moving forward
    gridHelper.position.z = (gridHelper.position.z + speed) % 2;

    // Spawn obstacles
    obstacleSpawnTimer++;
    if (obstacleSpawnTimer > obstacleSpawnRate) {
      spawnObstacle();
      obstacleSpawnTimer = 0;
      // Slightly increase difficulty
      speed += 0.001;
      if (obstacleSpawnRate > 20) obstacleSpawnRate -= 0.5;
    }

    // Move and check collisions
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.position.z += speed * 60 * delta;
      
      // Rotate obstacles for style
      obs.rotation.x -= delta;
      obs.rotation.y += delta;

      // Collision detection (simple bounding box logic based on distance)
      if (
        Math.abs(obs.position.z - player.position.z) < 1.0 &&
        Math.abs(obs.position.x - player.position.x) < 1.0
      ) {
        gameOver();
      }

      // Remove passed obstacles
      if (obs.position.z > 10) {
        scene.remove(obs);
        obstacles.splice(i, 1);
        score += 10;
        uiScore.innerText = Math.floor(score);
      }
    }
  }

  renderer.render(scene, camera);
}

animate();
