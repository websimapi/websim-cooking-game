let audioContext;
const soundBuffers = new Map();

export function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

async function loadSound(url) {
    if (soundBuffers.has(url)) {
        return soundBuffers.get(url);
    }

    if (!audioContext) {
        console.warn("Audio context not initialized. Call initAudio() first.");
        return null;
    }

    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        soundBuffers.set(url, audioBuffer);
        return audioBuffer;
    } catch (error) {
        console.error(`Error loading sound: ${url}`, error);
        return null;
    }
}

export async function playSound(url) {
    if (!audioContext) {
        console.warn("Audio context not initialized. Call initAudio() first, likely from a user interaction.");
        return;
    }

    let buffer = await loadSound(url);

    if (buffer) {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
    }
}

// Preload sounds if desired
export function preloadSounds(urls) {
    urls.forEach(url => loadSound(url));
}

