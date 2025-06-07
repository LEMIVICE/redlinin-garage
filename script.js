console.log('REDLININ Garage v1.7.0 - BIOS BOOT');

document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    const AppState = { isBooted: false, menuActive: false, terminalOpen: false, idleTimer: null, currentCarIndex: 0 };
    // ... (All DOM elements from previous script) ...
    const carBay = document.getElementById('hover-car-bay');
    const hoverCars = document.querySelectorAll('.hover-car');
    const switcherLeft = document.getElementById('car-switcher-left');
    const switcherRight = document.getElementById('car-switcher-right');
    const pet1Canvas = document.getElementById('pet-canvas-1');
    const pet2Canvas = document.getElementById('pet-canvas-2');
    const petContainer2 = document.getElementById('pet-container-2');
    const mothAI = document.getElementById('moth-ai');

    // --- Hangar System ---
    const Hangar = {
        switchCar(direction) {
            hoverCars[AppState.currentCarIndex].classList.add('hidden');
            if (direction === 'right') {
                AppState.currentCarIndex = (AppState.currentCarIndex + 1) % hoverCars.length;
            } else {
                AppState.currentCarIndex = (AppState.currentCarIndex - 1 + hoverCars.length) % hoverCars.length;
            }
            hoverCars[AppState.currentCarIndex].classList.remove('hidden');
        }
    };
    
    // --- Digital Pet System ---
    const DigitalPet = {
        ctx1: pet1Canvas.getContext('2d'),
        ctx2: pet2Canvas.getContext('2d'),
        isDemonicUnlocked: false,
        drawPixel(ctx, x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * 5, y * 5, 5, 5); // 5x5 pixel blocks
        },
        drawFace(ctx, mood) {
            ctx.clearRect(0, 0, pet1Canvas.width, pet1Canvas.height);
            const color = (ctx === this.ctx2) ? '#ff0000' : '#00ff00'; // Demonic is red
            // Simple face drawing logic
            if (mood === 'idle') {
                this.drawPixel(ctx, 3, 3, color); // Left eye
                this.drawPixel(ctx, 9, 3, color); // Right eye
                this.drawPixel(ctx, 4, 7, color); // Mouth
                this.drawPixel(ctx, 8, 7, color);
            } else if (mood === 'happy') {
                this.drawPixel(ctx, 3, 3, color); 
                this.drawPixel(ctx, 9, 3, color); 
                this.drawPixel(ctx, 2, 6, color);
                this.drawPixel(ctx, 3, 7, color);
                this.drawPixel(ctx, 9, 7, color);
                this.drawPixel(ctx, 10, 6, color);
            }
        },
        unlockDemonic() {
            if (this.isDemonicUnlocked) return;
            this.isDemonicUnlocked = true;
            petContainer2.classList.remove('hidden');
            mothAI.classList.add('corrupted');
            petContainer2.classList.add('corrupted');
            this.drawFace(this.ctx2, 'idle'); // Draw initial demonic face
        }
    };

    // --- Death Mode ---
    const DeathMode = {
        sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
        userInput: [],
        check(key) {
            this.userInput.push(key);
            if (this.userInput.length > this.sequence.length) {
                this.userInput.shift();
            }
            if (this.userInput.join('') === this.sequence.join('')) {
                document.body.classList.add('death-mode');
                DigitalPet.unlockDemonic();
                setTimeout(() => document.body.classList.remove('death-mode'), 2000); // Strobe for 2 seconds
            }
        }
    };
    
    // --- Main Activation and Event Listeners ---
    function activateStart() {
        if (AppState.menuActive) return;
        AppState.menuActive = true;
        // ... (All sound creation and jukebox setup from previous script) ...
        Jukebox.setup(); // Assuming jukebox logic is refactored
        Jukebox.playTrack();
        DigitalPet.drawFace(DigitalPet.ctx1, 'idle'); // Draw initial pet face
        addInteractiveListeners(); // All listeners go here
    }

    function addInteractiveListeners() {
        // ... (All existing listeners from previous version) ...
        switcherLeft.addEventListener('click', () => Hangar.switchCar('left'));
        switcherRight.addEventListener('click', () => Hangar.switchCar('right'));

        // Add Death Mode listener
        document.addEventListener('keydown', (e) => DeathMode.check(e.key));
        
        // Make pets react
        document.getElementById('next-track').addEventListener('click', () => {
            DigitalPet.drawFace(DigitalPet.ctx1, 'happy');
            if (DigitalPet.isDemonicUnlocked) DigitalPet.drawFace(DigitalPet.ctx2, 'happy');
            setTimeout(() => {
                DigitalPet.drawFace(DigitalPet.ctx1, 'idle');
                if (DigitalPet.isDemonicUnlocked) DigitalPet.drawFace(DigitalPet.ctx2, 'idle');
            }, 1000);
        });
    }

    // --- Initial Entry Point ---
    // BootSequence.run(); // Assuming BootSequence object from previous script
    // For now, let's just directly activate for testing
    document.addEventListener("keydown", activateStart, { once: true });
    document.addEventListener("click", activateStart, { once: true });
    
    // --- The rest of the script (Terminal, Jukebox, MothAI, etc.) ---
    // For brevity, I've focused on the new systems. The full script would
    // merge this logic with the complete, functional code from v1.6.0.
    // The key is that the DeathMode.check() function is now listening for the
    // Konami code, and when it succeeds, it calls DigitalPet.unlockDemonic().
});
