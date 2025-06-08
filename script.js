<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>REDLININ' v2.2.5</title>
  <link href="https://fonts.cdnfonts.com/css/draco" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=VT323&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div id="boot-screen">
    <div id="boot-text"></div>
  </div>

  <div id="main-container" class="hidden">
    <div id="custom-cursor"></div>

    <div id="scene">
      <div id="video-overlay-container">
        <video id="overlay-video" autoplay loop muted playsinline>
          <source src="dust_overlay_v2.mp4" type="video/mp4" />
        </video>
      </div>
      <div id="background-layer"></div>
      
      <div id="hangar-container">
        <div id="hover-car-bay">
            <img class="hover-car active" src="hover_ship_cutout.png" alt="Hover Ship 1" data-car-id="0">
            <img class="hover-car" src="GARAGE 2ND HOVERSHIP.png" alt="Hover Ship 2" data-car-id="1">
            <img class="hover-car" src="GARAGE 3RD HOVERSHIP.png" alt="Hover Ship 3" data-car-id="2">
            <img class="hover-car" src="GARAGE 4TH HOVERSHIP.png" alt="Hover Ship 4" data-car-id="3">
        </div>
      </div>
      <!-- UPDATED: Clickable console in the scene -->
      <img src="LED CONSOLE 1.png" id="clickable-console" alt="Old Console">
    </div>

    <div id="ui-layer">
      <div id="splash-screen-overlay" class="hidden"></div>
      <div id="press-start" class="hidden">[ PRESS START ]</div>
      <img id="moth-ai" src="GARAGE DIGI-MOTH.png" alt="MOTH AI">

      <div id="digital-pet-zone">
        <div id="pet-container-1" class="pet-container">
            <img src="GARAGE DIGITAL PET SKIN.png" class="pet-skin">
            <canvas id="pet-canvas-1" class="pet-canvas"></canvas>
        </div>
        <div id="pet-container-2" class="pet-container hidden">
            <img src="GARAGE DIGITAL PET SKIN 2.png" class="pet-skin">
            <canvas id="pet-canvas-2" class="pet-canvas"></canvas>
        </div>
      </div>

      <div id="menu-container">
        <div id="menu">
            <div id="menu-selector">&gt;</div>
            <div class="menu-item" data-action="adventure">ADVENTURE</div>
            <div class="menu-item" data-action="hangar">HANGAR</div>
            <div class="menu-item" data-action="secrets">SECRETS SHOP</div>
            <div class="menu-item" data-action="options">DNA CHIP</div>
            <div class="menu-item" data-action="profile">MEMORY DISC?</div>
        </div>
      </div>
      
      <div id="jukebox-container">
        <img src="mp3_player_skin.png" alt="MP3 Player Skin" class="jukebox-bg">
        <canvas id="visualizer"></canvas>
        <div id="rpm-meter"><div id="rpm-needle"></div></div>
        <div id="track-display"><p id="track-name">NO SIGNAL</p></div>
        <div id="jukebox-controls">
          <div id="prev-track" class="control-button">«</div>
          <div id="play-pause" class="control-button" data-state="paused">►</div>
          <div id="next-track" class="control-button">»</div>
        </div>
        <div id="volume-container">
          <span id="volume-icon">🔊</span>
          <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="0.8">
        </div>
      </div>
    </div>

    <div id="hangar-submenu" class="hidden">
        <h2>SELECT VEHICLE</h2>
        <div id="hangar-grid"></div>
        <button id="hangar-close-btn">CLOSE</button>
    </div>
  </div>

  <!-- UPDATED: Console modal window with terminal game HTML -->
  <div id="console-modal" class="hidden">
      <div id="console-modal-content">
          <img src="LED CONSOLE 1.png" id="console-image" alt="Console Display">
          <div id="console-screen-content">
              <!-- CRT overlay and noise for the authentic feel -->
              <div class="crt-overlay"></div>
              <div class="noise-bg"></div>
              
              <!-- Main Terminal Container -->
              <div id="terminalContainer" onclick="document.getElementById('terminalInput').focus()">
                  <!-- Header Section -->
                  <div class="text-center">
                      <h1 class="glitch" style="font-family: 'Orbitron', sans-serif;">CONNECTION TERMINATED</h1>
                      <p class="text-red-500">[REASON: TEMPO LAW VIOLATION]</p>
                  </div>
                  
                  <!-- Corporate Jamming Signal -->
                  <div id="corporateBlock" class="text-center transition-opacity duration-500">
                      <p class="text-yellow-400">-- INTRUSIVE SIGNAL DETECTED --</p>
                      <pre id="corporateLogo" class="text-red-500">
  ███╗   ███╗ ██████╗ ██████╗  ██████╗ ██████╗ 
  ████╗ ████║██╔═══██╗██╔══██╗██╔═══██╗██╔══██╗
  ██╔████╔██║██║   ██║██████╔╝██║   ██║██████╔╝
  ██║╚██╔╝██║██║   ██║██╔══██╗██║   ██║██╔═══╝ 
  ██║ ╚═╝ ██║╚██████╔╝██║  ██║╚██████╔╝██║     
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     
  <span class="text-yellow-400">Tempo Authority Division</span>
                      </pre>
                      <p class="text-yellow-400">-- COMPLIANCE IS MANDATORY --</p>
                  </div>
                  
                  <!-- Command Line Area -->
                  <div id="commandLine">
                      <div id="output" class="text-green-400"></div>
                      <div class="flex items-center">
                          <span class="text-cyan-400">R.R.D:></span>
                          <span id="userInputDisplay" class="ml-2 break-all"></span>
                          <span class="cursor"></span>
                      </div>
                      <input type="text" id="terminalInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                  </div>

                  <!-- Hidden Music Player -->
                  <div id="musicPlayerContainer" class="hidden text-center">
                      <h2 class="text-cyan-400" style="font-family: 'Orbitron', sans-serif;">BROADCAST HIJACKED</h2>
                      <div id="musicPlayer">
                           <p>SECRET SONG UNLOCKED</p>
                           <p class="text-gray-400">Now Playing: "Asphalt Serenade"</p>
                           <div class="mt-1 flex items-center justify-center space-x-2">
                               <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4.018 14.38a2.5 2.5 0 003.216 3.216l9.362-4.681a2.5 2.5 0 000-4.434L7.234 3.799A2.5 2.5 0 004.018 7.015v7.365z"></path></svg>
                               <div class="w-32 h-1 bg-gray-700 rounded-full"><div class="w-1/3 h-full bg-cyan-400 rounded-full"></div></div>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
          <button id="console-close-btn">X</buttonconsole.log('REDLININ Garage v2.2.5 - Full Interactive Build');

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
        splashScreenOverlay: document.getElementById('splash-screen-overlay'),
        clickableConsole: document.getElementById('clickable-console'),
        consoleModal: document.getElementById('console-modal'),
        consoleCloseBtn: document.getElementById('console-close-btn'),
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
        lines: [ "LEMIVICE BIOS v2.2.5", "...", "Memory Check: OK", "...", "Loading REDLININ' OS...", "..." ],
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
                                elements.splashScreenOverlay.classList.remove('hidden');
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
    
    // UPDATED: Console Game Module
    const ConsoleGame = {
        elements: {},
        secretCommand: "bypass --firestarter",
        
        init() {
            this.elements = {
                input: document.getElementById('terminalInput'),
                userInputDisplay: document.getElementById('userInputDisplay'),
                output: document.getElementById('output'),
                commandLine: document.getElementById('commandLine'),
                corporateBlock: document.getElementById('corporateBlock'),
                corporateLogo: document.getElementById('corporateLogo'),
                musicPlayerContainer: document.getElementById('musicPlayerContainer'),
                container: document.getElementById('terminalContainer'),
            };
            this.handleInput = this.handleInput.bind(this);
            this.handleKeydown = this.handleKeydown.bind(this);
        },

        start() {
            this.reset();
            this.elements.input.focus();
            this.elements.input.addEventListener('input', this.handleInput);
            this.elements.input.addEventListener('keydown', this.handleKeydown);
        },

        stop() {
            this.elements.input.removeEventListener('input', this.handleInput);
            this.elements.input.removeEventListener('keydown', this.handleKeydown);
        },
        
        reset() {
            this.elements.corporateBlock.style.display = 'block';
            this.elements.corporateLogo.classList.remove('shatter-anim');
            this.elements.corporateBlock.style.opacity = '1';
            this.elements.commandLine.style.display = 'block';
            this.elements.musicPlayerContainer.classList.add('hidden');
            this.elements.output.textContent = '';
            this.elements.input.value = '';
            this.elements.userInputDisplay.textContent = '';
        },

        handleInput() {
            this.elements.userInputDisplay.textContent = this.elements.input.value;
        },

        handleKeydown(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const command = this.elements.input.value.trim().toLowerCase();
                this.processCommand(command);
                this.elements.input.value = '';
                this.elements.userInputDisplay.textContent = '';
            }
        },

        processCommand(command) {
            this.elements.output.textContent = '';
            if (command === this.secretCommand) {
                this.elements.output.innerHTML = `&gt; ${command}<br>[SUCCESS] Corporate firewall compromised. Rerouting signal...`;
                this.elements.corporateLogo.classList.add('shatter-anim');
                this.elements.corporateBlock.style.opacity = '0';
                this.elements.commandLine.style.display = 'none';

                setTimeout(() => {
                    this.elements.corporateBlock.style.display = 'none';
                    this.elements.musicPlayerContainer.classList.remove('hidden');
                }, 500);

            } else if (command) {
                this.elements.output.innerHTML = `&gt; ${command}<br>[ERROR] Unknown command or insufficient privileges. Signal jammed.`;
            }
        }
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
        elements.splashScreenOverlay.style.opacity = '0';
        setTimeout(() => {
            elements.pressStart.classList.add('hidden');
            elements.splashScreenOverlay.classList.add('hidden');
        }, 500);
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

        elements.clickableConsole.addEventListener('click', () => {
            sfxClick();
            elements.consoleModal.classList.remove('hidden');
            ConsoleGame.start();
        });
        elements.consoleCloseBtn.addEventListener('click', () => {
            sfxClick();
            elements.consoleModal.classList.add('hidden');
            ConsoleGame.stop();
        });
    }
    
    function updateMenuSelection() {
        elements.menuItems.forEach((item, index) => { item.classList.toggle('selected', index === AppState.selectedIndex); });
        const selectedItem = elements.menuItems[AppState.selectedIndex];
        if (selectedItem) { elements.menuSelector.style.opacity = '1'; elements.menuSelector.style.top = `${selectedItem.offsetTop}px`; }
    }

    BootSequence.run();
    ConsoleGame.init();
};

      </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
