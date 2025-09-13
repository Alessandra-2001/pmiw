//Angiolillo Alessandra
//Comision 1
//https://www.youtube.com/watch?v=5yUobVnegPw
//Titulo de la obra: "Entre circulos"

//Variables globales:
let img;  //para cargar la imagen
let cant = 17; //para la cantidad de círculos enteros de la primera fila y columna de la obra
let mouseEnBoton = false; //para detectar si el mouse está sobre el botón de reinicio

function preload() { 
img = loadImage('data/15.png'); 
}

function setup() {                     
createCanvas(800, 400); 
}

function draw() {                      
background(0);

image(img, 0, 0); //dibuja la imagen cargada en la posición (0,0)

dibujarOpArt(410, 0, 400, 400); //llama a la función que dibuja la obra a la derecha 
dibujarBotonDeReinicio(400, 350, 120, 30); //dibuja el botón de reinicio
}


//función con parámetros que no retorna un valor
function dibujarOpArt(inicioX, inicioY, ancho, alto) {
let paso = ancho / cant; //distancia entre círculos (cuanto más "cant", más chicos y más apretados)
let maxTam = paso + 10;  //tamaño máximo permitido para los círculos
let margen = maxTam / 2; //margen para centrar mejor los círculos
let radioDegrade = 80;   //radio en el que ocurre el degradado desde el centro
let maxDist2 = (ancho / 2) * (ancho / 2) + (alto / 2) * (alto / 2); //distancia máxima al cuadrado desde el centro

let columnas = int((ancho + 2 * margen) / paso) + 1; //número de columnas de círculos
let filas = int((alto + 2 * margen) / paso) + 1;     //número de filas de círculos

for (let i = 0; i < columnas; i++) { //recorre todas las columnas
for (let j = 0; j < filas; j++) { //recorre todas las filas
let x = -margen + i * paso; //coordenada x del círculo
let y = -margen + j * paso; //coordenada y del círculo
 //en -margen se desplaza toda la grilla un poco hacia arriba a la izquierda para compensar el tamaño de los círculos

let cx = x - ancho / 2; //diferencia en x respecto al centro
let cy = y - alto / 2;  //diferencia en y respecto al centro
let distCentro = dist(ancho / 2, alto / 2, x, y); //distancia real del círculo al centro

let tam = map(cx * cx + cy * cy, 0, maxDist2, 4, paso + 5); //escala del tamaño según la distancia al centro

if (distCentro <= radioDegrade) {  //si está dentro del área del degradado
let relacionDistancia = distCentro / radioDegrade; //relación de la distancia respecto al radio
let tono = map(relacionDistancia, 0, 1, 0, 255);  //escala el tono de gris según la distancia
let tamDegrade = map(relacionDistancia, 0, 1, 0, tam); //escala el tamaño según la distancia
fill(tono);  //color de relleno en escala de grises
dibujarCirculo(inicioX + x, inicioY + y, tamDegrade); //dibuja círculo con degradado
} else {
fill(255); //si está fuera del degradado, color blanco
dibujarCirculo(inicioX + x, inicioY + y, tam); //dibuja el círculo normal
}
}
}
}


//función con parámetros que sí retorna un valor
function estaEnDerecha() {
return mouseX > 400; //devuelve true si el mouse está en la derecha en mi obra
}

function ZonaBoton(x1, y1, x2, y2) {
return mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2; //devuelve true si el mouse está dentro del área del botón
}

function dibujarCirculo(x, y, tam) {
push(); //guarda la configuración actual del dibujo
translate(x, y); //traslada el punto de referencia al centro del círculo

if (mouseIsPressed && !mouseEnBoton && estaEnDerecha()) { //si el mouse está presionado fuera del botón en la derecha
fill(random(255), random(255), random(255)); //cambia a un color aleatorio
}

noStroke(); 
ellipse(0, 0, tam, tam);
pop(); //restaura la configuración anterior del dibjo
}

function dibujarBotonDeReinicio(x, y, ancho, alto) {
if (ZonaBoton(x, y, x + ancho, y + alto)) { //si el mouse está sobre el botón
fill(0, 90, 0); //el botón se pone verde oscuro
mouseEnBoton = true; //marca que el mouse está en el botón
} else {
fill(170, 0, 0); //el botón es rojo cuando el mouse no está encima
mouseEnBoton = false; //marca que el mouse no está en el botón
}

stroke(0);  
rect(x, y, ancho, alto, 10);  //valor del radio de los vértices 10 para redondearlos

fill(255);  //texto en blanco
textAlign(CENTER, CENTER); //centra el texto en el botón
textSize(17);
text('REINICIAR', x + ancho / 2, y + alto / 2); 
}

function mousePressed() {
if (mouseEnBoton) {  //si se presiona el botón de reinicio
cant = 17;  //reinicia la cantidad de círculos a 17 en la primera fila y columna
} else if (estaEnDerecha()) { //si se hace click en la zona derecha
if (cant < 60) { //mientras no supere 60 círculos
cant += 5; //aumenta -la cantidad de círculos en 5
}
}
}
