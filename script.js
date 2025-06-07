console.log('REDLININ Garage v1.9.2 - Lockpick Mini-Game Update');

// Wait for the entire window to load before running any script
window.onload = () => {
    // --- App State & Element Cache ---
    const AppState = { menuActive: false, currentCarIndex: 0, selectedIndex: 0 };
    const lockpickContainer = document.getElementById('lockpick-container');
    const lockpickCanvas = document.getElementById('lockpick-canvas');
    const lockpickKeysContainer = document.getElementById('lockpick-keys');
    const lockpickMessage = document.getElementById('lockpick-message');
    const lockpickCloseBtn = document.getElementById('lockpick-close');
    const toolbox = document.getElementById('toolbox');
    const bootScreen = document.getElementById('boot-screen'), bootText = document.getElementById('boot-text');
    // ... all other element caches

    let masterAudioCtx, musicAudio, sfxSelect;

    function createAudioContext() {
        if (!masterAudioCtx) masterAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return masterAudioCtx;
    }

    function createSound(type) {
        const audioCtx = createAudioContext();
        return () => {
            if (!audioCtx) return;
            let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            switch (type) {
                case 'select': osc.type = 'sine'; osc.frequency.setValueAtTime(660, 0); gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2); break;
            }
            osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.3);
        };
    }
    
    // --- Lockpick Game Module ---
    const LockpickGame = {
        ctx: lockpickCanvas.getContext('2d'),
        isActive: false,
        rings: [],
        keys: [],
        currentRingIndex: 0,
        selectedKeyIndex: 0,
        playerRotation: 0, // In degrees
        
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

        start() {
            this.isActive = true; this.generateProblem(2);
            lockpickContainer.classList.remove('hidden');
            this.renderKeys(); this.draw();
            lockpickMessage.textContent = "Align key and press [SPACE]";
        },

        stop() { this.isActive = false; lockpickContainer.classList.add('hidden'); },

        renderKeys() {
            lockpickKeysContainer.innerHTML = '';
            this.keys.forEach((key, index) => {
                const slot = document.createElement('div');
                slot.className = 'key-slot';
                if(index === this.selectedKeyIndex) slot.classList.add('selected');
                if(key.used) slot.style.opacity = '0.2';
                const canvas = document.createElement('canvas');
                canvas.className = 'key-canvas'; canvas.width = 60; canvas.height = 60;
                slot.appendChild(canvas);
                this.drawKey(canvas.getContext('2d'), key, 1);
                slot.addEventListener('click', () => {
                    if(!key.used) { this.selectedKeyIndex = index; this.renderKeys(); this.draw(); }
                });
                lockpickKeysContainer.appendChild(slot);
            });
        },

        drawKey(ctx, key, scale) {
            const radius = 28 * scale, centerX = 30 * scale, centerY = 30 * scale;
            ctx.clearRect(0, 0, 60, 60);
            ctx.strokeStyle = 'lime'; ctx.lineWidth = 2 * scale;
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
                this.ctx.lineWidth = 5;
                this.ctx.beginPath();
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
                 ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
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
                this.currentRingIndex++; lockpickMessage.textContent = `RING ${this.currentRingIndex} SOLVED`;
                if(this.currentRingIndex >= this.rings.length) {
                    lockpickMessage.textContent = "BREACH SUCCESSFUL!";
                    setTimeout(() => this.stop(), 2000);
                }
                this.renderKeys(); this.draw();
            } else {
                lockpickMessage.textContent = "KEY MISMATCH. TRY AGAIN.";
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                this.ctx.fillRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);
            }
        },

        handleInput(e) {
            if(!this.isActive) return;
            switch(e.key) {
                case 'a': this.playerRotation -= 22.5; break;
                case 'd': this.playerRotation += 22.5; break;
                case 'w':
                    this.selectedKeyIndex = (this.selectedKeyIndex - 1 + this.keys.length) % this.keys.length;
                    if(this.keys[this.selectedKeyIndex].used) this.handleInput({key: 'w'});
                    this.renderKeys();
                    break;
                case 's':
                    this.selectedKeyIndex = (this.selectedKeyIndex + 1) % this.keys.length;
                     if(this.keys[this.selectedKeyIndex].used) this.handleInput({key: 's'});
                    this.renderKeys();
                    break;
                case ' ': this.attemptSlot(); break;
            }
            this.draw();
        }
    };
    
    // --- Boot Sequence ---
    const BootSequence = {
        lines: [ "LEMIVICE BIOS v1.9.2", "...", "Memory Check: OK", "...", "Loading REDLININ' OS...", "..." ],
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
                            document.getElementById('main-container').classList.remove('hidden');
                        }, 1000);
                    }, 500);
                }
            }, 400);
        }
    };
    
    function addInteractiveListeners() {
        toolbox.addEventListener('click', () => LockpickGame.start());
        lockpickCloseBtn.addEventListener('click', () => LockpickGame.stop());
        document.addEventListener('keydown', (e) => LockpickGame.handleInput(e));
    }

    // --- Initial Entry Point ---
    sfxSelect = createSound('select');
    BootSequence.run();
    addInteractiveListeners();
};
