console.log('REDLININ Garage v1.9.3 - Full Interactive Build');

// The main function that runs after the entire page is loaded
window.onload = () => {
    // --- App State ---
    const AppState = { menuActive: false, currentCarIndex: 0, selectedIndex: 0 };

    // --- DOM Element Cache ---
    const elements = {
        bootScreen: document.getElementById('boot-screen'), bootText: document.getElementById('boot-text'),
        mainContainer: document.getElementById('main-container'), customCursor: document.getElementById("custom-cursor"),
        menuContainer: document.getElementById("menu-container"), menuItems: document.querySelectorAll(".menu-item"), menuSelector: document.getElementById("menu-selector"),
        hoverCars: document.querySelectorAll('.hover-car'), switcherLeft: document.getElementById('car-switcher-left'), switcherRight: document.getElementById('car-switcher-right'),
        pet1Canvas: document.getElementById('pet-canvas-1'), pet2Canvas: document.getElementById('pet-canvas-2'), petContainer2: document.getElementById('pet-container-2'),
        mothAI: document.getElementById('moth-ai'),
        jukeboxContainer: document.getElementById('jukebox-container'), playPauseBtn: document.getElementById("play-pause"), nextBtn: document.getElementById("next-track"), prevBtn: document.getElementById("prev-track"),
        volumeSlider: document.getElementById("volume-slider"), trackNameEl: document.getElementById("track-name"), rpmNeedle: document.getElementById("rpm-needle"),
        pressStart: document.getElementById('press-start'),
        lockpickContainer: document.getElementById('lockpick-container'), lockpickCanvas: document.getElementById('lockpick-canvas'),
        lockpickKeysContainer: document.getElementById('lockpick-keys'), lockpickMessage: document.getElementById('lockpick-message'),
        lockpickCloseBtn: document.getElementById('lockpick-close'), toolbox: document.getElementById('toolbox')
    };

    // --- Audio ---
    let masterAudioCtx, musicAudio, sfxHover, sfxSelect, sfxClick;
    function createAudioContext() { if (!masterAudioCtx) masterAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); return masterAudioCtx; }
    function createSound(type) { /* ... same sound creation logic as before ... */ }
    
    // --- Modules (BootSequence, Hangar, DigitalPet, LockpickGame, Jukebox, etc.) ---
    const BootSequence = {
        lines: [ "LEMIVICE BIOS v1.9.3", "...", "Memory Check: OK", "...", "Loading REDLININ' OS...", "..." ],
        run() { /* ... same as before ... */ }
    };
    
    const Hangar = {
        switchCar(direction) { /* ... same as before ... */ }
    };

    const LockpickGame = {
        ctx: elements.lockpickCanvas.getContext('2d'),
        isActive: false, rings: [], keys: [], currentRingIndex: 0, selectedKeyIndex: 0, playerRotation: 0,
        generateProblem(difficulty) { /* ... same logic ... */ },
        start() { /* ... same logic ... */ },
        stop() { /* ... same logic ... */ },
        renderKeys() { /* ... same logic ... */ },
        drawKey(ctx, key, scale) { /* ... same logic ... */ },
        draw() { /* ... same logic ... */ },
        attemptSlot() { /* ... same logic ... */ },
        handleInput(e) { /* ... same logic ... */ }
    };
    
    // --- Main Activation ---
    function activateStart() {
        if (AppState.menuActive) return;
        AppState.menuActive = true;
        
        sfxHover = createSound('hover');
        sfxSelect = createSound('select');
        sfxClick = createSound('click');
        
        // Jukebox.setup(); Jukebox.playTrack();
        // DigitalPet.animate();
        
        elements.pressStart.style.opacity = '0';
        setTimeout(() => elements.pressStart.classList.add('hidden'), 500);
        
        elements.menuContainer.classList.add('visible');
        elements.switcherLeft.classList.remove('hidden');
        elements.switcherRight.classList.remove('hidden');
        
        addInteractiveListeners();
        // setInterval(MothAI.move, 8000); MothAI.move();
    }

    function addInteractiveListeners() {
        elements.toolbox.addEventListener('click', () => LockpickGame.start());
        elements.lockpickCloseBtn.addEventListener('click', () => LockpickGame.stop());
        document.addEventListener('keydown', (e) => LockpickGame.handleInput(e));
        // ... all other listeners ...
    }

    // --- Initial Entry Point ---
    BootSequence.run();
};
