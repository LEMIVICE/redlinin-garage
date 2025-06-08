console.log('REDLININ Garage v1.9.7 - Full Interactive Build');

window.onload = () => {
    // --- App State ---
    const AppState = { menuActive: false, currentCarIndex: 0, selectedIndex: 0 };

    // --- DOM Element Cache ---
    const elements = {
        bootScreen: document.getElementById('boot-screen'), bootText: document.getElementById('boot-text'),
        mainContainer: document.getElementById('main-container'), customCursor: document.getElementById("custom-cursor"),
        scene: document.getElementById("scene"),
        menuContainer: document.getElementById("menu-container"), menuItems: document.querySelectorAll(".menu-item"), menuSelector: document.getElementById("menu-selector"),
        hoverCars: document.querySelectorAll('.hover-car'),
        hangarSubmenu: document.getElementById('hangar-submenu'), hangarGrid: document.getElementById('hangar-grid'), hangarCloseBtn: document.getElementById('hangar-close-btn'),
        pet1Canvas: document.getElementById('pet-canvas-1'), pet2Canvas: document.getElementById('pet-canvas-2'), petContainer2: document.getElementById('pet-container-2'),
        mothAI: document.getElementById('moth-ai'),
        jukeboxContainer: document.getElementById('jukebox-container'), playPauseBtn: document.getElementById("play-pause"), nextBtn: document.getElementById("next-track"), prevBtn: document.getElementById("prev-track"),
        volumeSlider: document.getElementById("volume-slider"), trackNameEl: document.getElementById("track-name"), rpmNeedle: document.getElementById("rpm-needle"),
        pressStart: document.getElementById('press-start'),
    };

    // --- Audio ---
    let masterAudioCtx, musicAudio, sfxHover, sfxSelect, sfxClick;
    function createAudioContext() { if (!masterAudioCtx) masterAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); return masterAudioCtx; }
    function createSound(type) {
        const audioCtx = createAudioContext();
        return () => {
            if (!audioCtx) return; let osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.setValueAtTime(0, audioCtx.currentTime);
            switch (type) {
                case 'hover': osc.type = 'triangle'; osc.frequency.setValueAtTime(440, 0); gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1); break;
                case 'select': osc.type = 'sine'; osc.frequency.setValueAtTime(660, 0); gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2); break;
                case 'click': osc.type = 'sine'; osc.frequency.setValueAtTime(1000, 0); gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05); break;
            }
            osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.3);
        };
    }

    // --- Modules ---
    const BootSequence = {
        lines: [ "LEMIVICE BIOS v1.9.7", "...", "Memory Check: OK", "...", "Loading REDLININ' OS...", "..." ],
        run() {
            let i = 0;
            const interval = setInterval(() => {
                if (i < this.lines.length) { elements.bootText.innerHTML += this.lines[i] + "\n"; i++; } 
                else {
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
                                Hangar.init();
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
        init() {
            elements.hangarGrid.innerHTML = '';
            elements.hoverCars.forEach((car, index) => {
                const option = document.createElement('div');
                option.className = 'hangar-ship-option';
                option.innerHTML = `<img src="${car.src}" alt="${car.alt}">`;
                option.addEventListener('click', () => {
                    this.setActiveCar(index);
                    this.closeSubmenu();
                });
                elements.hangarGrid.appendChild(option);
            });
        },
        setActiveCar(index) {
            elements.hoverCars[AppState.currentCarIndex].classList.remove('active');
            AppState.currentCarIndex = index;
            elements.hoverCars[AppState.currentCarIndex].classList.add('active');
        },
        openSubmenu() {
            elements.hangarSubmenu.classList.remove('hidden');
        },
        closeSubmenu() {
            elements.hangarSubmenu.classList.add('hidden');
        }
    };
    
    function activateStart() {
        if (AppState.menuActive) return;
        AppState.menuActive = true;
        sfxHover = createSound('hover'); sfxSelect = createSound('select'); sfxClick = createSound('click');
        elements.pressStart.style.opacity = '0';
        setTimeout(() => elements.pressStart.classList.add('hidden'), 500);
        elements.menuContainer.classList.add('visible');
        addInteractiveListeners();
    }

    function addInteractiveListeners() {
        elements.menuItems.forEach((item, index) => {
             item.addEventListener('mouseenter', () => { sfxHover(); });
             item.addEventListener('click', () => {
                 sfxSelect();
                 if (item.dataset.action === 'hangar') {
                     Hangar.openSubmenu();
                 } else {
                     alert('Clicked: ' + item.dataset.action);
                 }
             });
        });
        elements.hangarCloseBtn.addEventListener('click', () => Hangar.closeSubmenu());
        document.addEventListener('mousemove', (e) => {
            elements.customCursor.style.left = `${e.clientX}px`;
            elements.customCursor.style.top = `${e.clientY}px`;
        });
    }

    BootSequence.run();
};
