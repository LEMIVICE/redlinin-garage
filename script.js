console.log('REDLININ Garage v1.6.0 - BIOS BOOT');

document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    const AppState = {
        isBooted: false,
        menuActive: false,
        terminalOpen: false,
        idleTimer: null,
        clickCount: 0,
        clickTimer: null,
    };

    // --- DOM Elements ---
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    const mainContainer = document.getElementById('main-container');
    const menuItems = document.querySelectorAll(".menu-item");
    const terminalScreen = document.getElementById('terminal-screen');
    const terminalBackButton = document.querySelectorAll('.terminal-back-button');
    const terminalTitle = document.getElementById('terminal-title');
    const terminalBody = document.getElementById('terminal-body');
    const memoryDiscTerminal = document.getElementById('terminal-content-memory-disc');
    const defaultTerminal = document.getElementById('terminal-content-default');
    const petFace = document.getElementById('pet-face');
    const mothAI = document.getElementById('moth-ai');
    const tempoWarning = document.getElementById('tempo-warning');
    const randomizerButton = document.getElementById('randomizer-button');
    // ... (other elements from v1.5.0)

    // --- Boot Sequence ---
    const BootSequence = {
        lines: [
            "LEMIVICE BIOS v1.6.0", "...",
            "Memory Check: 640 KB OK", "...",
            "Initializing TurboCore...", "OK",
            "Loading REDLININ' OS...", "...",
            "Executing LEMIVICE.EXE", "..."
        ],
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
                            mainContainer.classList.add('visible');
                            document.addEventListener("keydown", activateStart, { once: true });
                            document.addEventListener("click", activateStart, { once: true });
                        }, 1000);
                    }, 500);
                }
            }, 400);
        }
    };

    // --- Cyber Pet ---
    const CyberPet = {
        faces: ['O_o', '^_-', 'o.O', '^_^', '>_<'],
        react() {
            petFace.textContent = this.faces[Math.floor(Math.random() * this.faces.length)];
        }
    };

    // --- Terminal Manager ---
    const Terminal = {
        open(target) {
            AppState.terminalOpen = true;
            terminalScreen.classList.remove('hidden');
            // Hide all content blocks first
            [defaultTerminal, memoryDiscTerminal].forEach(el => el.style.display = 'none');
            
            sfxConfirm();
            switch(target) {
                case 'memory-disc':
                    memoryDiscTerminal.style.display = 'flex';
                    break;
                case 'glitch-shop':
                    this.renderGlitchShop();
                    defaultTerminal.style.display = 'flex';
                    break;
                // Add cases for other terminal pages here
                default:
                    terminalTitle.textContent = target.replace('-', ' ').toUpperCase();
                    terminalBody.innerHTML = `<p>CONTENT FOR: ${target}</p>`;
                    defaultTerminal.style.display = 'flex';
                    break;
            }
        },
        close() {
            AppState.terminalOpen = false;
            terminalScreen.classList.add('hidden');
        },
        renderGlitchShop() {
            terminalTitle.textContent = "GlitchShop.EXE";
            let buttonsHTML = "";
            for (let i = 0; i < 5; i++) {
                buttonsHTML += `<button class="glitch-button">${this.randomGlitchText()}</button>`;
            }
            terminalBody.innerHTML = `<p>Click fast to unlock...</p>${buttonsHTML}`;
            document.querySelectorAll('.glitch-button').forEach(btn => {
                btn.addEventListener('click', () => {
                    alert('UNLOCKED: a thing!');
                    btn.textContent = this.randomGlitchText();
                });
            });
        },
        randomGlitchText() {
            const items = ["SKIN", "FX", "MP3", "WALLPAPER", "L0R3"];
            const glitches = ["#ERR", "NULL", "BZZT", "CORRUPT"];
            return Math.random() > 0.5 ? items[Math.floor(Math.random() * items.length)] : glitches[Math.floor(Math.random() * glitches.length)];
        }
    };

    // --- M.O.T.H. AI ---
    const MothAI = {
        move() {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            mothAI.style.top = `${y}px`;
            mothAI.style.left = `${x}px`;
        }
    };
    
    // --- Main Activation ---
    function activateStart() {
        if (AppState.menuActive) return;
        AppState.menuActive = true;
        // ... (all sfx creation, music player setup from v1.5.0)
        // ... (all event listeners from v1.5.0)

        // New listeners for v1.6.0
        document.querySelectorAll('.secret-spiral').forEach(el => {
            el.addEventListener('click', () => Terminal.open(el.dataset.target));
        });
        randomizerButton.addEventListener('click', () => alert('SURPRISE!'));
        terminalBackButton.forEach(btn => btn.addEventListener('click', Terminal.close));
        document.querySelector('.disc-insert-button').addEventListener('click', () => alert('TURBOCORE MODE UNLOCKED'));

        // Start M.O.T.H.
        setInterval(MothAI.move, 5000);

        // Tempo Warning Handler
        document.addEventListener('click', () => {
            AppState.clickCount++;
            if (!AppState.clickTimer) {
                AppState.clickTimer = setTimeout(() => {
                    AppState.clickCount = 0;
                    AppState.clickTimer = null;
                }, 1000);
            }
            if(AppState.clickCount > 10) {
                tempoWarning.classList.remove('hidden');
                setTimeout(() => tempoWarning.classList.add('hidden'), 2000);
                AppState.clickCount = 0;
            }
        });

        // Link menu items to terminal
        menuItems.forEach(item => {
            if(item.dataset.target) {
                item.addEventListener('click', () => Terminal.open(item.dataset.target));
            }
        });
    }
    
    // --- Initial Entry Point ---
    BootSequence.run();

    // The rest of the script from v1.5.0 needs to be adapted inside this structure
    // (e.g., sound creation, music player setup, menu navigation, etc.)
    // For brevity, I'm focusing on the new logic. The core jukebox/menu
    // functions from the previous script would be called within `activateStart`.
});
