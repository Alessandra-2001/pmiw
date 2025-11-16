class Fragmento {
  constructor(x, y, img, tipo) {
    this.x = x;//posicion en x inicial del fragmento
    this.y = y;//posicion en y inicial
    this.img = img;
    this.tipo = tipo;//tipo: bueno o malo (para decidir efecto al colisionar)
    this.tam = 60;//tamaño del fragmento (ancho y alto en píxeles)
    this.vel = random(1, 3);//velocidad vertical (pixels x frame), elegida aleatoriamente entre 1 y 3 (si vel = 3, baja 3 píxeles por frame, más rápido)
  }

  mover() {
    this.y = this.y + this.vel;//mueve el fragmento hacia abajo según su velocidad
    if (this.y > height + this.tam)//si pasó completamente por debajo de la pantalla
    this.reiniciar();//lo reinicia (lo hace reaparecer arriba con nuevos valores)
  }

  dibujar() {
    image(this.img, this.x, this.y, this.tam, this.tam); //dibuja la imagen del fragmento en (x,y) con tamaño tamxtam: el primer this.tam es el ancho, el segundo this.tam es el alto, valen 60 ambos)
  }

  reiniciar() {
    this.x = random(20, width - 80);//nueva posición horizontal aleatoria desde fuera de la pantalla
    this.y = random(-600, -50);// nueva posición vertical arriba de la pantalla
    this.vel = random(1, 3);//nueva velocidad aleatoria entre 1 y 3
  }
}
