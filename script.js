
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, car;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load('hover_car.glb', function(gltf) {
        car = gltf.scene;
        car.scale.set(2, 2, 2);
        car.position.y = -1;
        scene.add(car);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (car) {
        car.rotation.y += 0.01;
        car.position.y = Math.sin(Date.now() * 0.002) * 0.05 - 1;
    }
    renderer.render(scene, camera);
}

window.addEventListener('load', init);
