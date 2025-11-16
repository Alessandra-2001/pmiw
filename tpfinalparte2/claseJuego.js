class Juego {//la clase principal del programa, el núcleo del juego, administra pantallas, estados, objetos y lógica
  constructor(fondoImg, contextoImg) {
    //Propiedades:
    //para las imágenes que vienen desde el preload
    this.fondo = fondoImg;
    this.contexto = contextoImg;

    //que controla en qué pantalla está el juego
    this.pantalla = "inicio"; 
    
    //que controlan el tamaño único de todos los botones
    this.botonAncho = 220;
    this.botonAlto = 70;

    //crea el jugador en esa posición inicial
    this.astronauta = new Astronauta(width / 2 - 40, height - 110);

    //arreglo que guarda todos los fragmentos activos en pantalla
    this.fragmentos = [];

    //Parámetros del juego
    this.totalFragmentos = 12;//inicia con 12 fragmentos
    this.vidas = 3;//del jugador
    this.inicioFrame = 0;
    this.duracionFrames = 60 * 60;//duración de la partida: 60 segundos (60 fps × 60)

    //Explosión
    this.mostrarExplosion = false;//indica si hay una explosión visible
    //posición de la explosión
    this.explosionX = 0;
    this.explosionY = 0;
    this.explosionFrame = 0;//frame donde inició la explosión

    //Fade de pantallas finales
    this.tiempoFinal = 0;
    this.alphaFinal = 0;
  }

  dibujar() {//máquina de estados:cada estado delega en un método
    if (this.pantalla === "inicio") this.mostrarInicio();
    else if (this.pantalla === "contexto") this.mostrarContexto();
    else if (this.pantalla === "instrucciones") this.mostrarInstrucciones();
    else if (this.pantalla === "juego") this.mostrarJuego();
    else if (this.pantalla === "gameover") this.mostrarGameOver();
    else if (this.pantalla === "ganaste") this.mostrarGanaste();
    else if (this.pantalla === "creditos") this.mostrarCreditos();
  }

//Método para mostrar la pantalla de inicio
  mostrarInicio() {
    image(this.fondo, 0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(52);
    text("FRAGMENTADOS", width / 2, height / 2 - 40);
    this.dibujarBoton(width / 2, height / 2 + 60, "INICIAR");
  }

//Método para mostrar la segunda pantalla, el contexto del juego
  mostrarContexto() {
    image(this.contexto, 0, 0, width, height);

    fill(0, 0, 0, 170);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 20, 520, 160, 18);//cuadro negro translúcido para que se lea mejor

    fill(255);
    textAlign(CENTER, TOP);
    textSize(22);
    text("La nave estalló y los astronautas quedan dispersos,", width / 2, height / 2 - 60);
    text("ahora deberán esquivar todos los fragmentos.", width / 2, height / 2 - 30);
    this.dibujarBoton(width / 2, height / 2 + 70, "SIGUIENTE");
  }
  
//Método para mostrar la tercer pantalla
  mostrarInstrucciones() {
    image(this.fondo, 0, 0, width, height);

    rectMode(CORNER);
    fill(0, 0, 0, 170);
    rect(width / 2 - 280, height / 2 - 170, 560, 340, 18);

    textAlign(CENTER, TOP);
    textSize(26);
    fill(135, 211, 247);
    text("INSTRUCCIONES:", width / 2, height / 2 - 150);

    fill(255);
    textSize(17);
    text(
      "Sobreviví durante un minuto esquivando y disparando fragmentos.\n\n" +
        "Mover: Flechas izquierda / derecha\n" +
        "Disparar: Barra espaciadora\n\n" +
        "Evitar los fragmentos: todos quitan vidas al tocarlos.\n" +
        "Tené cuidado con los fragmentos rojos: explotan al dispararlos.",
      width / 2 - 260,
      height / 2 - 120,
      520,
      300
    );

    rectMode(CENTER);
    this.dibujarBoton(width / 2, height / 2 + 150, "JUGAR");
  }

//Método para mostrar el juego
  iniciarJuego() {
//cambiar pantalla
    this.pantalla = "juego";

//reiniciar astronauta y estado de la partida: fragmentos y vidas
    this.astronauta = new Astronauta(width / 2 - 40, height - 110);
    this.fragmentos = [];
    this.vidas = 3;

//crear 12 fragmentos
    for (this.i = 0; this.i < this.totalFragmentos; this.i++) {
      this.tipo = "bueno";//por defecto es bueno
      this.img = fragmentosBuenos[int(random(3))];
      if (random(1) < 0.5) {//con %50 de probabilidad es malo
        this.tipo = "malo";
        this.img = fragmentosMalos[int(random(3))];
      }
//crea el fragmento y lo agrega al arreglo, la posición inicial es fuera de la pantalla porque caen desde arriba
      this.fragmentos[this.fragmentos.length] = new Fragmento(
        random(20, width - 80),
        random(-600, -50),
        this.img,
        this.tipo
      );
    }

//iniciar temporizador 
    this.inicioFrame = frameCount;

//iniciar música de loop para el juego
    if (loop && loop.isLoaded) {
      loop.stop();
      loop.amp(0.35);
      loop.loop();
    }
  }

//método para mostrar la pantalla del juego
  mostrarJuego() {
    image(this.fondo, 0, 0, width, height);

//interfaz de usuario que muestra información importante sobre el juego en la pantalla mientras se juega
    fill(255);
    textSize(18);
    textAlign(LEFT, TOP);
    text("Vidas: " + this.vidas, 20, 14);//dibuja vidas en 20x y 14y

    this.segundosPasados = int((frameCount - this.inicioFrame) / 60);//calcula el tiempo
    this.restante = 60 - this.segundosPasados;//tiempo restante para el minuto (this.segundosPasados es el tiempo que ya pasó desde que inició el juego)
    if (this.restante < 0) this.restante = 0;//evita que aparezcan números negativos en el contador (si el tiempo restante es menor que 0, vale 0)
    textAlign(RIGHT, TOP);
    text("Tiempo: " + this.restante + " s", width - 20, 14);

//dibujar astronauta
    this.astronauta.dibujar();

//fragmentos:
    for (this.i = 0; this.i < this.fragmentos.length; this.i++) {
      this.fragmentos[this.i].mover();//mover el fragmento según su velocidad interna
      this.fragmentos[this.i].dibujar();//dibujar el fragmento en pantalla

//COLISIÓN: entre fragmento y astronauta
//centro del astronauta (para medir distancias)
      this.cxA = this.astronauta.posX + this.astronauta.tam / 2;
      this.cyA = this.astronauta.posY + this.astronauta.alto / 2;
//centro del fragmento actual
      this.cxF = this.fragmentos[this.i].x + this.fragmentos[this.i].tam / 2;
      this.cyF = this.fragmentos[this.i].y + this.fragmentos[this.i].tam / 2;
      
//distancia entre astronauta y fragmento
      this.d = dist(this.cxA, this.cyA, this.cxF, this.cyF);
      
//si la distancia es menor que la suma de radios es porque hay colisión
      if (this.d < (this.astronauta.tam / 2 + this.fragmentos[this.i].tam / 3)) {
        this.vidas = this.vidas - 1; //y perdes una vida
        this.fragmentos[this.i].reiniciar();//fragmento vuelve arriba, reinicia su posición
        if (this.vidas <= 0) {//si se queda sin vidas, el juego termina y para la música
          if (loop && loop.isPlaying()) loop.stop();
        //fadeout para pantalla final
          this.pantalla = "gameover";
          this.tiempoFinal = frameCount;
          this.alphaFinal = 0;
          return;
        }
      }

//COLISIÓN: entre fragmento y bala
      for (this.j = 0; this.j < this.astronauta.balas.length; this.j++) {
        if (this.astronauta.balas[this.j].activa === true) {//balas activas
        //distancia entre bala y el centro del fragmento
          this.db = dist(
            this.astronauta.balas[this.j].posX,
            this.astronauta.balas[this.j].posY,
            this.cxF,
            this.cyF
          );
          //si distancia es menor que el tamaño del fragmento, hay colisión
          if (this.db < this.fragmentos[this.i].tam / 2) {
            if (this.fragmentos[this.i].tipo === "bueno") {
              this.fragmentos[this.i].reiniciar();
              this.astronauta.balas[this.j].activa = false;//si el fragmento es bueno, desaparece
            } else {
             //si el fragmento es malo:  
              this.vidas = this.vidas - 1;//pierde vida
              this.fragmentos[this.i].reiniciar();//fragmento vuelve arriba
              this.astronauta.balas[this.j].activa = false;//bala desaparece

              if (explo && explo.isLoaded) {//sonido de que explota
                explo.amp(0.4);
                explo.play();
              }

              this.mostrarExplosion = true;//activa explosión en la posición del fragmento
              this.explosionX = this.cxF - 150;
              this.explosionY = this.cyF - 150;
              this.explosionFrame = frameCount;

              if (this.vidas <= 0) {//si ya no hay mas vidas, se termina el juego
                if (loop && loop.isPlaying()) loop.stop();
               
                this.pantalla = "gameover";
                this.tiempoFinal = frameCount;
                this.alphaFinal = 0;
                return;
              }
            }
          }
        }
      }
    }

    //dibujar explosión durante 30 frames
    if (this.mostrarExplosion && frameCount - this.explosionFrame < 30) {
      image(explosionImg, this.explosionX, this.explosionY, 300, 300);
    } else {
      this.mostrarExplosion = false;
    }

    //si completa el tiempo: gana
    if (frameCount - this.inicioFrame > this.duracionFrames) {
      if (loop && loop.isPlaying()) loop.stop();
      //iniciar fade y cambia pantalla
      this.pantalla = "ganaste";
      this.tiempoFinal = frameCount;
      this.alphaFinal = 0;
    }
  }

//método para mostrar la pantalla de la derrota
  mostrarGameOver() {
    image(this.fondo, 0, 0, width, height);


    if (this.alphaFinal < 255) {//si el valor alphaFinal es menor que 255 (opaco)
      this.alphaFinal += 5;//lo incrementa en 5 unidades por frame (efecto de fade-in del texto)
    }


    fill(0, 150);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 10, 420, 200, 20);//dibuja un cuadro de texto negro translúcido detrás del texto


    fill(255, this.alphaFinal); //color del texto usando alphaFinal para la transparencia
    textAlign(CENTER, CENTER);
    textSize(48);
    text("GAME OVER", width / 2, height / 2 - 50);

    //después de 180 frames (3 segundos) pasa a la pantalla de CRÉDITOS
    if (frameCount - this.tiempoFinal > 180) {
      this.pantalla = "creditos";
    }
  }

//método para mostrar la pantalla de la victoria
  mostrarGanaste() {
    image(this.fondo, 0, 0, width, height);


    if (this.alphaFinal < 255) {
      this.alphaFinal += 5;
    }

    fill(0, 150);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 10, 420, 200, 20);

    fill(255, this.alphaFinal);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("¡GANASTE!", width / 2, height / 2 - 50);

    if (frameCount - this.tiempoFinal > 180) {
      this.pantalla = "creditos";
    }
  }

//ÚLTIMA PANTALLA DE CRÉDITOS
mostrarCreditos() {
  image(this.fondo, 0, 0, width, height);

  fill(0, 150);
  rectMode(CENTER);
  rect(width / 2, height / 2 - 10, 520, 230, 20);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(26);
  text("Alessandra Angiolillo – Nicole Condoleo", width / 2, height / 2 - 80);

  textSize(24);
  text("Comisión 1", width / 2, height / 2 - 40);

  // botones
  this.dibujarBoton(width / 2 - 140, height / 2 + 60, "VOLVER A JUGAR");
  this.dibujarBoton(width / 2 + 140, height / 2 + 60, "VOLVER AL INICIO");
}

//Dibujar botones
  dibujarBoton(cx, cy, texto) {//dibuja un botón centrado en (cx, cy) con texto
    rectMode(CENTER);//para que rect(cx,cy,...) tome cx,cy como el centro
    this.w = this.botonAncho;//que el ancho del botón valga lo mismo quela propiedad de la clase
    this.h = this.botonAlto;//idem

    if (mouseX > cx - this.w / 2 && mouseX < cx + this.w / 2 &&
        mouseY > cy - this.h / 2 && mouseY < cy + this.h / 2) {//si el mouse está sobre el área del botón (hover)
      fill(135, 211, 247);//relleno de celeste claro (efecto hover)
    } else {
      fill(132, 157, 196);//si no, celeste oscuro
    }

    noStroke();
    rect(cx, cy, this.w, this.h, 12);//boton sin bordes pero con esquinas redondeadas (12)

    fill(255);
    textAlign(CENTER, CENTER);//texto centrado respecto al punto (cx, cy)
    textSize(22);
    text(texto, cx, cy);//el texto del botón en el centro del rectángulo
  }

//INTERACCIONES:
  mousePresionado() {//delegado desde mousePressed

    //INICIO: si estoy en la pantalla "inicio" y hago click sobre el botón
    if (this.pantalla === "inicio" && this.enBoton(width / 2, height / 2 + 60)) {
      if (click && click.isLoaded) { click.amp(1); click.play(); }//reproduzco sonido de click
      this.pantalla = "contexto";//cambia el estado a la siguiente pantalla 
      return;//salgo de la función para que no se procesen otros if
    }

    //SEGUNDA PANTALLA
    if (this.pantalla === "contexto" && this.enBoton(width / 2, height / 2 + 70)) {
      if (click && click.isLoaded) { click.amp(1); click.play(); }//sonido
      this.pantalla = "instrucciones"; ///avanzo a instrucciones
      return;
    }

    //INSTRUCCIONES
    if (this.pantalla === "instrucciones" && this.enBoton(width / 2, height / 2 + 150)) {
      if (click && click.isLoaded) { click.amp(1); click.play(); }
      this.iniciarJuego();//llamo al método que reinicia propiedades y empieza la partida
      return;
    }

    //CRÉDITOS: VOLVER A JUGAR
    if (this.pantalla === "creditos" && this.enBoton(width / 2 - 140, height / 2 + 60)) {
      if (click && click.isLoaded) { click.amp(1); click.play(); }
      this.iniciarJuego();//vuelve a reiniciar el juego
      return;
    }

    //CRÉDITOS: VOLVER AL INICIO
    if (this.pantalla === "creditos" && this.enBoton(width / 2 + 140, height / 2 + 60)) {
      if (click && click.isLoaded) { click.amp(1); click.play(); }
      this.pantalla = "inicio";//vuelve a la pantalla inicio
      return;
    }
  }
//método para comprobar si el mouse está dentro del botón centrado en (cx, cy)
  enBoton(cx, cy) {
    this.w = this.botonAncho;
    this.h = this.botonAlto;
    return (mouseX > cx - this.w / 2 && mouseX < cx + this.w / 2 &&
            mouseY > cy - this.h / 2 && mouseY < cy + this.h / 2);//devuelve true si mouseX/mouseY están dentro de la caja del botón
  }

  keyPresionado(kc) { //Delegado desde keyPressed
    if (this.pantalla === "juego") { //responde a teclas cuando estas en la pantalla de juego
      if (kc === LEFT_ARROW) this.astronauta.moverIzquierda();//flecha izquierda=mover al astronauta a la izquierda
      if (kc === RIGHT_ARROW) this.astronauta.moverDerecha();//flecha derecha=mover al astronauta a la derecha
      if (kc === 32) {//disparo por barra espaciadora (32 es el KeyCode)
        this.astronauta.dispararBala();//crea una nueva bala desde la posición del astronauta
        if (disparo && disparo.isLoaded) { disparo.amp(0.25); disparo.play(); }//si el sonido está cargado, le subo el volumen y reproduzco el sonido
      }
    }
  }
//Resetear propiedades:
  reiniciarAGInicio() {
    this.pantalla = "inicio";//volver a la pantalla inicial
    this.vidas = 3;//restablecer las vidas
    this.fragmentos = [];//eliminar todos los fragmentos activos (se crean al iniciar juego)
    this.inicioFrame = 0;//reiniciar contador de tiempo
    this.mostrarExplosion = false;//apagar cualquier explosión
  }
}
