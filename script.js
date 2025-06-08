console.log('REDLININ Garage v2.0.0 - 3D Hangar Build');

window.onload = () => {
    // --- App State & DOM Cache ---
    const AppState = { menuActive: false };
    const elements = {
        bootScreen: document.getElementById('boot-screen'),
        bootText: document.getElementById('boot-text'),
        mainUI: document.getElementById('main-ui-container'),
        mainContent: document.getElementById('main-content'),
        pressStart: document.getElementById('press-start'),
        // ... cache other UI elements like menu, jukebox etc. here
    };

    // --- 3D Hangar Module ---
    const ThreeJS_Hangar = {
        scene: null, camera: null, renderer: null, model: null, controls: null,
        
        init() {
            // Scene Setup
            this.scene = new THREE.Scene();
            
            // Background
            const bgTexture = new THREE.TextureLoader().load('garage_bg.png');
            this.scene.background = bgTexture;
            
            // Renderer
            const canvas = document.getElementById('3d-canvas');
            this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);

            // Camera
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.z = 5;

            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 10, 7.5);
            this.scene.add(directionalLight);

            // GLTF Loader
            const loader = new THREE.GLTFLoader();
            loader.load(
                'hover_car.glb',
                (gltf) => {
                    this.model = gltf.scene;
                    this.model.scale.set(2.5, 2.5, 2.5); // Adjust scale as needed
                    this.model.position.y = -1; // Adjust vertical position
                    this.scene.add(this.model);
                    console.log("3D Model loaded successfully.");
                },
                undefined, // onProgress callback (optional)
                (error) => {
                    console.error('An error happened while loading the 3D model:', error);
                }
            );

            // Orbit Controls (for debugging camera placement)
            // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

            // Start animation loop
            this.animate();

            // Handle window resizing
            window.addEventListener('resize', () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            });
        },

        animate() {
            requestAnimationFrame(() => this.animate());
            
            // Floating animation
            if (this.model) {
                const time = Date.now() * 0.0005;
                this.model.rotation.y = time;
                this.model.position.y = -1 + Math.sin(time * 2) * 0.1;
            }

            // if (this.controls) this.controls.update();
            this.renderer.render(this.scene, this.camera);
        }
    };

    // --- Main Activation Flow ---
    function activateStart() {
        if (AppState.menuActive) return;
        AppState.menuActive = true;
        
        elements.pressStart.style.opacity = '0';
        setTimeout(() => elements.pressStart.classList.add('hidden'), 500);

        // Initialize and start all other modules (Jukebox, Pet, etc.) here
        console.log("Main UI Activated");
    }

    const BootSequence = {
        lines: [ "LEMIVICE BIOS v2.0.0", "...", "Loading 3D Environment...", "OK", "Executing LEMIVICE.EXE", "..." ],
        run() {
            let i = 0;
            const interval = setInterval(() => {
                if (i < this.lines.length) {
                    elements.bootText.innerHTML += this.lines[i] + "\n";
                    i++;
                } else {
                    clearInterval(interval);
                    // Initialize the 3D scene during the boot fade
                    ThreeJS_Hangar.init();
                    setTimeout(() => {
                        elements.bootScreen.style.transition = 'opacity 1s';
                        elements.bootScreen.style.opacity = '0';
                        setTimeout(() => {
                            elements.bootScreen.classList.add('hidden');
                            elements.mainContent.classList.remove('hidden');
                            setTimeout(() => {
                                elements.mainContent.classList.add('visible');
                                document.addEventListener("keydown", activateStart, { once: true });
                                document.addEventListener("click", activateStart, { once: true });
                            }, 50);
                        }, 1000);
                    }, 500);
                }
            }, 300);
        }
    };

    BootSequence.run();
};
