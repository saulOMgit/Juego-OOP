class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.personaje = new Personaje();
        this.container.appendChild(this.personaje.element);
        this.obstaculos = [];
        this.puntuacion = 0;
        this.puntosElement = document.getElementById("puntos");
        this.juegoTerminado = false;

        this.modal = document.getElementById("game-over-modal");
        this.finalScore = document.getElementById("final-score");
        this.restartButton = document.getElementById("restart-button");

        this.restartButton.addEventListener("click", () => {
            window.location.reload();
        });

        this.agregarEventos();
    }

    iniciar() {
        this.generarObstaculos();
        this.iniciarPuntuacion();
        this.animar();
    }

    agregarEventos() {
        window.addEventListener("keydown", (e) => this.personaje.mover(e));
    }

    generarObstaculos() {
        this.obstaculoInterval = setInterval(() => {
            if (!this.juegoTerminado) {
                const obstaculo = new Obstaculo();
                this.obstaculos.push(obstaculo);
                this.container.appendChild(obstaculo.element);
            }
        }, 1000);
    }

    iniciarPuntuacion() {
        this.puntuacionInterval = setInterval(() => {
            if (!this.juegoTerminado) {
                this.puntuacion++;
                this.puntosElement.textContent = `Tiempo: ${this.puntuacion} s`;
            }
        }, 1000);
    }

    animar() {
        const loop = () => {
            if (!this.juegoTerminado) {
                this.obstaculos.forEach((obstaculo, index) => {
                    obstaculo.mover();
                    if (this.personaje.colisionaCon(obstaculo)) {
                        this.terminarJuego();
                    }
                    if (obstaculo.y > this.container.offsetHeight) {
                        this.container.removeChild(obstaculo.element);
                        this.obstaculos.splice(index, 1);
                    }
                });
                requestAnimationFrame(loop);
            }
        };
        requestAnimationFrame(loop);
    }

    terminarJuego() {
        this.juegoTerminado = true;
        clearInterval(this.obstaculoInterval);
        clearInterval(this.puntuacionInterval);
        this.finalScore.textContent = `Tiempo sobrevivido: ${this.puntuacion} s`;
        this.modal.style.display = "flex";
    }
}

class Personaje {
    constructor() {
        this.x = 175; // Centro aproximado para 400px de ancho
        this.y = 500;
        this.width = 50;
        this.height = 80;
        this.velocidad = 20;
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();
    }

    mover(evento) {
        if (evento.key === "ArrowLeft" && this.x > 0) {
            this.x -= this.velocidad;
        } else if (evento.key === "ArrowRight" && this.x < 350) {
            this.x += this.velocidad;
        }
        this.actualizarPosicion();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = `20px`;
    }

    colisionaCon(objeto) {
        const buffer = 10; // margen de tolerancia
        const personajeLeft = this.x + buffer;
        const personajeRight = this.x + this.width - buffer;
        const personajeTop = this.y + buffer;
        const personajeBottom = this.y + this.height - buffer;

        const objetoLeft = objeto.x;
        const objetoRight = objeto.x + objeto.width;
        const objetoTop = objeto.y;
        const objetoBottom = objeto.y + objeto.height;

        return (
            personajeLeft < objetoRight &&
            personajeRight > objetoLeft &&
            personajeTop < objetoBottom &&
            personajeBottom > objetoTop
        );
    }
}

class Obstaculo {
    constructor() {
        this.x = Math.random() * 350;
        this.y = -80;
        this.width = 50;
        this.height = 80;
        this.velocidad = 4;
        this.element = document.createElement("div");
        this.element.classList.add("obstaculo");
        this.actualizarPosicion();
    }

    mover() {
        this.y += this.velocidad;
        this.actualizarPosicion();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}

// Inicialización del juego
const juego = new Game();
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", () => {
    startButton.style.display = "none"; // Ocultar el botón después de iniciar
    juego.iniciar();
});

// Soporte para botones móviles
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");

if (leftButton && rightButton) {
    // Touch y Click para Izquierda
    leftButton.addEventListener("touchstart", () => {
        juego.personaje.mover({ key: "ArrowLeft" });
    });
    leftButton.addEventListener("click", () => {
        juego.personaje.mover({ key: "ArrowLeft" });
    });

    // Touch y Click para Derecha
    rightButton.addEventListener("touchstart", () => {
        juego.personaje.mover({ key: "ArrowRight" });
    });
    rightButton.addEventListener("click", () => {
        juego.personaje.mover({ key: "ArrowRight" });
    });
}
// Evitar scroll vertical en móviles al tocar botones
document.body.addEventListener("touchmove", function(e) {
    e.preventDefault();
}, { passive: false });
