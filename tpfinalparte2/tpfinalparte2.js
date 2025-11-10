let fondo;

function preload() {
fondo = loadImage('fondo.png');
}

function setup() {
createCanvas(640, 480);
textAlign(CENTER, CENTER);
textSize(40);
}

function draw() {
background(0);

if (estado === 0) {
image(fondo, 0, 0, width, height);

fill(255);
textStyle(BOLD);
textSize(56);
text("FRAGMENTADOS", width / 2, height / 2 - 100);
}

}
