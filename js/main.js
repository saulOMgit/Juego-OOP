// https://github.com/FactoriaF5-Asturias/p4-digital-academy-javascript-OOP-game
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
        this.container = document.getElementById("game-container");
        this.width = 50;
        this.height = 80;
        this.x = 200;
        this.y = this.container.offsetHeight - this.height - 20; // 20px de margen inferior
        this.velocidad = 20;
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();
    }

    ajustarY() {
        this.y = this.container.offsetHeight - this.height - 20;
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
        this.element.style.top = `${this.y}px`;
    }

    colisionaCon(objeto) {
        const buffer = 10;
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
    startButton.style.display = "none";
    juego.iniciar();
    juego.personaje.ajustarY();
});

// Soporte para botones móviles
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");

if (leftButton && rightButton) {
    // Touch y Click para Izquierda
    leftButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        juego.personaje.mover({ key: "ArrowLeft" });
    });
    leftButton.addEventListener("click", (e) => {
        e.preventDefault();
        juego.personaje.mover({ key: "ArrowLeft" });
    });

    // Touch y Click para Derecha
    rightButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        juego.personaje.mover({ key: "ArrowRight" });
    });
    rightButton.addEventListener("click", (e) => {
        e.preventDefault();
        juego.personaje.mover({ key: "ArrowRight" });
    });
}
// Evitar scroll vertical en móviles al tocar botones
document.body.addEventListener("touchmove", function (e) {
    e.preventDefault();
}, { passive: false });


// Música
const musicButton = document.getElementById("music-button");
const myAudio = document.getElementById("myAudio");
myAudio.volume = 0.4;
let musicPlaying = false;

musicButton.addEventListener("click", () => {
    musicPlaying = !musicPlaying;
    if (musicPlaying) {
        musicButton.textContent = "🔇 Música";
        myAudio.play();
    } else {
        musicButton.textContent = "🎵 Música";
        myAudio.pause();
    }
});

// Modal de instrucciones
const infoButton = document.getElementById("info-button");
const infoModal = document.getElementById("info-modal");
const closeInfoButton = document.getElementById("close-info-button");

infoButton.addEventListener("click", () => {
    infoModal.style.display = "flex";
});

closeInfoButton.addEventListener("click", () => {
    infoModal.style.display = "none";
});