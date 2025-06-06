
let scene, camera, renderer, car;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  loader.load('hover_car.glb', function (gltf) {
    car = gltf.scene;
    car.scale.set(1.2, 1.2, 1.2);
    car.position.set(0, -0.5, 0);
    scene.add(car);
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (car) {
    car.rotation.y += 0.01;
    car.position.y = Math.sin(Date.now() * 0.002) * 0.05 - 0.5;
  }
  renderer.render(scene, camera);
}

window.addEventListener('load', init);
