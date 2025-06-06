const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(10, 10, 10);
scene.add(light);

const loader = new THREE.TextureLoader();
loader.load('garage_bg.png', function(texture) {
  const bgMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 9),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  bgMesh.position.z = -5;
  scene.add(bgMesh);
});

const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load('hover_car.glb', function(gltf) {
  const model = gltf.scene;
  model.scale.set(1.5, 1.5, 1.5);
  model.position.set(0, -1.5, 0);
  scene.add(model);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    model.position.y = -1.5 + Math.sin(t) * 0.1;
    model.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animate();
});

camera.position.z = 5;