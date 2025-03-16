const startScreen = document.getElementById('startScreen');
const gameContainer = document.getElementById('gameContainer');
const victoryScreen = document.getElementById('victoryScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.createElement('button'); // Botón de reinicio
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');

let playerX = 50;
let bullets = [];
let enemies = [];
let score = 0;
const targetScore = 20;
let enemyInterval, updateInterval;
let gameRunning = false; // Variable para verificar si el juego está corriendo

// Configuración del botón de reinicio
restartButton.textContent = "Volver a inicio";
restartButton.classList.add("neon-button"); // Añadir la clase "neon-button"
restartButton.style.marginTop = "20px";
restartButton.style.display = "none"; // Oculto al inicio
victoryScreen.appendChild(restartButton);

// Música de fondo
const backgroundMusic = new Audio('/audio/background-music.mp3'); // Ruta de la música de fondo
backgroundMusic.loop = true; // Repetir la música en bucle
backgroundMusic.volume = 0.35; // Ajusta el volumen (opcional)

document.addEventListener('DOMContentLoaded', () => {
    // Intentar reproducir la música automáticamente cuando se carga el DOM
    backgroundMusic.play().catch(() => {
        console.log("No se pudo reproducir la música automáticamente. Se reproducirá al hacer clic en el botón.");
    });
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function startGame() {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    victoryScreen.style.display = 'none';

    // Reproducir la música de fondo cuando el juego comience, si aún no se ha reproducido
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch(() => {
            console.log("No se pudo reproducir la música, espera a la interacción del usuario.");
        });
    }

    score = 0;
    scoreElement.textContent = `Puntuación: ${score}`;
    bullets = [];
    enemies = [];

    // Limpiar cualquier intervalo anterior
    clearInterval(enemyInterval);
    clearInterval(updateInterval);

    // Iniciar nuevos intervalos
    enemyInterval = setInterval(createEnemy, 2000);
    updateInterval = setInterval(update, 16);
    gameRunning = true; // El juego ha comenzado

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('click', shoot);
}

function restartGame() {
    location.reload();
}

function handleTouchStart(e) {
    if (!gameRunning) return; // Evitar que se mueva si el juego no está corriendo

    const touchX = e.touches[0].clientX;
    playerX = (touchX / window.innerWidth) * 100;
    player.style.left = playerX + '%';
}

function handleTouchMove(e) {
    if (!gameRunning) return; // Evitar que se mueva si el juego no está corriendo

    const touch = e.touches[0];
    playerX = (touch.clientX / window.innerWidth) * 100;
    player.style.left = playerX + '%';
}

function shoot() {
    if (!gameRunning) return; // Evitar disparar si el juego no está corriendo

    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = (playerX + 2.5) + '%'; 
    bullet.style.bottom = '100px';
    gameContainer.appendChild(bullet);
    bullets.push(bullet);

    const shootSound = new Audio('/audio/lasershot.mp3');
    shootSound.volume = 0.2;
    shootSound.play().catch(() => {});
}

function createEnemy() {
    if (!gameRunning) return; // No crear enemigos si el juego no está corriendo

    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = Math.random() * 85 + '%';
    enemy.style.top = '-50px';
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
    enemy.style.animation = `enemy-float ${2 + Math.random() * 2}s ease-in-out infinite`;
}

function update() {
    if (!gameRunning) return; // No actualizar si el juego no está corriendo

    bullets.forEach((bullet, index) => {
        const bottom = parseInt(bullet.style.bottom) || 70;
        bullet.style.bottom = (bottom + 10) + 'px';

        enemies.forEach((enemy, enemyIndex) => {
            const bulletRect = bullet.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();

            if (bulletRect.bottom > enemyRect.top &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.right > enemyRect.left &&
                bulletRect.left < enemyRect.right) {

                bullet.remove();
                enemy.remove();
                bullets.splice(index, 1);
                enemies.splice(enemyIndex, 1);

                score += 10;
                scoreElement.textContent = `Puntuación: ${score}`;

                if (score >= targetScore) {
                    gameContainer.style.display = 'none';
                    victoryScreen.style.display = 'flex';
                    restartButton.style.display = "block"; // Mostrar el botón al ganar

                    // Detener el juego al ganar
                    gameRunning = false;
                    clearInterval(enemyInterval);
                    clearInterval(updateInterval);
                }
            }
        });

        if (bottom > window.innerHeight) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });

    enemies.forEach((enemy, index) => {
        const top = parseInt(enemy.style.top) || 0;
        enemy.style.top = (top + 2) + 'px';

        if (top > window.innerHeight) {
            enemy.remove();
            enemies.splice(index, 1);
        }
    });
}
