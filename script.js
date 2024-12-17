// import * as THREE from 'three';  // Import Three.js library

// import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(40);
camera.position.setY(25);

const fieldTexture = new THREE.TextureLoader().load('field.png');

const fieldGeometry = new THREE.RoundedBoxGeometry(80, 5, 45, 10, 2);
const fieldMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xFF6437}), // Right (+X)
  new THREE.MeshStandardMaterial({ color: 0xFF6437}), // Left (-X)
  new THREE.MeshStandardMaterial({ color: 0xFF6437}), // Top (+Y) with texture and color overlay
  new THREE.MeshStandardMaterial({ color: 0xFF6437}), // Bottom (-Y)
  new THREE.MeshStandardMaterial({ color: 0xFF6437}), // Front (+Z)
  new THREE.MeshStandardMaterial({ color: 0xFF6437})  // Back (-Z)
];

const field = new THREE.Mesh(fieldGeometry, fieldMaterials);

const ballGeometry = new THREE.CylinderGeometry(2, 2, 1, 20, 32);

const ballMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0});

const ball = new THREE.Mesh(ballGeometry, ballMaterial);

ball.position.y += 3;

function getRandomInRange(min, max) {
  
}
function getStartingSpeed() {
  const range = Math.random() < 0.5 ? [0.2, 0.3] : [-0.3, -0.2];

  return Math.random() * (range[0] - range[1]) + range[0];
}

let ballSpeedX;
let ballSpeedZ;

const rightPlayerGeometry = new THREE.RoundedBoxGeometry(2, 3, 15, 10, 0.5);

const rightPlayerMaterial = new THREE.MeshStandardMaterial( { color: 0xFF64FF, roughness: 0, metalness: 0.1 });

const rightPlayer = new THREE.Mesh(rightPlayerGeometry, rightPlayerMaterial);

rightPlayer.position.setY(4);
rightPlayer.position.setX(36);

const leftPlayerGeometry =  new THREE.RoundedBoxGeometry(2, 3, 15, 10, 0.5);

const leftPlayerMaterial = new THREE.MeshStandardMaterial( { color: 0xFFFB64, roughness: 0, metalness: 0.1 });

const leftPlayer = new THREE.Mesh(leftPlayerGeometry, leftPlayerMaterial);

leftPlayer.position.setY(4);
leftPlayer.position.setX(-36);

const ambient = new THREE.AmbientLight(0xFFFFFF, 0.1);

const mainSpotLight = new THREE.PointLight(0xFFFFFF, 0.5);

const leftBackLight = new THREE.PointLight(0xFFFFFF, 0.4);

const rightBackLight = new THREE.PointLight(0xFFFFFF, 0.4);

const frontLight = new THREE.PointLight(0xFFFFFF, 0.4);

const backLight = new THREE.PointLight(0xFFFFFF, 0.4);

mainSpotLight.position.set(0, 10, 0);
rightBackLight.position.set(45, 15, 0);
leftBackLight.position.set(-45, 15, 0);
frontLight.position.set(0, 15, 45);
backLight.position.set(0, 15, -45);

function addStar()
{
  const starGeo = new THREE.SphereGeometry(0.25, 25, 25);
  const starMate = new THREE.MeshBasicMaterial( { color: 0xFFFFFF});
  const star = new THREE.Mesh(starGeo, starMate);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread (200));
  
  star.position.set(x, y, z);
  scene.add(star);
}

Array(1000).fill().forEach(addStar);

const spaceImage = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceImage;


const mtlLoader = new THREE.MTLLoader();
const objLoader = new THREE.OBJLoader();
mtlLoader.load('football_goal.mtl', function(materials) {
  materials.preload();
  // Load the OBJ model
  objLoader.load('football_goal.obj', function(zort) {
    zort.scale.set(0.09, 0.09, 0.09);
    zort.rotation.set(0, Math.PI / 2, 0);
    zort.position.set(40, 0, 22.6);
    scene.add(zort);
    const zart = zort.clone();
    zart.rotation.set(0, -Math.PI / 2, 0);
    zart.position.set(-40, 0, -22.6);
    scene.add(zart);
  });
});


scene.add(rightBackLight);
scene.add(leftBackLight);
scene.add(mainSpotLight);
scene.add(frontLight);
scene.add(backLight);

scene.add(ambient);

scene.add(field);

scene.add(rightPlayer);

scene.add(leftPlayer);

scene.add(ball);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const keys = {};

document.addEventListener("keydown", (e) => {
  if (!countdownActive) {
    keys[e.keyCode] = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (!countdownActive) {
    keys[e.keyCode] = false;
  }
});

function handlePlayerMovement() {
  // Left Player controls (arrow keys)
  if (keys[68] && leftPlayer.position.z <= 14) {
    leftPlayer.position.z += 0.5; // Move left player forward
  }
  if (keys[65] && leftPlayer.position.z >= -14) {
    leftPlayer.position.z -= 0.5; // Move left player backward
  }

  // Right Player controls (A and D keys)
  if (keys[37] && rightPlayer.position.z <= 14) {
    rightPlayer.position.z += 0.5; // Move right player forward
  }
  if (keys[39] && rightPlayer.position.z >= -14) {
    rightPlayer.position.z -= 0.5; // Move right player backward
  }
}

function restartGame()
{
  countdownActive = true;
  ball.position.set(0,3,0);
  leftPlayer.position.set(-36,4,0);
  rightPlayer.position.set(36,4,0);
  startCountdown();
}

let turnCheck1 = 1;
let turnCheck2 = 1;
let keepCheck1 = 0;
let keepCheck2 = 0;
let check = 0;

function isHit()
{
  if (ball.position.x < -33 && ball.position.z < leftPlayer.position.z + 7.5 && ball.position.z > leftPlayer.position.z - 7.5 && turnCheck2)
  {
    turnCheck1 = 1;
    turnCheck2 = 0;
    return (1);
  }
  else if (ball.position.x < -33 && ball.position.z < leftPlayer.position.z + 7.5 && ball.position.z > leftPlayer.position.z - 7.5 && !turnCheck2)
  {
    keepCheck2 = 1;
    return (1);
  }
  if (ball.position.x > 33 && ball.position.z < rightPlayer.position.z + 7.5 && ball.position.z > rightPlayer.position.z - 7.5 && turnCheck1)
  {
    turnCheck1 = 0;
    turnCheck2 = 1;
    return (1);
  }
  else if (ball.position.x > 33 && ball.position.z < rightPlayer.position.z + 7.5 && ball.position.z > rightPlayer.position.z - 7.5 && !turnCheck1)
  {
    keepCheck1 = 1;
    return (1);
  }
  return (0);
}

function moveBall()
{
  let a = isHit();
  if (ball.position.z >= 20 || ball.position.z <= -20)
  {
    ballSpeedZ *= -1;
    check = 1;
  }
  else if (ball.position.x >= 39 || ball.position.x <= -39)
    restartGame();
  else if (isHit())
  {
    ballSpeedX *= -1;
    if (check)
    {
      ballSpeedX += (ballSpeedX / Math.abs(ballSpeedX)) / 20;
      ballSpeedZ += (ballSpeedZ / Math.abs(ballSpeedZ)) / 20;
    }
    check = 0;
  }
  ball.position.x += ballSpeedX;
  ball.position.z += ballSpeedZ;
}

function animate() {
  requestAnimationFrame(animate);
  if (!countdownActive)
  {
    moveBall();
    handlePlayerMovement(); // Handle player input
    controls.update(); // Update camera controls
  }
  renderer.render(scene, camera); // Render the scene
}

let countdownActive = true;
let interval;
const countdown = document.getElementById('countdown');
let timer = 3;

function startCountdown() {
  clearInterval(interval);
  timer = 3;
  ballSpeedX = getStartingSpeed();
  ballSpeedZ = getStartingSpeed();
  countdown.textContent = timer; // Update the countdown text
  document.getElementById('splash').style.display = 'flex';
  interval = setInterval(() => {
    countdown.textContent = timer; // Update the countdown text
    if (timer === 0)
        countdown.textContent = 'START';
    if (timer === -1)
    {
      clearInterval(interval); // Stop the timer
      document.getElementById('splash').style.display = 'none';
      countdownActive = false; // Enable inputs after countdown
    }

    timer--; // Decrement the timer
  }, 1000); // Run every 1 second
}

animate();
startCountdown();