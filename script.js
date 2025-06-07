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
                if (i < this.lines.length) { elements.bootText.innerHTML += this.lines[i] + "\n"; i++; } 
                else {
                    clearInterval(interval);
                    setTimeout(() => {
                        elements.bootScreen.style.transition = 'opacity 1s'; elements.bootScreen.style.opacity = '0';
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
        generateProblem(difficulty) {
            this.rings = []; this.keys = []; this.currentRingIndex = 0;
            const numRings = difficulty, totalSlots = 16;
            let usedSlots = new Set();
            for (let i = 0; i < numRings; i++) {
                let solutionKey = new Set();
                let numGaps = 2 + i;
                while(solutionKey.size < numGaps) {
                    let gap = Math.floor(Math.random() * totalSlots);
                    if (!usedSlots.has(gap)) { solutionKey.add(gap); usedSlots.add(gap); }
                }
                this.rings.push({ solved: false, gaps: solutionKey });
                this.keys.push({ used: false, pins: solutionKey });
            }
            for(let i=0; i<3; i++) {
                let falseKey = new Set();
                 while(falseKey.size < 3) { falseKey.add(Math.floor(Math.random() * totalSlots)); }
                 this.keys.push({ used: false, pins: falseKey });
            }
            this.keys.sort(() => Math.random() - 0.5);
            this.playerRotation = 0;
        },
        start() { this.isActive = true; this.generateProblem(2); elements.lockpickContainer.classList.remove('hidden'); this.renderKeys(); this.draw(); elements.lockpickMessage.textContent = "Align key and press [SPACE]"; },
        stop() { this.isActive = false; elements.lockpickContainer.classList.add('hidden'); },
        renderKeys() {
            elements.lockpickKeysContainer.innerHTML = '';
            this.keys.forEach((key, index) => {
                const slot = document.createElement('div');
                slot.className = 'key-slot';
                if(index === this.selectedKeyIndex) slot.classList.add('selected');
                if(key.used) slot.style.opacity = '0.2';
                const canvas = document.createElement('canvas');
                canvas.className = 'key-canvas'; canvas.width = 60; canvas.height = 60;
                slot.appendChild(canvas);
                this.drawKey(canvas.getContext('2d'), key, 1);
                slot.addEventListener('click', () => { if(!key.used) { this.selectedKeyIndex = index; this.renderKeys(); this.draw(); } });
                elements.lockpickKeysContainer.appendChild(slot);
            });
        },
        drawKey(ctx, key, scale) {
            const radius = 28 * scale, centerX = 30 * scale, centerY = 30 * scale;
            ctx.clearRect(0, 0, 60, 60); ctx.strokeStyle = 'lime'; ctx.lineWidth = 2 * scale;
            ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.stroke();
            key.pins.forEach(pinIndex => {
                const angle = (pinIndex / 16) * Math.PI * 2;
                const x1 = centerX + Math.cos(angle) * (radius - 5 * scale), y1 = centerY + Math.sin(angle) * (radius - 5 * scale);
                const x2 = centerX + Math.cos(angle) * (radius + 5 * scale), y2 = centerY + Math.sin(angle) * (radius + 5 * scale);
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            });
        },
        draw() {
            if(!this.isActive) return;
            const r = this.ctx.canvas.width / 2; this.ctx.clearRect(0, 0, r*2, r*2);
            this.rings.forEach((ring, index) => {
                const radius = r - 20 - (index * 25);
                if(radius < 10) return;
                this.ctx.strokeStyle = ring.solved ? 'yellow' : (index === this.currentRingIndex ? 'cyan' : '#005555');
                this.ctx.lineWidth = 5; this.ctx.beginPath();
                for(let i = 0; i < 16; i++) {
                    if(!ring.gaps.has(i)) {
                       const angle = (i / 16) * Math.PI * 2 - (Math.PI / 16);
                       this.ctx.arc(r, r, radius, angle, angle + (Math.PI/8));
                    }
                }
                this.ctx.stroke();
            });
            const selectedKey = this.keys[this.selectedKeyIndex], currentRing = this.rings[this.currentRingIndex];
            if(!selectedKey || !currentRing) return;
            const keyRadius = r - 20 - (this.currentRingIndex * 25);
            this.ctx.save(); this.ctx.translate(r,r); this.ctx.rotate(this.playerRotation * Math.PI / 180); this.ctx.translate(-r,-r);
            this.ctx.lineWidth = 3;
            selectedKey.pins.forEach(pinIndex => {
                 const angle = (pinIndex / 16) * Math.PI * 2;
                 this.ctx.strokeStyle = currentRing.gaps.has(pinIndex) ? 'lime' : 'red';
                 const x1 = r + Math.cos(angle) * (keyRadius - 8), y1 = r + Math.sin(angle) * (keyRadius - 8);
                 const x2 = r + Math.cos(angle) * (keyRadius + 8), y2 = r + Math.sin(angle) * (keyRadius + 8);
                 this.ctx.beginPath(); this.ctx.moveTo(x1, y1); this.ctx.lineTo(x2, y2); this.ctx.stroke();
            });
            this.ctx.restore();
        },
        attemptSlot() {
            const key = this.keys[this.selectedKeyIndex], ring = this.rings[this.currentRingIndex];
            const rotationOffset = Math.round((this.playerRotation / 22.5) % 16 + 16) % 16;
            let success = true;
            if(key.pins.size !== ring.gaps.size) { success = false; } 
            else { key.pins.forEach(pinIndex => { if(!ring.gaps.has((pinIndex + rotationOffset) % 16)) { success = false; } }); }
            if(success) {
                sfxSelect(); ring.solved = true; key.used = true;
                this.currentRingIndex++; elements.lockpickMessage.textContent = `RING ${this.currentRingIndex} SOLVED`;
                if(this.currentRingIndex >= this.rings.length) {
                    elements.lockpickMessage.textContent = "BREACH SUCCESSFUL!"; setTimeout(() => this.stop(), 2000);
                }
                this.renderKeys(); this.draw();
            } else {
                elements.lockpickMessage.textContent = "KEY MISMATCH. TRY AGAIN.";
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; this.ctx.fillRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);
            }
        },
        handleInput(e) {
            if(!this.isActive) return;
            switch(e.key) {
                case 'a': this.playerRotation -= 22.5; break; case 'd': this.playerRotation += 22.5; break;
                case 'w': this.selectedKeyIndex = (this.selectedKeyIndex - 1 + this.keys.length) % this.keys.length; if(this.keys[this.selectedKeyIndex].used) this.handleInput({key: 'w'}); this.renderKeys(); break;
                case 's': this.selectedKeyIndex = (this.selectedKeyIndex + 1) % this.keys.length; if(this.keys[this.selectedKeyIndex].used) this.handleInput({key: 's'}); this.renderKeys(); break;
                case ' ': this.attemptSlot(); break;
            }
            this.draw();
        }
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
