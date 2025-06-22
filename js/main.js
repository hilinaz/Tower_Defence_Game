import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createGround } from "./ground.js";
import { createPath, pathPoints } from "./path.js";
import { createTower, updateTowers } from "./towers.js";
import { createEnemies, animateEnemies } from "./enemies.js";
import { createParticleSystem } from "./utils.js";
import { createVillage, getObstacles } from "./village.js";
import * as gameState from "./gameState.js";

let scene, camera, renderer, controls;
let lastTime = performance.now();
let skyMat = null;
let highlightedTile = null;
const towers = [];
const enemies = [];
let obstacles = [];

const directions = [
    { spawn: [-15, 0], end: [15, 0] }, // Left to Right
    { spawn: [15, 0], end: [-15, 0] }, // Right to Left
    { spawn: [0, -15], end: [0, 15] }, // Bottom to Top
    { spawn: [0, 15], end: [0, -15] }  // Top to Bottom
];

function updateUI() {
    gameState.updateUI();
}

function startWave() {
    const enemyCount = 5 + gameState.getCurrentWave() * 2;
    const enemySpeed = 0.04 + gameState.getCurrentWave() * 0.005;
    // Randomly pick a direction for this wave
    const dir = directions[Math.floor(Math.random() * directions.length)];
    createEnemies(scene, enemyCount, enemySpeed, dir.spawn, dir.end, enemies, gameState.getCurrentWave());
}

function setupInteraction() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        let foundGround = false;
        for (let i = 0; i < intersects.length; i++) {
            const intersectedObject = intersects[i].object;
            if (intersectedObject.userData.isGround) {
                foundGround = true;
                const snappedX = Math.round(intersects[i].point.x / 3) * 3;
                const snappedZ = Math.round(intersects[i].point.z / 3) * 3;
                const highlightPosition = new THREE.Vector3(snappedX, 0.1, snappedZ);
                if (highlightedTile && highlightedTile.position.equals(highlightPosition)) {
                    return;
                }
                if (highlightedTile) {
                    scene.remove(highlightedTile);
                    highlightedTile = null;
                }
                const isOnPath = pathPoints.some((pathPoint, index) => {
                    if (index < pathPoints.length - 1) {
                        const start = pathPoints[index];
                        const end = pathPoints[index + 1];
                        const segmentCenter = new THREE.Vector3().lerpVectors(start, end, 0.5);
                        const angle = Math.atan2(end.x - start.x, end.z - start.z);
                        const localX = (highlightPosition.x - segmentCenter.x) * Math.cos(angle) - (highlightPosition.z - segmentCenter.z) * Math.sin(angle);
                        const localZ = (highlightPosition.x - segmentCenter.x) * Math.sin(angle) + (highlightPosition.z - segmentCenter.z) * Math.cos(angle);
                        return Math.abs(localX) < 1.5 && Math.abs(localZ) < start.distanceTo(end) / 2 + 1;
                    }
                    return false;
                });
                const existingTowerAtHover = towers.find(t =>
                    Math.abs(t.position.x - snappedX) < 0.1 &&
                    Math.abs(t.position.z - snappedZ) < 0.1
                );
                let color = 0x00ff00;
                if (isOnPath || existingTowerAtHover) color = 0xff0000;
                const highlightGeo = new THREE.PlaneGeometry(3, 3);
                const highlightMat = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                });
                highlightedTile = new THREE.Mesh(highlightGeo, highlightMat);
                highlightedTile.rotation.x = -Math.PI / 2;
                highlightedTile.position.copy(highlightPosition);
                scene.add(highlightedTile);
                break;
            }
        }
        if (!foundGround && highlightedTile) {
            scene.remove(highlightedTile);
            highlightedTile = null;
        }
    }
    function onCanvasClick(event) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        for (let i = 0; i < intersects.length; i++) {
            const intersectedObject = intersects[i].object;
            if (intersectedObject.userData.isGround) {
                const point = intersects[i].point;
                createTower(scene, point, towers);
                break;
            }
        }
    }

    window.addEventListener('mousemove', onMouseMove, false);
    document.getElementById('gameCanvas').addEventListener('click', onCanvasClick, false);

    document.getElementById('startWaveBtn').addEventListener('click', () => {
        if (enemies.length === 0 && gameState.isGameRunning()) {
            gameState.nextWave();
            startWave();
        }
    });
    document.getElementById('resetGameBtn').addEventListener('click', () => {
        gameState.resetGame(scene, enemies, towers);
        startWave();
        animate();
    });
    document.getElementById('modalCloseBtn').addEventListener('click', () => {
        gameState.resetGame(scene, enemies, towers);
        startWave();
        animate();
    });
}

function createBackground(scene) {
    const skyGeo = new THREE.PlaneGeometry(250, 250);
    skyMat = new THREE.ShaderMaterial({
        uniforms: {
            color1: { value: new THREE.Color(0xb3e5fc) },
            color2: { value: new THREE.Color(0x1976d2) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            void main() {
                gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            }
        `,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.position.set(0, 75, -120);
    sky.rotation.x = -Math.PI / 2.5;
    scene.add(sky);
}

function initScene() {
    gameState.setupGameState();
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcce0ff, 50, 150);
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        200
    );
    camera.position.set(20, 25, 30);
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("gameCanvas"),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    const ambient = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambient);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    scene.add(directionalLight);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 15;
    controls.maxDistance = 70;
    controls.target.set(0, 5, 0);
    controls.update();
    createBackground(scene);
    createVillage(scene);
    obstacles = getObstacles(scene);
    createGround(scene);
    createPath(scene);
    setupInteraction();
    window.addEventListener('resize', onWindowResize, false);
    document.getElementById('gameModal').style.display = 'none';
    gameState.updateUI();
    startWave();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export function animate() {
    if (!gameState.isGameRunning()) return;
    window._gameAnimFrame = requestAnimationFrame(animate);
    const now = performance.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;
    animateEnemies(
        scene,
        deltaTime,
        enemies,
        gameState.decreaseHealth,
        gameState.nextWave,
        startWave,
        gameState.getPlayerHealth(),
        gameState.isGameRunning(),
        gameState.getCurrentWave(),
        towers,
        createParticleSystem,
        obstacles
    );
    updateTowers(scene, camera, deltaTime, towers, enemies, createParticleSystem);
    controls.update();
    if (skyMat) {
        const t = now * 0.0002;
        skyMat.uniforms.color1.value.setHSL(0.55 + 0.1 * Math.sin(t), 0.6, 0.8);
        skyMat.uniforms.color2.value.setHSL(0.6 + 0.1 * Math.cos(t), 0.7, 0.5);
    }
    renderer.render(scene, camera);
}

initScene();
animate(); 