import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadLevel } from './level.js';
import { initAudio, playSound } from './audio.js';

let scene, camera, renderer, controls;
let gameStarted = false;

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 10, 50);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 8, 10);

    // Renderer
    const canvas = document.querySelector('#bg');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    // Load Level
    loadLevel(scene, '/level.json');
    
    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    startButton.addEventListener('click', () => {
        startMenu.classList.add('hidden');
        gameStarted = true;
        initAudio();
        playSound('start_game.mp3');
        animate();
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    if (!gameStarted) return;
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();

