console.log('REDLININ Garage v1.5.0 - Full Interactive Menu Loaded');

document.addEventListener('DOMContentLoaded', () => {
    // --- Global State & Elements ---
    let masterAudioCtx, musicAudio, sfxHover, sfxSelect, sfxDisabled, sfxConfirm, sfxClick;
    let menuActive = false;
    let selectedIndex = 0;
    let idleTimer;

    const pressStart = document.getElementById("press-start");
    const customCursor = document.getElementById("custom-cursor");
    const scene = document.getElementById("scene");
    const menuContainer = document.getElementById("menu-container");
    const menuItems = document.querySelectorAll(".menu-item");
    const menuSelector = document.getElementById("menu-selector");
    const engineGlow = document.getElementById("engine-glow");
    
    // Message Screen
    const messageScreen = document.getElementById("message-screen");
    const messageText = document.getElementById("message-text");
    const backButton = document.getElementById("back-button");

    // Jukebox
    const playPauseBtn = document.getElementById("play-pause");
    const nextBtn = document.getElementById("next-track");
    const prevBtn = document.getElementById("prev-track");
    const volumeSlider = document.getElementById("volume-slider");
    const trackNameEl = document.getElementById("track-name");
    const rpmNeedle = document.getElementById("rpm-needle");

    // --- Sound Synthesis ---
    function createAudioContext() {
        if (!masterAudioCtx) masterAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return masterAudioCtx;
    }

    function createSound(type) {
        const audioCtx = createAudioContext();
        let osc, gain;
        return () => {
            if (!audioCtx) return;
            osc = audioCtx.createOscillator();
            gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            gain.gain.setValueAtTime(0, audioCtx.currentTime);

            switch (type) {
                case 'hover': osc.type = 'triangle'; osc.frequency.setValueAtTime(440, 0); gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1); break;
                case 'select': osc.type = 'sine'; osc.frequency.setValueAtTime(660, 0); gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2); break;
                case 'disabled': osc.type = 'square'; osc.frequency.setValueAtTime(110, 0); gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1); break;
                case 'confirm': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(880, 0); osc.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 0.3); gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3); break;
                case 'click': osc.type = 'sine'; osc.frequency.setValueAtTime(1000, 0); gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.01); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05); break;
            }
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.3);
        };
    }

    // --- Music Player Logic ---
    const tracks = [ "track_01.mp3", "track_02.mp3", "track_03.mp3", "track_04.mp3", "track_05.mp3", "track_06.mp3", "track_07.mp3", "track_08.mp3", "track_09.mp3", "track_10.mp3", "track_11.mp3", "track_12.mp3", "track_13.mp3", "track_14.mp3", "track_15.mp3", "track_16.mp3", "track_17.mp3", "track_18.mp3", "track_19.mp3", "track_20.mp3" ];
    for (let i = tracks.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [tracks[i], tracks[j]] = [tracks[j], tracks[i]]; }
    let currentTrackIndex = 0;

    function setupMusicPlayer() {
        const audioCtx = createAudioContext();
        musicAudio = new Audio();
        musicAudio.loop = false;
        musicAudio.volume = volumeSlider.value;

        const source = audioCtx.createMediaElementSource(musicAudio);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128; // More detail
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = document.getElementById("visualizer");
        const ctx = canvas.getContext("2d");

        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            
            // Visualizer
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 1.2;
            let totalVolume = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2.5;
                ctx.fillStyle = `hsl(${i / bufferLength * 360}, 100%, 50%)`;
                ctx.fillRect(i * (barWidth + 1), canvas.height - barHeight, barWidth, barHeight);
                totalVolume += dataArray[i];
            }

            // RPM Meter
            const averageVolume = totalVolume / bufferLength;
            const rpmRotation = -45 + (averageVolume / 150) * 90; // Map volume to -45deg to 45deg
            rpmNeedle.style.transform = `rotate(${Math.min(45, Math.max(-45, rpmRotation))}deg)`;
        }
        draw();
    }
    
    function playTrack(direction) {
        if (direction === 'next') currentTrackIndex++;
        else if (direction === 'prev') currentTrackIndex--;
        else { /* play current */ }
        
        if (currentTrackIndex >= tracks.length) currentTrackIndex = 0;
        if (currentTrackIndex < 0) currentTrackIndex = tracks.length - 1;
        
        musicAudio.src = tracks[currentTrackIndex];
        updateTrackDisplay();
        musicAudio.play().then(() => {
            playPauseBtn.textContent = '||';
            playPauseBtn.dataset.state = 'playing';
        }).catch(e => console.error("Audio playback failed:", e));
    }

    function updateTrackDisplay() {
        const trackName = tracks[currentTrackIndex].replace('.mp3', '');
        trackNameEl.textContent = trackName;
        // Smart Marquee
        trackNameEl.classList.toggle('marquee', trackNameEl.scrollWidth > trackNameEl.clientWidth);
    }
    
    // --- Menu & Interactivity Logic ---
    function updateMenuSelection() {
        menuItems.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
                menuSelector.style.opacity = '1';
                menuSelector.style.top = `${item.offsetTop}px`;
            } else {
                item.classList.remove('selected');
            }
        });
    }

    function handleMenuAction(action) {
        sfxConfirm();
        // Confirm sequence
        menuSelector.classList.add('blink');
        engineGlow.classList.add('flare');

        setTimeout(() => {
            messageText.textContent = `LOADING ${action.toUpperCase()}...`;
            messageScreen.classList.remove('hidden');
            backButton.classList.add('visible');
            menuSelector.classList.remove('blink');
            engineGlow.classList.remove('flare');
        }, 300);
    }
    
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        document.body.classList.remove('attract-mode');
        idleTimer = setTimeout(() => {
            document.body.classList.add('attract-mode');
        }, 30000); // 30 seconds
    }
    
    // --- Event Listeners ---
    function activateStart() {
        if (menuActive) return;
        menuActive = true;

        // Create sounds
        sfxHover = createSound('hover'); sfxSelect = createSound('select');
        sfxDisabled = createSound('disabled'); sfxConfirm = createSound('confirm');
        sfxClick = createSound('click');
        
        setupMusicPlayer();
        playTrack();
        
        pressStart.style.opacity = 0;
        setTimeout(() => { 
            pressStart.style.display = "none";
            menuContainer.classList.add('visible');
        }, 1000);
        
        updateMenuSelection();
        addInteractiveListeners();
        resetIdleTimer();
    }
    
    function addInteractiveListeners() {
        // Global
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            scene.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
            resetIdleTimer();
        });
        document.addEventListener('mousedown', () => customCursor.classList.add('clicked'));
        document.addEventListener('mouseup', () => customCursor.classList.remove('clicked'));
        document.addEventListener('click', sfxClick);
        document.addEventListener('keydown', resetIdleTimer);

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (!menuActive || !messageScreen.classList.contains('hidden')) return;
            const validItems = [...menuItems].filter(item => !item.classList.contains('disabled'));
            let currentValidIndex = validItems.indexOf(menuItems[selectedIndex]);

            if (e.key === 'ArrowDown') {
                currentValidIndex = (currentValidIndex + 1) % validItems.length;
                selectedIndex = [...menuItems].indexOf(validItems[currentValidIndex]);
                sfxHover();
            } else if (e.key === 'ArrowUp') {
                currentValidIndex = (currentValidIndex - 1 + validItems.length) % validItems.length;
                selectedIndex = [...menuItems].indexOf(validItems[currentValidIndex]);
                sfxHover();
            } else if (e.key === 'Enter') {
                menuItems[selectedIndex].click(); // Trigger the item's click event
            }
            updateMenuSelection();
        });

        // Mouse Navigation & Actions
        menuItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => { if (!item.classList.contains('disabled')) { selectedIndex = index; updateMenuSelection(); sfxHover(); } });
            item.addEventListener('click', () => { if (item.classList.contains('disabled')) sfxDisabled(); else handleMenuAction(item.dataset.action); });
        });

        // Jukebox Controls
        playPauseBtn.addEventListener('click', () => {
            if (playPauseBtn.dataset.state === 'playing') { musicAudio.pause(); playPauseBtn.textContent = '►'; playPauseBtn.dataset.state = 'paused'; } 
            else { musicAudio.play(); playPauseBtn.textContent = '||'; playPauseBtn.dataset.state = 'playing'; }
        });
        nextBtn.addEventListener('click', () => playTrack('next'));
        prevBtn.addEventListener('click', () => playTrack('prev'));
        musicAudio.addEventListener('ended', () => playTrack('next'));
        volumeSlider.addEventListener('input', (e) => musicAudio.volume = e.target.value);

        // Back Button
        backButton.addEventListener('click', () => {
            messageScreen.classList.add('hidden');
            backButton.classList.remove('visible');
        });
    }

    // --- Initial Entry Point ---
    document.addEventListener("keydown", activateStart, { once: true });
    document.addEventListener("click", activateStart, { once: true });
});
