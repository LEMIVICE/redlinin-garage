console.log('REDLININ Garage v1.3.0 with embedded MP3 player loaded.');

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const pressStart = document.getElementById("press-start");
    const visualizerCanvas = document.getElementById("visualizer");
    const ctx = visualizerCanvas.getContext("2d");

    // --- Audio Player Logic ---
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
    const audio = new Audio(tracks[currentTrackIndex]);
    audio.loop = false;
    audio.volume = 1;

    let audioCtx, analyser, source;

    function initAudio() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function drawVisualizer() {
            requestAnimationFrame(drawVisualizer);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
            const barWidth = (visualizerCanvas.width / bufferLength) * 1.5;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2.5;
                ctx.fillStyle = 'lime';
                ctx.fillRect(i * barWidth, visualizerCanvas.height - barHeight, barWidth - 2, barHeight);
            }
        }
        drawVisualizer();
    }

    audio.addEventListener('ended', () => {
      currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
      audio.src = tracks[currentTrackIndex];
      audio.play();
    });

    // --- Start Experience ---
    function activateStart() {
      // Prevent running this more than once
      if (pressStart.style.display === 'none') return;

      pressStart.style.transition = "opacity 1s ease-out";
      pressStart.style.opacity = 0;
      setTimeout(() => { pressStart.style.display = "none"; }, 1000);

      if (!audioCtx) {
        initAudio();
      }
      audioCtx.resume();
      audio.play();
    }

    document.addEventListener("keydown", activateStart, { once: true });
    document.addEventListener("click", activateStart, { once: true });
});