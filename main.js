const input = document.getElementById('input');

// create web audio api elements 

const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// create Oscillator node 

const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";



notenames = new Map();
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
notenames.set("A", 440);
notenames.set("B", 493.9);

oscillator.start()
gainNode.gain.value = 0;


function frequency(pitch) {
        
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);

}

function handle() {
    frequency(input.value);
    audioCtx.resume()
    gainNode.gain.value = 0;
    var usernotes = String(input.value);
    frequency(notenames.get(usernotes));
}