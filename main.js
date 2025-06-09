class Game {
    constructor() {
        // Llamamos al id game-container para definir que ahí dentro se van a renderizar los elementos del juego
        this.container = document.getElementById("game-container");
        // Queremos tener una propiedad dentro de Game que represente al personaje, pero como todavía no hemos instanciado la clase Personaje, le ponemos null para evitar errores.  
        this.personaje = null;
        //inicia vacío porque al principio no hemos atrapado monedas
        this.monedas = [];
        this.puntuacion = 0;

        //Llama a métodos que configuran la escena y los controles.
        this.crearEscenario();
        this.agregarEventos();
        this.puntosElement=document.getElementById("puntos");

    }
    crearEscenario() {
        // Crear el personaje, Ahora, this.personaje ya no es null, sino un objeto de la clase Personaje.
        this.personaje = new Personaje();
        //Con appendChild(), lo agregamos al contenedor del juego (#game-container).
        // this.personaje.element es el elemento HTML que representa al personaje (un div).
        this.container.appendChild(this.personaje.element);
        // Usamos un bucle for para crear 5 monedas
        for (let i = 0; i < 5; i++) {
            //En cada iteración del bucle, creamos una nueva moneda con new Moneda().
            //Cada moneda es una instancia de la clase Moneda, que genera un div con su propia posición y tamaño.
            const moneda = new Moneda();
            // con el método push agregamos la moneda recién creada al array monedas
            this.monedas.push(moneda);
            //igual que con personaje, con appendChild agregamos las monedas al HTML
            this.container.appendChild(moneda.element);
        }
    }
    agregarEventos() {
        // Detecta las teclas presionadas (ArrowRight, ArrowLeft, ArrowUp) y llama a mover() en el personaje.
        window.addEventListener("keydown", (e) => this.personaje.mover(e));
        //Llama a checkColisiones() para empezar a detectar colisiones.
        this.checkColisiones();
    }
    checkColisiones() {
        // El código dentro de setInterval(100) se ejecutará cada 100 milisegundos, revisando las colisiones constantemente.
        setInterval(() => {
            //este es un array con las monedas del juego, el método forEach recorre el array, el parámetro index nos ayudará a eliminarla después
            this.monedas.forEach((moneda, index) => {
                //colisionaCon() función que verifica si el personaje ha colisionado con la moneda.
                if (this.personaje.colisionaCon(moneda)) {
                    // Eliminar moneda en el html y actualizar puntuación
                    this.container.removeChild(moneda.element);
                    //splice() elimina elementos del array, index dice cual y el 1 dice cuantos
                    this.monedas.splice(index, 1);
                    this.actualizarPuntuacion(10);
                }
            });

        }, 100);
    }
    actualizarPuntuacion(puntos){
        this.puntuacion+=puntos;
        this.puntosElement.textContent=`Puntos: ${this.puntuacion}`;
    }
}

class Personaje {

    constructor() {
        this.x = 50;
        this.y = 300;
        this.width = 50;
        this.height = 50;
        this.velocidad = 10;
        this.saltando = false;
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();
    }

    mover(evento) {
        if (evento.key === "ArrowRight") {
            this.x += this.velocidad;
        } else if (evento.key === "ArrowLeft") {
            this.x -= this.velocidad;
        } else if (evento.key === "ArrowUp") {
            this.saltar();
        }
        this.actualizarPosicion();
    }

    saltar() {
        this.saltando = true;
        let alturaMaxima = this.y - 100;
        const salto = setInterval(() => {
            if (this.y > alturaMaxima) {
                this.y -= 10;
            } else {
                clearInterval(salto);
                this.caer();
            }
            this.actualizarPosicion();
        }, 20);
    }

    caer() {
        const gravedad = setInterval(() => {
            if (this.y < 300) {
                this.y += 10;
            } else {
                clearInterval(gravedad);
            }
            this.actualizarPosicion();
        }
            , 20);

    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    colisionaCon(objeto) {
        return (
            this.x < objeto.x + objeto.width &&
            this.x + this.width > objeto.x &&
            this.y < objeto.y + objeto.height &&
            this.y + this.height > objeto.y
        );
    }
}

class Moneda {

    constructor() {
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.actualizarPosicion();

    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}

const juego = new Game();