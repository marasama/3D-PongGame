// import * as THREE from 'three';  // Import Three.js library

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
camera.position.setY(50);

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


let robot_dance;
let robot_idle;
let robot_spin;
let robotAnimations;
let leftScoreKeeperAnimations;
gltfLoader.load('flying_robot.glb',
  function (gltf) {
    leftScoreKeeper = gltf.scene;

    leftScoreKeeper.traverse((node) => {
      if (node.isMesh) 
      {
        const originalMaterial = node.material;
        if (node.name === 'Object_13' 
          || node.name === 'Object_7' 
          || node.name === 'Object_9' 
          || node.name === 'Object_11')
          return;
        const clonedMaterial = new THREE.MeshStandardMaterial({
          map: originalMaterial.map,             
          emissiveMap: originalMaterial.emissiveMap,
          normalMap: originalMaterial.normalMap, 
          color: originalMaterial.color,
          emissive: originalMaterial.color.clone().multiplyScalar(0.08),
          roughness: originalMaterial.roughness,
          metalness: 0, 
        });
        node.material = clonedMaterial;
      }
    });
    leftScoreKeeper.scale.set(20, 20, 20);
    leftScoreKeeper.position.set(-20, 10, -30);
    robot_dance = gltf.animations[6];
    robotAnimations = gltf.animations;
    leftMixer = new THREE.AnimationMixer(leftScoreKeeper);
    leftMixer.clipAction(gltf.animations[1]).play();
    scene.add(leftScoreKeeper);
  }
);

gltfLoader.load('flying_robot.glb',
  function (gltf) {
    rightScoreKeeper = gltf.scene;

    rightScoreKeeper.traverse((node) => {
      if (node.isMesh) 
      {
        const originalMaterial = node.material;
        if (node.name === 'Object_13' 
          || node.name === 'Object_7' 
          || node.name === 'Object_9' 
          || node.name === 'Object_11')
          return;
        const clonedMaterial = new THREE.MeshStandardMaterial({
          map: originalMaterial.map,             
          emissiveMap: originalMaterial.emissiveMap,
          normalMap: originalMaterial.normalMap, 
          color: originalMaterial.color,
          emissive: originalMaterial.color.clone().multiplyScalar(0.08),
          roughness: originalMaterial.roughness,
          metalness: 0, 
        });
        node.material = clonedMaterial;
      }
    });
    rightScoreKeeper.scale.set(20, 20, 20);
    rightScoreKeeper.position.set(20, 10, -30);
    robot_dance = gltf.animations[6];
    rightMixer = new THREE.AnimationMixer(rightScoreKeeper);
    rightMixer.clipAction(gltf.animations[1]).play();
    console.log(gltf.animations);
    scene.add(rightScoreKeeper);
  }
);

gltfLoader.load('counter.glb',
  function (gltf)
  {
    leftCounter = gltf.scene;
    leftCounter.traverse((node) => {
      if (node.isMesh) 
      {
        const originalMaterial = node.material;
        const clonedMaterial = new THREE.MeshStandardMaterial({
          map: originalMaterial.map,             
          emissiveMap: originalMaterial.emissiveMap,
          normalMap: originalMaterial.normalMap, 
          color: originalMaterial.color,
          emissive: originalMaterial.color.clone().multiplyScalar(0.08),
          roughness: originalMaterial.roughness,
          metalness: 0, 
        });
        node.material = clonedMaterial;
      }
    });
    leftCounter.scale.set(0.06, 0.06, 0.06);
    leftCounter.position.set(-6, 20, -15);
    leftCounterMixer = new THREE.AnimationMixer(leftCounter);
    leftCounterMixer.clipAction(gltf.animations[0]).play();
    scene.add(leftCounter);
  }
)

gltfLoader.load('counter.glb',
  function (gltf)
  {
    rightCounter = gltf.scene;
    rightCounter.traverse((node) => {
      if (node.isMesh) 
      {
        const originalMaterial = node.material;
        const clonedMaterial = new THREE.MeshStandardMaterial({
          map: originalMaterial.map,             
          emissiveMap: originalMaterial.emissiveMap,
          normalMap: originalMaterial.normalMap, 
          color: originalMaterial.color,
          emissive: originalMaterial.color.clone().multiplyScalar(0.08),
          roughness: originalMaterial.roughness,
          metalness: 0, 
        });
        node.material = clonedMaterial;
      }
    });
    rightCounter.scale.set(0.06, 0.06, 0.06);
    rightCounter.position.set(6, 20, -15);
    rightCounterMixer = new THREE.AnimationMixer(rightCounter);
    rightCounterMixer.clipAction(gltf.animations[0]).play();
    scene.add(rightCounter);
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
/* 
const ballGeometry = new THREE.CylinderGeometry(2, 2, 1, 20, 32);

const ballMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0});

const ball = new THREE.Mesh(ballGeometry, ballMaterial); */
const fireVertexShader = `
uniform float time;
varying vec2 vUv;

float noise(vec2 p) {
    return sin(p.x * 43758.5453 + p.y * 12345.6789);
}

void main() {
    vUv = uv;

    // Apply noise to the vertex position for turbulence
    vec3 newPosition = position;
    
    // Add noise to the Y-axis to simulate flickering in the fire's shape
    // newPosition.y += noise(uv * 10.0 + time * 2.0) * 0.4;

    // Apply the transformation
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;
const fireFragmentShader = `
uniform float time;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    float brightness = sin(uv.y * 10.0 + time * 5.0) * 0.5 + 0.5;
    float intensity = smoothstep(0.3, 1.0, brightness);

    vec3 color = mix(vec3(1.0, 0.4, 0.1), vec3(1.0, 0.9, 0.9), intensity); // Fire gradient
    gl_FragColor = vec4(color, 1.0);
}
`;

const fireMaterial = new THREE.ShaderMaterial({
    vertexShader: fireVertexShader,
    fragmentShader: fireFragmentShader,
    uniforms: {
        time: { value: 0.0 },
    },
});

const ballGeometry = new THREE.CylinderGeometry(2, 2, 1, 16, 1);
const ball = new THREE.Mesh(ballGeometry, fireMaterial);
ball.position.y = 6;

scene.add(ball);

function getStartingSpeed() {
  const range = Math.random() < 0.5 ? [0.2, 0.3] : [-0.3, -0.2];

  return Math.random() * (range[0] - range[1]) + range[0];
}

let ballSpeedX;
let ballSpeedZ;

const rightPlayerGeometry = new THREE.RoundedBoxGeometry(2, 3, 7.5, 10, 0.5);

const rightPlayerMaterial = new THREE.MeshStandardMaterial( { color: 0xFF64FF, roughness: 0, metalness: 0.1 });

const rightPlayer = new THREE.Mesh(rightPlayerGeometry, rightPlayerMaterial);

rightPlayer.position.setY(4);
rightPlayer.position.setX(36);

const leftPlayerGeometry =  new THREE.RoundedBoxGeometry(2, 3, 7.5, 10, 0.5);

const leftPlayerMaterial = new THREE.MeshStandardMaterial( { color: 0xFFFB64, roughness: 0, metalness: 0.1 });

const leftPlayer = new THREE.Mesh(leftPlayerGeometry, leftPlayerMaterial);

leftPlayer.position.setY(4);
leftPlayer.position.setX(-36);

const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);

const mainSpotLight = new THREE.DirectionalLight(0xFFFFFF, 0.4);

const leftBackLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);

const rightBackLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);

const frontLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);

const backLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);

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

objLoader.load('football_goal.obj', function(zort) {
  zort.scale.set(0.05, 0.05, 0.05);
  zort.rotation.set(0, Math.PI / 2, 0);
  zort.position.set(43, 0, 13.5);
  let colorIndex = 0;
  const colors = [0x7E5CAD, 0xFF8000];

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
  zart.position.set(-43, 0, -13.5);
  scene.add(zart);
});

let leftArrow;
let rightArrow;

objLoader.load('arrow.obj', function(zort) {
    zort.scale.set(0.04, 0.04, 0.09);
    rightArrow = zort;
    rightArrow.position.y = 6;
    zort.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xB310A5, roughness: 0
        });
      }
    });
    scene
    leftArrow = rightArrow.clone();
    leftArrow.position.y = 6;
    leftArrow.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0x03FC13, roughness: 0
        });
      }
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
  ballSpeedX = (leftArrow.position.x - ball.position.x) / 6;
  ballSpeedZ = (leftArrow.position.z - ball.position.z) / 6;
  if (arrowAvailable)
  {
    scene.remove(leftArrow);
    arrowAvailable = false;
  }
}

function rightPlayerShoot()
{
  keepCheckRight = 0;
  keepCheckLeft = 0;
  turnCheckRight = 0;
  turnCheckLeft = 1;
  ballSpeedX = (rightArrow.position.x - ball.position.x) / 6;
  ballSpeedZ = (rightArrow.position.z - ball.position.z) / 6;
  if (arrowAvailable)
  {
    scene.remove(rightArrow);
    arrowAvailable = false;
  }
}

function handlePlayerMovement() {
  if (keys[68] && leftPlayer.position.z <= 17.75) {
    leftPlayer.position.z += 0.9;
  }
  if (keys[65] && leftPlayer.position.z >= -17.75) {
    leftPlayer.position.z -= 0.9;
  }
  if (keys[38] && keepCheckRight) {
    rightPlayerShoot();
  }
  if (keys[87] && keepCheckLeft) {
    leftPlayerShoot();
  }
  if (keys[37] && rightPlayer.position.z <= 17.75) {
    rightPlayer.position.z += 0.9;
  }
  if (keys[39] && rightPlayer.position.z >= -17.75) {
    rightPlayer.position.z -= 0.9;
  }
}

let score = 'none';
let counterFrameCount = 0;
let robotAnimationCount = 0;

function restartGame()
{
  if (ball.position.x >= 39)
  {
    leftMixer.clipAction(robotAnimations[3]).play();
    leftScore++;
    score = 'left';
  }
  else
  {
    rightMixer.clipAction(robotAnimations[3]).play();
    rightScore++;
    score = 'right';
  }
  for (let key in keys) {
    keys[key] = false;
  }
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
let arrowAvailable = false;

function isHit()
{
  if (ball.position.x > 36 && (ball.position.z > 10 || ball.position.z < -10))
  {
    turnCheckLeft = 1;
    turnCheckRight = 0;
    keepCheckLeft = 0;
    return (1);
  }
  if (ball.position.x < -36 && (ball.position.z > 10 || ball.position.z < -10))
  {
    turnCheckLeft = 0;
    turnCheckRight = 1;
    keepCheckRight = 0;
    return (1);
  }
  if (ball.position.x < -32 && ball.position.z < leftPlayer.position.z + 3.75 && ball.position.z > leftPlayer.position.z - 3.75 && turnCheckLeft)
  {
    turnCheckLeft = 0;
    turnCheckRight = 1;
    keepCheckLeft = 0;
    return (1);
  }
  if (keepCheckLeft || (ball.position.x < -32 && ball.position.z < leftPlayer.position.z + 3.75 && ball.position.z > leftPlayer.position.z - 3.75 && !turnCheckLeft))
  {
    ballSpeedX = 0;
    ballSpeedZ = 0;
    keepCheckLeft = 1;
    if (!arrowAvailable)
    {
      scene.add(leftArrow);
      arrowAvailable = true;
    }
    return (3);
  }
  if (ball.position.x > 32 && ball.position.z < rightPlayer.position.z + 3.75 && ball.position.z > rightPlayer.position.z - 3.75 && turnCheckRight)
  {
    turnCheckRight = 0;
    turnCheckLeft = 1;
    keepCheckRight = 0;
    return (1);
  }
  if (keepCheckRight || (ball.position.x > 32 && ball.position.z < rightPlayer.position.z + 3.75 && ball.position.z > rightPlayer.position.z - 3.75 && !turnCheckRight))
  {
    ballSpeedX = 0;
    ballSpeedZ = 0;
    keepCheckRight = 1;
    if (!arrowAvailable)
    {
      scene.add(rightArrow);
      arrowAvailable = true;
    }
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
  if ((ball.position.x >= 39 || ball.position.x <= -39) && (ball.position.z < 10 && ball.position.z > -10))
    restartGame();
  else if (a === 3)
  {
    ball.position.x = leftPlayer.position.x + 5;
    ball.position.z = leftPlayer.position.z;
    if (Math.abs(leftArrowAngle) > 1.2)
      angleConst *= -1;
    rotateAroundBall(leftArrow, leftArrowAngle, 10);
    leftArrowAngle += angleConst;
  }
  else if (a === 2)
  {
    ball.position.x = rightPlayer.position.x - 5;
    ball.position.z = rightPlayer.position.z;
    if (Math.abs(rightArrowAngle) > 1.2)
      angleConst *= -1;
    rotateAroundBall(rightArrow, rightArrowAngle, -10);
    rightArrowAngle += angleConst;
  }
  else if (a === 1)
  {
    ballSpeedX *= -1;
    ballSpeedX += (ballSpeedX / Math.abs(ballSpeedX)) / 20;
    ballSpeedZ += (ballSpeedZ / Math.abs(ballSpeedZ)) / 20;
  }
  ball.position.x += ballSpeedX;
  ball.position.z += ballSpeedZ;
}

function rotateAroundBall(obj, angle, radius)
{
  const pivot = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z);

  const x = pivot.x + radius * Math.cos(angle);
  const z = pivot.z + radius * Math.sin(angle);

  obj.position.set(x, ball.position.y, z);

  obj.lookAt(pivot);
}

let leftArrowAngle = 0;
let rightArrowAngle = 0;
let angleConst = 0.06;

function counterAnimation()
{
  if (score == 'left' && counterFrameCount <= 100 && leftCounterMixer)
  {
    leftCounterMixer.update(0.01);
    counterFrameCount++;
  }
  else if (score == 'right' && counterFrameCount <= 100 && rightCounterMixer)
  {
    rightCounterMixer.update(0.01);
    counterFrameCount++;
  }
  else
  {
    score = 'none'
    counterFrameCount = 0;
  }
}

function animations()
{
  counterAnimation();
  if (leftMixer)
    leftMixer.update(0.01);
  if (rightMixer)
    rightMixer.update(0.01);
}

let isPaused = 0;

document.getElementById("pauseButton").addEventListener("click", () => {
  isPaused = !isPaused; // Toggle the pause state
  if (isPaused) {
    document.getElementById("pauseButton").textContent = "Resume";
    pauseGame();
  } else {
    document.getElementById("pauseButton").textContent = "Pause";
    resumeGame();
  }
});

function pauseGame() {
  cancelAnimationFrame(animate);
}

function resumeGame() {
  animate();
}

function animate() {
  if (!isPaused)
  {
    requestAnimationFrame(animate);
    animations();
    if (!countdownActive)
      {
        moveBall();
        handlePlayerMovement();
        controls.update();
      }
    fireMaterial.uniforms.time.value += 0.02;
    renderer.render(scene, camera);
  }
}

let countdownActive = true;
let interval;
const countdown = document.getElementById('countdown');
let timer;

function startCountdown() {
  clearInterval(interval);
  ballSpeedX = getStartingSpeed();
  ballSpeedZ = getStartingSpeed();
  countdown.textContent = timer;
  document.getElementById('countdown').style.display = 'flex';
  interval = setInterval(() => {
    countdown.textContent = timer;
    if (timer === 0)
        countdown.textContent = 'START';
    if (timer === -1)
    {
      leftMixer.clipAction(robotAnimations[1]).play();
      rightMixer.clipAction(robotAnimations[1]).play();
      clearInterval(interval); 
      document.getElementById('countdown').style.display = 'none';
      countdownActive = false; 
    }

    timer--;
  }, 1000);
}

animate();
timer = 3;
startCountdown();