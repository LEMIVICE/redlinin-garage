console.log('REDLININ Garage v1.4.0 - Full Interactive Menu Loaded');

document.addEventListener('DOMContentLoaded', () => {

    // --- Global State & Elements ---
    let masterAudioCtx; // The single AudioContext for all sounds
    let musicAudio, visualizer, trackDisplay;
    let menuActive = false;
    let selectedIndex = 0;

    const pressStart = document.getElementById("press-start");
    const scene = document.getElementById("scene");
    const menuItems = document.querySelectorAll(".menu-item");
    const menuSelector = document.getElementById("menu-selector");
    const trackNameEl = document.getElementById("track-name");
    const messageScreen = document.getElementById("message-screen");
    const messageText = document.getElementById("message-text");

    // --- Sound Synthesis (No external files needed!) ---
    let sfxHover, sfxSelect, sfxDisabled;

    function createAudioContext() {
        if (!masterAudioCtx) {
            masterAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return masterAudioCtx;
    }

    function createSound(type) {
        const audioCtx = createAudioContext();
        let oscillator, gainNode;

        return () => {
            if (!audioCtx) return;
            oscillator = audioCtx.createOscillator();
            gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

            switch (type) {
                case 'hover':
                    oscillator.type = 'triangle';
                    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
                    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
                    break;
                case 'select':
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(660, audioCtx.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
                    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
                    break;
                case 'disabled':
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(110, audioCtx.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
                    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
                    break;
            }
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.2);
        };
    }

    // --- Music Player Logic ---
    const tracks = [
      "track_01.mp3", "track_02.mp3", "track_03.mp3", "track_04.mp3", "track_05.mp3",
      "track_06.mp3", "track_07.mp3", "track_08.mp3", "track_09.mp3", "track_10.mp3",
      "track_11.mp3", "track_12.mp3", "track_13.mp3", "track_14.mp3", "track_15.mp3",
      "track_16.mp3", "track_17.mp3", "track_18.mp3", "track_19.mp3", "track_20.mp3"
    ];

    // Fisher-Yates shuffle
    for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
    let currentTrackIndex = 0;

    function setupMusicPlayer() {
        const audioCtx = createAudioContext();
        musicAudio = new Audio();
        musicAudio.loop = false;
        musicAudio.volume = 0.8;

        const source = audioCtx.createMediaElementSource(musicAudio);
        const analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = document.getElementById("visualizer");
        const ctx = canvas.getContext("2d");

        function drawVisualizer() {
            requestAnimationFrame(drawVisualizer);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 1.5;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2.5;
                ctx.fillStyle = 'lime';
                ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
            }
        }
        drawVisualizer();
    }
    
    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        musicAudio.src = tracks[currentTrackIndex];
        trackNameEl.textContent = tracks[currentTrackIndex].replace('.mp3', '');
        musicAudio.play();
    }


    // --- Menu Logic ---
    function updateMenuSelection() {
        menuItems.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
                // Move selector
                menuSelector.style.opacity = '1';
                menuSelector.style.top = `${item.offsetTop}px`;
            } else {
                item.classList.remove('selected');
            }
        });
    }

    function handleMenuAction(action) {
        messageText.textContent = `LOADING ${action.toUpperCase()}...`;
        messageScreen.classList.remove('hidden');

        // Simulate loading
        setTimeout(() => {
            messageScreen.classList.add('hidden');
        }, 2000);
    }
    
    // --- Event Listeners ---
    function activateStart() {
        if (menuActive) return;
        menuActive = true;

        // Create sounds on first user interaction
        sfxHover = createSound('hover');
        sfxSelect = createSound('select');
        sfxDisabled = createSound('disabled');
        
        // Setup and start music
        setupMusicPlayer();
        playNextTrack();
        musicAudio.addEventListener('ended', playNextTrack);

        pressStart.style.transition = "opacity 1s ease-out";
        pressStart.style.opacity = 0;
        setTimeout(() => { pressStart.style.display = "none"; }, 1000);
        
        // Initial menu selection
        updateMenuSelection();
        
        // Add all interactive event listeners now
        addInteractiveListeners();
    }
    
    function addInteractiveListeners() {
        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (!menuActive) return;

            let validItems = [...menuItems].filter(item => !item.classList.contains('disabled'));
            let currentItemIndexInValid = validItems.indexOf(menuItems[selectedIndex]);

            if (e.key === 'ArrowDown') {
                currentItemIndexInValid = (currentItemIndexInValid + 1) % validItems.length;
                selectedIndex = [...menuItems].indexOf(validItems[currentItemIndexInValid]);
                sfxHover();
            } else if (e.key === 'ArrowUp') {
                 currentItemIndexInValid = (currentItemIndexInValid - 1 + validItems.length) % validItems.length;
                selectedIndex = [...menuItems].indexOf(validItems[currentItemIndexInValid]);
                sfxHover();
            } else if (e.key === 'Enter') {
                const selectedItem = menuItems[selectedIndex];
                 if (selectedItem.classList.contains('disabled')) {
                    sfxDisabled();
                } else {
                    sfxSelect();
                    handleMenuAction(selectedItem.dataset.action);
                }
            }
            updateMenuSelection();
        });

        // Mouse Navigation
        menuItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                if (!item.classList.contains('disabled')) {
                    selectedIndex = index;
                    updateMenuSelection();
                    sfxHover();
                }
            });

            item.addEventListener('click', () => {
                if (item.classList.contains('disabled')) {
                    sfxDisabled();
                } else {
                    sfxSelect();
                    handleMenuAction(item.dataset.action);
                }
            });
        });

        // Parallax Effect
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

            scene.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
        });
    }

    // --- Initial Entry Point ---
    document.addEventListener("keydown", activateStart, { once: true });
    document.addEventListener("click", activateStart, { once: true });
});