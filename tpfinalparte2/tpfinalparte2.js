//Alessandra Angiolillo y Nicole Condoleo
//Comisión 1
//Link de Drive(video de la parte de mi compañera): https://drive.google.com/drive/u/2/folders/15LyjW-AuLGKGRlsSSjucJYiky8x25CXR
//Link de Youtube: https://www.youtube.com/watch?v=S8Acfa3pdhI

let juego;//variable global que contiene el objeto principal del juego, una instancia de la clase Juego
let fondo, contexto, astronautaImg, explosionImg;
let fragmentosBuenos = [];
let fragmentosMalos = [];
let disparo, click, loop, explo;

function preload() {
  fondo = loadImage("data/fondo.png");
  contexto = loadImage("data/contexto.png");
  astronautaImg = loadImage("data/astronauta.png");
  explosionImg = loadImage("data/explosion.png");

  for (let i = 0; i < 3; i++) {
    fragmentosBuenos[i] = loadImage("data/fragbueno" + (i + 1) + ".png");
    fragmentosMalos[i] = loadImage("data/fragmalo" + (i + 1) + ".png");
  }

  disparo = loadSound("data/disparo.mp3");
  click = loadSound("data/click.mp3");
  loop = loadSound("data/loop.mp3");
  explo = loadSound("data/explo.mp3");
}

function setup() {
  createCanvas(640, 480);
  juego = new Juego(fondo, contexto);//crea la instancia del juego
}

function draw() {
  background(0);
  juego.dibujar();
}

function keyPressed() {
  juego.keyPresionado(keyCode);//cuando el jugador toca una tecla, p5 llama a este método de la clase Juego
 
}

function mousePressed() {
  juego.mousePresionado();//si se hace click, delego el evento al objeto juego, que decide si el click sirve o no según la pantalla
}
