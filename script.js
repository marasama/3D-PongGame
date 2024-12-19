// import * as THREE from 'three';  // Import Three.js library

//const { element } = require("three/tsl");

// import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const scene = new THREE.Scene();

let leftScore = 0;
let rightScore = 0;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);
camera.position.setY(40);

const gltfLoader = new THREE.GLTFLoader();
const yAxis = new THREE.Vector3(0, 1, 0);
let leftCounter;
let rightCounter;
let leftCounterMixer;
let rightCounterMixer;
let leftScoreKeeper;
let rightScoreKeeper;
let leftMixer;
let rightMixer;
gltfLoader.load('mech_drone.glb',
  function (gltf)
  {
    leftScoreKeeper = gltf.scene;
    leftScoreKeeper.scale.set(20, 20, 20);
    leftScoreKeeper.position.set(-20, 10, -30);
    leftMixer = new THREE.AnimationMixer(leftScoreKeeper);
    leftMixer.clipAction(gltf.animations[0]).play();
    scene.add(leftScoreKeeper);
  },
  function (xhr){
  },
  function (error){
  }
)

gltfLoader.load('flying_robot.glb',
  function (gltf) {
    let meshCount = 0;
    rightScoreKeeper = gltf.scene;

    // Traverse through the model
    rightScoreKeeper.traverse((node) => {
      if (node.isMesh) {
        if (node.name.toLowerCase() === 'object_19') {
          // Skip changing the material for the eyes
          return;
        }
        // Clone the original material to preserve textures and other properties
        const originalMaterial = node.material;
        const clonedMaterial = new THREE.MeshStandardMaterial({
          map: originalMaterial.map,              // Preserve texture
          emissiveMap: originalMaterial.emissiveMap, // Preserve emissive map
          normalMap: originalMaterial.normalMap,  // Preserve normal map
          color: originalMaterial.color,          // Keep the original color
          emissive: originalMaterial.emissive,    // Preserve emissive color
          roughness: originalMaterial.roughness,  // Keep original roughness
          metalness: 0,  // Keep original metalness
        });
        node.material = clonedMaterial;
        console.log(node.name);
        meshCount++;
      }
    });

    console.log(`Total meshes processed: ${meshCount}`);
    rightScoreKeeper.scale.set(20, 20, 20);
    rightScoreKeeper.position.set(0, 20, 0);

    // Set up animation
    rightMixer = new THREE.AnimationMixer(rightScoreKeeper);
    if (gltf.animations[6]) {
      rightMixer.clipAction(gltf.animations[1]).play();
    }

    scene.add(rightScoreKeeper);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error occurred:', error);
  }
);

gltfLoader.load('counter.glb',
  function (gltf)
  {
    leftCounter = gltf.scene;
    leftCounter.scale.set(50, 50, 50);
    leftCounter.position.set(20, 20, -20);
    leftCounterMixer = new THREE.AnimationMixer(leftCounter);
    leftCounterMixer.clipAction(gltf.animations[0]).play();
    scene.add(leftCounter);
  },
  function (xhr){
  },
  function (error){
  }
)

const fieldTexture = new THREE.TextureLoader().load('field.jpg');

const fieldGeometry = new THREE.RoundedBoxGeometry(80, 5, 45, 10, 2);
const fieldMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xFF8000}), // Right (+X)
  new THREE.MeshStandardMaterial({ color: 0xFF8000}), // Left (-X)
  new THREE.MeshStandardMaterial({ map: fieldTexture}), // Top (+Y) with texture and color overlay
  new THREE.MeshStandardMaterial({ color: 0xFF8000}), // Bottom (-Y)
  new THREE.MeshStandardMaterial({ color: 0xFF8000}), // Front (+Z)
  new THREE.MeshStandardMaterial({ color: 0xFF8000})  // Back (-Z)
];

const field = new THREE.Mesh(fieldGeometry, fieldMaterials);

const ballGeometry = new THREE.CylinderGeometry(2, 2, 1, 20, 32);

const ballMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0});

const ball = new THREE.Mesh(ballGeometry, ballMaterial);

ball.position.y = 3;

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

const ambient = new THREE.AmbientLight(0xFFFFFF, 0.3);

const mainSpotLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);

const leftBackLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);

const rightBackLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);

const frontLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);

const backLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);

mainSpotLight.position.set(0, 10, 0);
rightBackLight.position.set(45, 15, 0);
leftBackLight.position.set(-45, 15, 0);
frontLight.position.set(0, 15, 45);
backLight.position.set(-20, 20, 0);

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

objLoader.load('football_goal.obj', function(zort) {
  zort.scale.set(0.09, 0.09, 0.09);
  zort.rotation.set(0, Math.PI / 2, 0);
  zort.position.set(43, 0, 22.6);
  let colorIndex = 0;
  const colors = [0x7E5CAD, 0xFF8000]; // Red, Green, Blue

  zort.traverse(function (child) {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: colors[colorIndex]
      });
      colorIndex++;
    }
  });
  scene.add(zort);
  const zart = zort.clone();
  zart.rotation.set(0, -Math.PI / 2, 0);
  zart.position.set(-43, 0, -22.6);
  scene.add(zart);
});

let leftArrow;
let rightArrow;

objLoader.load('arrow.obj', function(zort) {
    zort.scale.set(0.04, 0.04, 0.07);
    rightArrow = zort;
    rightArrow.position.y = 10;
    rightArrow.rotation.y -= (Math.PI * 90) / 180;
    
    zort.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0x03FC13, roughness: 0
        });
      }
    });
    scene.add(rightArrow);
    leftArrow = rightArrow.clone();
    leftArrow.rotation.y += (Math.PI * 180) / 180;
    leftArrow.position.y = 10;
    leftArrow.position.x = 10;
    leftArrow.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xB310A5, roughness: 0
        });
      }
    });
    scene.add(leftArrow);
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

function leftPlayerShoot()
{
  keepCheckRight = 0;
  keepCheckLeft = 0;
  turnCheckRight = 1;
  turnCheckLeft = 0;
  ballSpeedX = 1.5;
}

function rightPlayerShoot()
{
  keepCheckRight = 0;
  keepCheckLeft = 0;
  turnCheckRight = 0;
  turnCheckLeft = 1;
  ballSpeedX = -1.5;
}

function handlePlayerMovement() {
  if (keys[68] && leftPlayer.position.z <= 14) {
    leftPlayer.position.z += 0.5;
  }
  if (keys[65] && leftPlayer.position.z >= -14) {
    leftPlayer.position.z -= 0.5;
  }
  // Shoot 
  if (keys[38] && keepCheckRight) {
    rightPlayerShoot();
  }
  if (keys[87] && keepCheckLeft) {
    leftPlayerShoot();
  }
  if (keys[37] && rightPlayer.position.z <= 14) {
    rightPlayer.position.z += 0.5;
  }
  if (keys[39] && rightPlayer.position.z >= -14) {
    rightPlayer.position.z -= 0.5;
  }

  if (keys[74])
  {
    rotateAroundBall(leftArrow, 0.1);
  }
  if (keys[75])
    {
      rotateAroundBall(leftArrow, -0.1);
    }
}

function restartGame()
{
  timer = 1;
  countdownActive = true;
  ball.position.set(0, 3, 0);
  leftPlayer.position.set(-36,4,0);
  rightPlayer.position.set(36,4,0);
  startCountdown();
}

let turnCheckRight = 1;
let turnCheckLeft = 1;
let keepCheckRight = 0;
let keepCheckLeft = 0;
let check = 0;

function isHit()
{
  if (ball.position.x < -33 && ball.position.z < leftPlayer.position.z + 7.5 && ball.position.z > leftPlayer.position.z - 7.5 && turnCheckLeft)
  {
    turnCheckLeft = 0;
    turnCheckRight = 1;
    keepCheckLeft = 0;
    return (1);
  }
  if (keepCheckLeft || (ball.position.x < -33 && ball.position.z < leftPlayer.position.z + 7.5 && ball.position.z > leftPlayer.position.z - 7.5 && !turnCheckLeft))
  {
    ballSpeedX = 0;
    ballSpeedZ = 0;
    keepCheckLeft = 1;
    return (3);
  }
  if (ball.position.x > 33 && ball.position.z < rightPlayer.position.z + 7.5 && ball.position.z > rightPlayer.position.z - 7.5 && turnCheckRight)
  {
    turnCheckRight = 0;
    turnCheckLeft = 1;
    keepCheckRight = 0;
    return (1);
  }
  if (keepCheckRight || (ball.position.x > 33 && ball.position.z < rightPlayer.position.z + 7.5 && ball.position.z > rightPlayer.position.z - 7.5 && !turnCheckRight))
  {
    ballSpeedX = 0;
    ballSpeedZ = 0;
    keepCheckRight = 1;
    return (2);
  }
  return (0);
}

function moveBall()
{
  let a = isHit();
  if ((ball.position.z >= 20 || ball.position.z <= -20))
  {
    ballSpeedZ *= -1;
    check = 1;
  }
  if (ball.position.x >= 39 || ball.position.x <= -39)
    restartGame();
  else if (a === 3)
  {
    ball.position.x = leftPlayer.position.x + 3;
    ball.position.z = leftPlayer.position.z;
  }
  else if (a === 2)
  {
    ball.position.x = rightPlayer.position.x - 3;
    ball.position.z = rightPlayer.position.z;
  }
  else if (a === 1)
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
  ball.position.y = 3;
}

function rotateAroundBall(obj, angle)
{
  obj.position.z = ball.position.z;
  obj.position.x = ball.position.x;

  const pivot = {x: ball.position.x, y: ball.position.y, z: ball.position.z};

  obj.position.sub(pivot);

  obj.rotateOnAxis(yAxis, angle);

  obj.position.add(pivot);
}

function moveArrow(arrow)
{
  if (keepCheckLeft)
  {
    scene.add()
    const pivot = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z);

  }
  else if (keepCheckRight)
  {

  }
  else
  {
    scene.remove(leftArrow);
    scene.remove(rightArrow);
  }
}

function animate() {
  requestAnimationFrame(animate);
  if (leftMixer)
    leftMixer.update(0.01);
  if (rightMixer)
    rightMixer.update(0.01);
  if (!countdownActive)
  {
    moveBall();
    handlePlayerMovement();
    controls.update(); // Silinecek
  }
  renderer.render(scene, camera);
}

let countdownActive = true;
let interval;
const countdown = document.getElementById('countdown');
let timer;

function startCountdown() {
  clearInterval(interval);
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
timer = 3;
startCountdown();