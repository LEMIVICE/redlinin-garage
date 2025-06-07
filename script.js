console.log('REDLININ Garage v1.8.0 - BIOS BOOT');

document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    const AppState = { isBooted: false, menuActive: false, terminalOpen: false, idleTimer: null, currentCarIndex: 0, selectedIndex: 0 };

    // --- DOM Elements ---
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    const mainContainer = document.getElementById('main-container');
    const customCursor = document.getElementById("custom-cursor");
    const menuContainer = document.getElementById("menu-container");
    const menuItems = document.querySelectorAll(".menu-item");
    const menuSelector = document.getElementById("menu-selector");
    const hoverCars = document.querySelectorAll('.hover-car');
    const switcherLeft = document.getElementById('car-switcher-left');
    const switcherRight = document.getElementById('car-switcher-right');
    const pet1Canvas = document.getElementById('pet-canvas-1');
    const pet2Canvas = document.getElementById('pet-canvas-2');
    const petContainer2 = document.getElementById('pet-container-2');
    const mothAI = document.getElementById('moth-ai');
    const terminalScreen = document.getElementById('terminal-screen');
    const terminalBackButton = document.querySelectorAll('.terminal-back-button');
    const jukeboxContainer = document.getElementById('jukebox-container');
    const playPauseBtn = document.getElementById("play-pause");
    const nextBtn = document.getElementById("next-track");
    const prevBtn = document.getElementById("prev-track");
    const volumeSlider = document.getElementById("volume-slider");
    const trackNameEl = document.getElementById("track-name");
    const rpmNeedle = document.getElementById("rpm-needle");
    const pressStart = document.getElementById('press-start');

    // --- Sound Synthesis Variables ---
    let masterAudioCtx, musicAudio, sfxHover, sfxSelect, sfxDisabled, sfxConfirm, sfxClick;

    // --- Boot Sequence ---
    const BootSequence = {
        lines: [ "LEMIVICE BIOS v1.8.0", "...", "Memory Check: 640 KB OK", "...", "Initializing TurboCore...", "OK", "Loading REDLININ' OS...", "...", "Executing LEMIVICE.EXE", "..." ],
        run() {
            let i = 0;
            const interval = setInterval(() => {
                if (i < this.lines.length) {
                    bootText.innerHTML += this.lines[i] + "\n";
                    i++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        bootScreen.style.transition = 'opacity 1s';
                        bootScreen.style.opacity = '0';
                        setTimeout(() => {
                            bootScreen.classList.add('hidden');
                            mainContainer.classList.remove('hidden');
                            setTimeout(() => {
                                mainContainer.classList.add('visible');
                                pressStart.classList.remove('hidden');
                                customCursor.classList.add('visible');
                                document.addEventListener("keydown", activateStart, { once: true });
                                document.addEventListener("click", activateStart, { once: true });
                            }, 50);
                        }, 1000);
                    }, 500);
                }
            }, 300);
        }
    };
    
    // --- Hangar System ---
    const Hangar = {
        switchCar(direction) {
            hoverCars[AppState.currentCarIndex].style.opacity = '0';
            setTimeout(() => hoverCars[AppState.currentCarIndex].classList.add('hidden'), 500);

            if (direction === 'right') {
                AppState.currentCarIndex = (AppState.currentCarIndex + 1) % hoverCars.length;
            } else {
                AppState.currentCarIndex = (AppState.currentCarIndex - 1 + hoverCars.length) % hoverCars.length;
            }
            
            hoverCars[AppState.currentCarIndex].classList.remove('hidden');
            setTimeout(() => hoverCars[AppState.currentCarIndex].style.opacity = '1', 50);
        }
    };
    
    // --- Digital Pet System ---
    const DigitalPet = {
        ctx1: pet1Canvas.getContext('2d'),
        ctx2: pet2Canvas.getContext('2d'),
        isDemonicUnlocked: false,
        drawPixel(ctx, x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * (ctx.canvas.width / 13), y * (ctx.canvas.height / 10), (ctx.canvas.width / 13) + 1, (ctx.canvas.height / 10) + 1);
        },
        drawFace(ctx, mood) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            const color = (ctx === this.ctx2) ? '#ff0000' : '#00ff00';
            if (mood === 'idle') {
                this.drawPixel(ctx, 3, 3, color); this.drawPixel(ctx, 9, 3, color);
                this.drawPixel(ctx, 4, 7, color); this.drawPixel(ctx, 8, 7, color);
            } else if (mood === 'happy') {
                this.drawPixel(ctx, 3, 3, color); this.drawPixel(ctx, 9, 3, color);
                this.drawPixel(ctx, 2, 6, color); this.drawPixel(ctx, 3, 7, color);
                this.drawPixel(ctx, 9, 7, color); this.drawPixel(ctx, 10, 6, color);
            }
        },
        unlockDemonic() {
            if (this.isDemonicUnlocked) return;
            this.isDemonicUnlocked = true;
            petContainer2.classList.remove('hidden');
            mothAI.classList.add('corrupted');
            petContainer2.classList.add('corrupted');
            this.drawFace(this.ctx2, 'idle');
        }
    };

    // --- Death Mode ---
    const DeathMode = {
        sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
        userInput: [],
        check(key) {
            if (!AppState.menuActive) return;
            this.userInput.push(key);
            if (this.userInput.length > this.sequence.length) this.userInput.shift();
            if (this.userInput.join('') === this.sequence.join('')) {
                document.body.classList.add('death-mode');
                DigitalPet.unlockDemonic();
                setTimeout(() => document.body.classList.remove('death-mode'), 2000);
            }
        }
    };

    // --- Sound Synthesis ---
    function createAudioContext() {
        if (!masterAudioCtx) masterAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return masterAudioCtx;
    }

    function createSound(type) {
        const audioCtx = createAudioContext();
        return () => {
            if (!audioCtx) return;
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            gain.gain.setValueAtTime(0, audioCtx.currentTime);

            switch (type) {
                case 'hover': osc.type = 'triangle'; osc.frequency.setValueAtTime(440, 0); gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1); break;
                case 'select': osc.type = 'sine'; osc.frequency.setValueAtTime(660, 0); gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2); break;
                case 'click': osc.type = 'sine'; osc.frequency.setValueAtTime(1000, 0); gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05); break;
            }
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.3);
        };
    }
    
    // --- Jukebox ---
    const Jukebox = {
        tracks: [ "track_01.mp3", "track_02.mp3", "track_03.mp3", "track_04.mp3", "track_05.mp3" ],
        currentTrackIndex: 0,
        setup() {
            for (let i = this.tracks.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]]; }
            const audioCtx = createAudioContext();
            musicAudio = new Audio();
            musicAudio.loop = false;
            musicAudio.volume = volumeSlider.value;
            musicAudio.crossOrigin = "anonymous";
            const source = audioCtx.createMediaElementSource(musicAudio);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const canvas = document.getElementById("visualizer");
            const ctx = canvas.getContext("2d");
            const bars = [ { x: 3, width: 10 }, { x: 15, width: 10 }, { x: 27, width: 10 }, { x: 39, width: 10 }, { x: 51, width: 10 }, { x: 63, width: 10 }, { x: 75, width: 10 }, { x: 87, width: 10 }, { x: 99, width: 10 }, { x: 111, width: 10 }, { x: 123, width: 10 }, { x: 135, width: 10 }, { x: 147, width: 10 }, { x: 159, width: 10 }, { x: 171, width: 10 } ];
            function draw() {
                requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const bassAvg = (dataArray[1] + dataArray[2] + dataArray[3]) / 3;
                const midAvg = (dataArray[20] + dataArray[21] + dataArray[22]) / 3;
                bars.forEach((bar, i) => {
                    const sliceStart = Math.floor(i * (bufferLength / bars.length));
                    const sliceEnd = Math.floor((i + 1) * (bufferLength / bars.length));
                    let sliceAvg = 0;
                    for(let k = sliceStart; k < sliceEnd; k++) { sliceAvg += dataArray[k]; }
                    sliceAvg /= (sliceEnd - sliceStart);
                    const barHeight = (sliceAvg / 255) * canvas.height * 1.2;
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(bar.x, canvas.height - barHeight, bar.width, barHeight);
                });
                const averageVolume = (bassAvg + midAvg) / 2;
                const rpmRotation = -45 + (averageVolume / 180) * 90; 
                rpmNeedle.style.transform = `rotate(${Math.min(45, Math.max(-45, rpmRotation))}deg)`;
            }
            draw();
        },
        playTrack(direction) {
            if (direction === 'next') this.currentTrackIndex++;
            else if (direction === 'prev') this.currentTrackIndex--;
            if (this.currentTrackIndex >= this.tracks.length) this.currentTrackIndex = 0;
            if (this.currentTrackIndex < 0) this.currentTrackIndex = this.tracks.length - 1;
            musicAudio.src = this.tracks[this.currentTrackIndex];
            this.updateTrackDisplay();
            musicAudio.play().then(() => { playPauseBtn.textContent = '||'; playPauseBtn.dataset.state = 'playing'; }).catch(e => console.error("Audio playback failed:", e));
        },
        updateTrackDisplay() {
            const trackName = this.tracks[this.currentTrackIndex].replace('.mp3', '');
            trackNameEl.textContent = trackName;
        }
    };
    
    // --- MOTH AI ---
    const MothAI = {
        move() {
            const targets = [menuContainer, jukeboxContainer];
            const target = targets[Math.floor(Math.random() * targets.length)];
            const rect = target.getBoundingClientRect();
            mothAI.style.top = `${rect.top + (rect.height / 2)}px`;
            mothAI.style.left = `${rect.left + (rect.width / 2) - (mothAI.width / 2)}px`;
        }
    };
    
    // --- Main Activation and Event Listeners ---
    function activateStart() {
        if (AppState.menuActive) return;
        AppState.menuActive = true;
        
        sfxHover = createSound('hover');
        sfxSelect = createSound('select');
        sfxClick = createSound('click');
        
        Jukebox.setup(); 
        Jukebox.playTrack();
        
        DigitalPet.drawFace(DigitalPet.ctx1, 'idle');
        
        pressStart.style.transition = 'opacity 0.5s';
        pressStart.style.opacity = '0';
        setTimeout(() => pressStart.classList.add('hidden'), 500);

        menuContainer.classList.add('visible');
        switcherLeft.classList.remove('hidden');
        switcherRight.classList.remove('hidden');

        addInteractiveListeners();
        setInterval(MothAI.move, 5000);
        MothAI.move();
    }

    function addInteractiveListeners() {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });
        document.addEventListener('keydown', (e) => DeathMode.check(e.key));
        
        switcherLeft.addEventListener('click', (e) => { e.stopPropagation(); Hangar.switchCar('left'); });
        switcherRight.addEventListener('click', (e) => { e.stopPropagation(); Hangar.switchCar('right'); });
        
        menuItems.forEach((item, index) => {
             item.addEventListener('mouseenter', () => { AppState.selectedIndex = index; updateMenuSelection(); sfxHover(); });
             item.addEventListener('click', () => { alert('Menu Clicked: ' + item.dataset.action); });
        });

        playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); if (playPauseBtn.dataset.state === 'playing') { musicAudio.pause(); playPauseBtn.textContent = '►'; playPauseBtn.dataset.state = 'paused'; } else { musicAudio.play(); playPauseBtn.textContent = '||'; playPauseBtn.dataset.state = 'playing'; } });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); Jukebox.playTrack('next'); DigitalPet.react('happy'); });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); Jukebox.playTrack('prev'); DigitalPet.react('happy'); });
        musicAudio.addEventListener('ended', () => Jukebox.playTrack('next'));
        volumeSlider.addEventListener('input', (e) => musicAudio.volume = e.target.value);
    }
    
    function updateMenuSelection() {
        menuItems.forEach((item, index) => {
            item.classList.toggle('selected', index === AppState.selectedIndex);
        });
        const selectedItem = menuItems[AppState.selectedIndex];
        if (selectedItem) {
            menuSelector.style.opacity = '1';
            menuSelector.style.top = `${selectedItem.offsetTop}px`;
        }
    }

    // --- Initial Entry Point ---
    BootSequence.run();
});
