class Bala {//cada bala que el astronauta dispare será un objeto creado a partir de esta clase
  constructor(x, y) { //El constructor recibe dos parámetros: posición horizontal inicial de la bala y posición vertical inicial
    this.posX = x;
    this.posY = y;
    this.tam = 10;//tamaño de la bala, diámetro de la ellipse=las balas son círculos de 10px
    this.vel = 8;//la bala sube 8 píxeles x frame
    this.activa = true;//indica si la bala está activa
  }

  mover() {
    if (this.activa === true) {//si la bala está activa
      this.posY = this.posY - this.vel;//la bala sube (porque se resta Y, el eje Y empieza arriba (en 0) y aumenta hacia abajo)
      if (this.posY < -this.tam) this.activa = false;//si la bala salió por arriba de la pantalla, se desactiva. -this.tam asegura que salga del todo
    }
  }

  dibujar() {
    if (this.activa === true) {//si la bala está activa
      noStroke();
      fill(100, 200, 255);
      ellipse(this.posX, this.posY, this.tam, this.tam);//se dibuje una ellipse celeste sin borde en la posicion inicial de la bala
    }
  }
}
