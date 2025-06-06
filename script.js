
import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 4);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(2, 3, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

const loader = new GLTFLoader();
let car;
loader.load('hover_car.glb', (gltf) => {
    car = gltf.scene;
    car.scale.set(1.2, 1.2, 1.2);
    car.position.set(0, 0.1, 0);
    scene.add(car);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    let t = clock.getElapsedTime();
    if (car) {
        car.rotation.y = t * 0.5;
        car.position.y = 0.1 + Math.sin(t * 2) * 0.05;
    }
    renderer.render(scene, camera);
}
animate();
