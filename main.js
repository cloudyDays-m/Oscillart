const input = document.getElementById('input');

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
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);           
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime); 
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);       
}

function handle() {
    audioCtx.resume();

    var usernotes = String(input.value);
    var noteslist = [];
    for (i = 0; i < usernotes.length; i++) {
    noteslist.push(notenames.get(usernotes.charAt(i)));
    }

    let j = 0;
    repeat = setInterval(() => {
        if (j < noteslist.length) {
            frequency(parseInt(noteslist[j]));
            drawWave(noteslist[j]); 
        j++
        } else {
            clearInterval(repeat)
        }
    }, 1000)
}

var counter = 0;

function drawWave(pitch) {
    if (interval) {
        clearInterval(interval);
    }

    counter = 0;
    ctx.clearRect(0, 0, width, height);
    x = 0;
    y = height/2;

    ctx.moveTo(x,y);
    ctx.beginPath(); 
    interval = setInterval(function() {
        line(pitch);
    }, 20);
}

function line(pitch) {
    var freq = pitch / 10000;  
    y = height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq));
    ctx.lineTo(x, y);
    ctx.stroke();
    x++;
    counter++;

    if (counter > 100) { 
        clearInterval(interval);
    }
}
