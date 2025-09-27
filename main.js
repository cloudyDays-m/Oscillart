const input = document.getElementById('input');
const color_picker = document.getElementById('color');
const vol_slider = document.getElementById('vol-slider');
const fill_checkbox = document.getElementById('fill-checkbox')

// create web audio api elements 
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// create Oscillator node 
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

// define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;
var amplitude = 40;
var interval = null
var x,y;
var reset = false;
var timepernote = 0; // how long the time should be to play each note
var length = 0 // length of notes list
var blob, recorder = null;
var chunks = []
var setting = null;
 
notenames = new Map();
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
notenames.set("A", 440);
notenames.set("B", 493.9);
notenames.set("c", 261.6);
notenames.set("d", 293.7);
notenames.set("e", 329.6);
notenames.set("f", 349.2);
notenames.set("g", 392.0);
notenames.set("a", 440);
notenames.set("b", 493.9);

oscillator.start()
gainNode.gain.value = 0;

function frequency(pitch) {
    gainNode.gain.setValueAtTime(vol_slider.value/100, audioCtx.currentTime);    
    setting = setInterval(() => {gainNode.gain.value = vol_slider.value/100}, 1);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime); 
    setTimeout(() => {clearInterval(setting); gainNode.gain.value = 0;}, ((timepernote) - 10))       
}

function handle() {
    reset = true;
    audioCtx.resume();

    var usernotes = String(input.value);
    var noteslist = [];

    length = usernotes.length;
    timepernote = (6000/length);

    for (i = 0; i < usernotes.length; i++) {
    noteslist.push(notenames.get(usernotes.charAt(i)));
    }

    let j = 0;
    var repeat = setInterval(() => {
        if (j < noteslist.length) {
            frequency(parseInt(noteslist[j]));
            drawWave(noteslist[j]); 
        j++
        } else {
            clearInterval(repeat)
            oscillator.stop(); 
        }
    }, timepernote)
}

var counter = 0;

function drawWave(pitch) {
    if (interval) {
        clearInterval(interval);
    }

    counter = 0;
   if (reset) {
    ctx.clearRect(0 , 0, width , height);
    x = 0;
    y = height/2;
    ctx.moveTo(x,y);
    ctx.beginPath();
     reset = false;

   }

    interval = setInterval(function() {
        line(pitch);
    }, 20);

}

function line(pitch) {
    var freq = pitch / 10000;  
    y = height/2 + ( ((vol_slider.value/100)*40) * Math.sin(x * 2 * Math.PI * freq * (0.5 * length))); // calculates length for longer waves for more notes and shorter waves for smaller number of notes
    ctx.lineTo(x, y);
    x++;
    counter++;
    ctx.strokeStyle = color_picker.value;

    if (counter > Math.floor(timepernote/20)) { 
        clearInterval(interval);

        if (fill_checkbox.checked) {
            ctx.lineTo(x, height);
            ctx.lineTo(0, height);
            ctx.lineTo(0, height/2);
            ctx.closePath();

            ctx.fillStyle = color_picker.value + '40';
            ctx.fill();
        }
    }

    ctx.stroke();

    if (rotate_checkbox.checked) {
        ctx.restore(); // restores canvas to original
    }
}

function startRecording() {
    chunks = [];
    const canvasStream = canvas.captureStream(20); // captures canvas every 20 frames
    const audioDestination = audioCtx.createMediaStreamDestination();
    gainNode.connect(audioDestination); 
    const combinedStream = new MediaStream();

    canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
    audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
    
    recorder = new MediaRecorder(combinedStream, {mimeType: 'video/webm'}); 
 
    
    recorder.ondataavailable = e => {
        if (e.data.size > 0) {
        chunks.push(e.data);
        }
    }

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.webm';
        a.click();
        URL.revokeObjectURL(url);
    }

    recorder.start();

}

var is_recording = false; 

const recording_toggle = document.getElementById('record');

function toggle() {
    is_recording = !is_recording;
    if (is_recording){
        recording_toggle.innerHTML = "Stop Recording";
        startRecording();

    } else {
        recording_toggle.innerHTML = "Start Recording";
        if (recorder && recorder.state === 'recording') {
             recorder.stop();
        } 
    }

}