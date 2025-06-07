console.log('REDLININ Garage v1.9.3 - Full Interactive Build');

window.onload = () => {
    // --- App State ---
    const AppState = { menuActive: false, currentCarIndex: 0, selectedIndex: 0 };

    // --- DOM Element Cache ---
    const elements = {
        bootScreen: document.getElementById('boot-screen'), bootText: document.getElementById('boot-text'),
        mainContainer: document.getElementById('main-container'), customCursor: document.getElementById("custom-cursor"),
        scene: document.getElementById("scene"),
        menuContainer: document.getElementById("menu-container"), menuItems: document.querySelectorAll(".menu-item"), menuSelector: document.getElementById("menu-selector"),
        hoverCars: document.querySelectorAll('.hover-car'), switcherLeft: document.getElementById('car-switcher-left'), switcherRight: document.getElementById('car-switcher-right'),
        holographicStats: document.getElementById('holographic-stats'), statGforce: document.getElementById('stat-gforce'), statTemp: document.getElementById('stat-temp'), statOutput: document.getElementById('stat-output'),
        pet1Canvas: document.getElementById('pet-canvas-1'), pet2Canvas: document.getElementById('pet-canvas-2'), petContainer2: document.getElementById('pet-container-2'),
        mothAI: document.getElementById('moth-ai'),
        jukeboxContainer: document.getElementById('jukebox-container'), playPauseBtn: document.getElementById("play-pause"), nextBtn: document.getElementById("next-track"), prevBtn: document.getElementById("prev-track"),
        volumeSlider: document.getElementById("volume-slider"), trackNameEl: document.getElementById("track-name"), rpmNeedle: document.getElementById("rpm-needle"),
        pressStart: document.getElementById('press-start'),
        lockpickContainer: document.getElementById('lockpick-container'), lockpickCanvas: document.getElementById('lockpick-canvas'),
        lockpickKeysContainer: document.getElementById('lockpick-keys'), lockpickMessage: document.getElementById('lockpick-message'),
        lockpickCloseBtn: document.getElementById('lockpick-close'),
        toolbox: document.getElementById('toolbox'),
        sparkingConduit: document.getElementById('sparking-conduit'),
        floorGrate: document.getElementById('floor-grate'),
        lowerLevelView: document.getElementById('lower-level-view'),
        clickableTerminals: document.querySelectorAll('[data-target]')
    };

    // --- Audio ---
    let masterAudioCtx, musicAudio, ambientAudio, sfxHover, sfxSelect, sfxClick, sfxZap;

    function createAudioContext() { if (!masterAudioCtx) masterAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); return masterAudioCtx; }
    
    function createSound(type) {
        const audioCtx = createAudioContext();
        return () => {
            if (!audioCtx) return;
            let osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            switch (type) {
                case 'hover': osc.type = 'triangle'; osc.frequency.setValueAtTime(440, 0); gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1); break;
                case 'select': osc.type = 'sine'; osc.frequency.setValueAtTime(660, 0); gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2); break;
                case 'click': osc.type = 'sine'; osc.frequency.setValueAtTime(1000, 0); gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05); break;
                case 'zap': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(50, 0); osc.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.1); gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1); break;
            }
            osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.3);
        };
    }

    // --- Modules ---
    const BootSequence = {
        lines: [ "LEMIVICE BIOS v1.9.3", "...", "Memory Check: OK", "...", "Loading REDLININ' OS...", "..." ],
        run() {
            let i = 0;
            const interval = setInterval(() => {
                if (i < this.lines.length) {
                    elements.bootText.innerHTML += this.lines[i] + "\n"; i++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        elements.bootScreen.style.transition = 'opacity 1s';
                        elements.bootScreen.style.opacity = '0';
                        setTimeout(() => {
                            elements.bootScreen.classList.add('hidden');
                            elements.mainContainer.classList.remove('hidden');
                            setTimeout(() => {
                                elements.mainContainer.classList.add('visible');
                                elements.pressStart.classList.remove('hidden');
                                elements.customCursor.classList.add('visible');
                                document.addEventListener("keydown", activateStart, { once: true });
                                document.addEventListener("click", activateStart, { once: true });
                            }, 50);
                        }, 1000);
                    }, 500);
                }
            }, 300);
        }
    };
    
    const Hangar = {
        vehicleStats: [
            { gforce: '12.8', temp: '4800', output: '1.21' }, { gforce: '10.2', temp: '4500', output: '1.05' },
            { gforce: '15.5', temp: '5200', output: '1.55' }, { gforce: '14.1', temp: '5000', output: '1.48' },
        ],
        switchCar(direction) {
            elements.hoverCars[AppState.currentCarIndex].classList.remove('active');
            elements.holographicStats.classList.remove('visible');
            if (direction === 'right') { AppState.currentCarIndex = (AppState.currentCarIndex + 1) % elements.hoverCars.length; } 
            else { AppState.currentCarIndex = (AppState.currentCarIndex - 1 + elements.hoverCars.length) % elements.hoverCars.length; }
            elements.hoverCars[AppState.currentCarIndex].classList.add('active');
            setTimeout(() => this.updateStats(), 100);
        },
        updateStats() {
            const stats = this.vehicleStats[AppState.currentCarIndex];
            elements.statGforce.textContent = stats.gforce; elements.statTemp.textContent = stats.temp; elements.statOutput.textContent = stats.output;
            elements.holographicStats.classList.add('visible');
        }
    };

    const LockpickGame = {
        ctx: elements.lockpickCanvas.getContext('2d'),
        isActive: false, rings: [], keys: [], currentRingIndex: 0, selectedKeyIndex: 0, playerRotation: 0,
        generateProblem(difficulty) { /* ... same logic ... */ },
        start() { this.isActive = true; this.generateProblem(2); elements.lockpickContainer.classList.remove('hidden'); this.renderKeys(); this.draw(); elements.lockpickMessage.textContent = "Align key and press [SPACE]"; },
        stop() { this.isActive = false; elements.lockpickContainer.classList.add('hidden'); },
        renderKeys() { /* ... same logic ... */ },
        drawKey(ctx, key, scale) { /* ... same logic ... */ },
        draw() { /* ... same logic ... */ },
        attemptSlot() { /* ... same logic ... */ },
        handleInput(e) { if(!this.isActive) return; /* ... same logic ... */ }
    };
    
    // --- Main Activation ---
    function activateStart() {
        if (AppState.menuActive) return; AppState.menuActive = true;
        sfxHover = createSound('hover'); sfxSelect = createSound('select'); sfxClick = createSound('click'); sfxZap = createSound('zap');
        // Jukebox.setup(); Jukebox.playTrack();
        // DigitalPet.animate();
        elements.pressStart.style.opacity = '0';
        setTimeout(() => elements.pressStart.classList.add('hidden'), 500);
        elements.menuContainer.classList.add('visible');
        elements.switcherLeft.classList.remove('hidden');
        elements.switcherRight.classList.remove('hidden');
        Hangar.updateStats();
        addInteractiveListeners();
        // setInterval(MothAI.move, 8000); MothAI.move();
    }

    function addInteractiveListeners() {
        elements.toolbox.addEventListener('click', () => LockpickGame.start());
        elements.lockpickCloseBtn.addEventListener('click', () => LockpickGame.stop());
        document.addEventListener('keydown', (e) => LockpickGame.handleInput(e));
        elements.switcherLeft.addEventListener('click', (e) => { e.stopPropagation(); sfxClick(); Hangar.switchCar('left'); });
        elements.switcherRight.addEventListener('click', (e) => { e.stopPropagation(); sfxClick(); Hangar.switchCar('right'); });
        elements.sparkingConduit.addEventListener('click', () => {
            sfxZap();
            document.body.classList.add('flicker');
            setTimeout(() => document.body.classList.remove('flicker'), 600);
        });
        elements.floorGrate.addEventListener('click', () => {
            elements.lowerLevelView.classList.remove('hidden');
            setTimeout(() => elements.lowerLevelView.classList.add('hidden'), 2000);
        });
    }

    // --- Initial Entry Point ---
    BootSequence.run();
};
