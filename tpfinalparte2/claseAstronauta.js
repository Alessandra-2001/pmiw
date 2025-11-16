class Astronauta {//la clase del jugador
  constructor(posX, posY) {//El constructor recibe la posición inicial del astronauta
    this.posX = posX;
    this.posY = posY;
    this.tam = 80;//Ancho del astronauta en px
    this.alto = this.tam;//Alto del astronauta
    this.balas = [];//Arreglo que guarda todas las balas disparadas
  }

  dibujar() {//Método para dibujar al astronauta y sus balas
    image(astronautaImg, this.posX, this.posY, this.tam, this.alto);

    for (this.i = 0; this.i < this.balas.length; this.i++) {//ciclo for que recorre todas las balas que existen
      this.balas[this.i].mover();//mueve la bala
      this.balas[this.i].dibujar();//la dibuja

      if (this.balas[this.i].activa === false) {//si una bala está inactiva (sale de la pantalla) se elimina del arreglo
        for (this.j = this.i; this.j < this.balas.length - 1; this.j++) {//este for corre todos los elementos a la izquierda para rellenar el hueco que deja la bala eliminada
          this.balas[this.j] = this.balas[this.j + 1];
        }
        this.balas.length = this.balas.length - 1;//reduce el tamaño del arreglo
        this.i = this.i - 1;//retrocede un índice para no saltear ninguna bala (porque se movió a la posición del eliminado)
      }
    }
  }
//MOVIMIENTO DEL ASTRONAUTA
  moverIzquierda() {
    this.posX = this.posX - 10; //10 px a la izq
    if (this.posX < 0) this.posX = 0;//sin salir del borde izq
  }

  moverDerecha() {
    this.posX = this.posX + 10;//10 px a la derecha
    if (this.posX > width - this.tam) this.posX = width - this.tam;//sin salir del borde derecho
  }

  dispararBala() {//método para crear una bala
    this.bX = this.posX + this.tam / 2;//la bala sale desde el centro horizontal del astronauta
    this.bY = this.posY;//la bala sale desde la parte superior del astronauta
    this.balas[this.balas.length] = new Bala(this.bX, this.bY);//crea una nueva bala y la agrega al final del arreglo
    if (disparo && disparo.isLoaded()) {
      disparo.amp(0.9);  
      disparo.play();//sonido del disparo
    }
  }
}
