console.log('REDLININ Garage v2.2.1 - Full Interactive Build');

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
        lines: [ "LEMIVICE BIOS v2.2.1", "...", "Memory Check: OK", "...", "Loading REDLININ' OS...", "..." ],
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

    const DigitalPet = {
        ctx1: elements.pet1Canvas.getContext('2d'),
        isDemonicUnlocked: false, animationFrame: 0, animationTimer: null,
        animations: { idle: [[0,0,1,1,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0],[0,0,1,1,0,0,0,1,1,0,0],[0,0,0,1,1,1,1,1,0,0,0]], idleBlink: [[0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0],[0,0,1,1,0,0,0,1,1,0,0],[0,0,0,1,1,1,1,1,0,0,0]], happy: [[0,0,1,1,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,0,1,0],[0,0,1,0,0,0,0,0,1,0,0],[0,0,0,1,1,1,1,1,0,0,0]] },
        drawFrame(ctx, frameData, color) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            const pixelSizeX = ctx.canvas.width / frameData[0].length; const pixelSizeY = ctx.canvas.height / frameData.length;
            for(let y = 0; y < frameData.length; y++) { for(let x = 0; x < frameData[y].length; x++) { if (frameData[y][x] === 1) { ctx.fillStyle = color; ctx.fillRect(x * pixelSizeX, y * pixelSizeY, pixelSizeX, pixelSizeY); } } }
        },
        animate() {
            clearInterval(this.animationTimer);
            this.animationTimer = setInterval(() => {
                this.animationFrame++; let frame = (this.animationFrame % 20 < 18) ? this.animations.idle : this.animations.idleBlink;
                this.drawFrame(this.ctx1, frame, '#00ff00');
            }, 200);
        },
        react() { clearInterval(this.animationTimer); this.drawFrame(this.ctx1, this.animations.happy, '#00ff00'); setTimeout(() => this.animate(), 1000); }
    };
    
    const Jukebox = {
        tracks: [ "track_01.mp3", "track_02.mp3", "track_03.mp3", "track_04.mp3", "track_05.mp3" ], currentTrackIndex: 0,
        setup() {
            for (let i = this.tracks.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]]; }
            const audioCtx = createAudioContext(); musicAudio = new Audio(); musicAudio.loop = false; musicAudio.volume = elements.volumeSlider.value; musicAudio.crossOrigin = "anonymous";
            const source = audioCtx.createMediaElementSource(musicAudio); const analyser = audioCtx.createAnalyser(); analyser.fftSize = 256; source.connect(analyser); analyser.connect(audioCtx.destination);
            const bufferLength = analyser.frequencyBinCount, dataArray = new Uint8Array(bufferLength); const canvas = document.getElementById("visualizer"), ctx = canvas.getContext("2d");
            const bars = [ { x: 3, width: 10 }, { x: 15, width: 10 }, { x: 27, width: 10 }, { x: 39, width: 10 }, { x: 51, width: 10 }, { x: 63, width: 10 }, { x: 75, width: 10 }, { x: 87, width: 10 }, { x: 99, width: 10 }, { x: 111, width: 10 }, { x: 123, width: 10 }, { x: 135, width: 10 }, { x: 147, width: 10 }, { x: 159, width: 10 }, { x: 171, width: 10 } ];
            function draw() {
                requestAnimationFrame(draw); analyser.getByteFrequencyData(dataArray); ctx.clearRect(0, 0, canvas.width, canvas.height);
                const bassAvg = (dataArray[1] + dataArray[2] + dataArray[3]) / 3, midAvg = (dataArray[20] + dataArray[21] + dataArray[22]) / 3;
                bars.forEach((bar, i) => {
                    const sliceStart = Math.floor(i * (bufferLength / bars.length)), sliceEnd = Math.floor((i + 1) * (bufferLength / bars.length));
                    let sliceAvg = 0; for(let k = sliceStart; k < sliceEnd; k++) { sliceAvg += dataArray[k]; }
                    sliceAvg /= (sliceEnd - sliceStart) || 1;
                    ctx.fillStyle = '#00ff00'; ctx.fillRect(bar.x, canvas.height - (sliceAvg / 255) * canvas.height * 1.2, bar.width, (sliceAvg / 255) * canvas.height * 1.2);
                });
                elements.rpmNeedle.style.transform = `rotate(${Math.min(45, Math.max(-45, -45 + ((bassAvg + midAvg) / 2) / 180 * 90))}deg)`;
            }
            draw();
        },
        playTrack(direction) {
            if (direction === 'next') this.currentTrackIndex++; else if (direction === 'prev') this.currentTrackIndex--;
            if (this.currentTrackIndex >= this.tracks.length) this.currentTrackIndex = 0; if (this.currentTrackIndex < 0) this.currentTrackIndex = this.tracks.length - 1;
            musicAudio.src = this.tracks[this.currentTrackIndex]; this.updateTrackDisplay();
            musicAudio.play().then(() => { elements.playPauseBtn.textContent = '||'; elements.playPauseBtn.dataset.state = 'playing'; }).catch(e => { console.error("Audio playback failed:", e);});
        },
        updateTrackDisplay() { elements.trackNameEl.textContent = this.tracks[this.currentTrackIndex].replace('.mp3', ''); }
    };

    const MothAI = {
        move() { const targets = [elements.menuContainer, elements.jukeboxContainer]; const target = targets[Math.floor(Math.random() * targets.length)]; const rect = target.getBoundingClientRect(); elements.mothAI.style.top = `${rect.top + (rect.height / 2)}px`; elements.mothAI.style.left = `${rect.left + (rect.width / 2) - (elements.mothAI.width / 2)}px`; }
    };
    
    function activateStart() {
        if (AppState.menuActive) return; AppState.menuActive = true;
        sfxHover = createSound('hover'); sfxSelect = createSound('select'); sfxClick = createSound('click');
        Jukebox.setup(); Jukebox.playTrack();
        DigitalPet.animate();
        elements.pressStart.style.opacity = '0';
        setTimeout(() => elements.pressStart.classList.add('hidden'), 500);
        elements.menuContainer.classList.add('visible');
        addInteractiveListeners();
        setInterval(MothAI.move, 8000); MothAI.move();
    }

    function addInteractiveListeners() {
        elements.menuItems.forEach((item, index) => {
             item.addEventListener('mouseenter', () => { AppState.selectedIndex = index; updateMenuSelection(); sfxHover(); });
             item.addEventListener('click', () => {
                 sfxSelect();
                 if (item.dataset.action === 'hangar') { Hangar.openSubmenu(); } 
                 else { alert('Clicked: ' + item.dataset.action); }
             });
        });
        elements.hangarCloseBtn.addEventListener('click', () => { sfxClick(); Hangar.closeSubmenu(); });
        document.addEventListener('mousemove', (e) => { elements.customCursor.style.left = `${e.clientX}px`; elements.customCursor.style.top = `${e.clientY}px`; });
        elements.playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); sfxClick(); if (elements.playPauseBtn.dataset.state === 'playing') { musicAudio.pause(); elements.playPauseBtn.textContent = '►'; elements.playPauseBtn.dataset.state = 'paused'; } else { musicAudio.play(); elements.playPauseBtn.textContent = '||'; elements.playPauseBtn.dataset.state = 'playing'; } });
        elements.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); sfxClick(); Jukebox.playTrack('next'); DigitalPet.react(); });
        elements.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); sfxClick(); Jukebox.playTrack('prev'); DigitalPet.react(); });
        musicAudio.addEventListener('ended', () => Jukebox.playTrack('next'));
        elements.volumeSlider.addEventListener('input', (e) => { musicAudio.volume = e.target.value; });
    }
    
    function updateMenuSelection() {
        elements.menuItems.forEach((item, index) => { item.classList.toggle('selected', index === AppState.selectedIndex); });
        const selectedItem = elements.menuItems[AppState.selectedIndex];
        if (selectedItem) { elements.menuSelector.style.opacity = '1'; elements.menuSelector.style.top = `${selectedItem.offsetTop}px`; }
    }

    BootSequence.run();
};
