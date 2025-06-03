
// Game state variables
let score = 0;
let timeLeft = 60;
let gameActive = false;
let basketPosition = 350; // Initial basket position (800px width - basket width 100px)

// DOM elements
const gameContainer = document.querySelector('.game-container');
const basket = document.getElementById('basket');
const scoreValue = document.getElementById('scoreValue');
const timeValue = document.getElementById('timeValue');
const instructions = document.getElementById('instructions');
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const nightSky = document.getElementById('nightSky');

// Create background stars
function createBackgroundStars() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('twinkle');
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        nightSky.appendChild(star);
    }
}

// Initialize game
function initGame() {
    createBackgroundStars();

    // Event listeners
    document.addEventListener('keydown', handleKeyPress);
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!gameActive) return;

    const basketWidth = 100;
    const containerWidth = 800;

    if (e.key === 'ArrowLeft') {
        basketPosition = Math.max(0, basketPosition - 20);
    } else if (e.key === 'ArrowRight') {
        basketPosition = Math.min(containerWidth - basketWidth, basketPosition + 20);
    }

    basket.style.left = `${basketPosition}px`;
}

// Create a falling star
function createStar() {
    if (!gameActive) return;

    const star = document.createElement('div');
    star.classList.add('star');

    // Random position at the top
    const starX = Math.random() * 750; // 800px width - 50px star size
    star.style.left = `${starX}px`;

    document.querySelector('.game-area').appendChild(star);

    // Animation
    let starY = -30;
    const fallSpeed = Math.random() * 3 + 2; // Random speed between 2-5px per frame

    function animateStar() {
        if (!gameActive) {
            star.remove();
            return;
        }

        starY += fallSpeed;
        star.style.top = `${starY}px`;

        // Check if star is caught
        if (starY > 520) { // Near the bottom
            const basketRect = basket.getBoundingClientRect();
            const starRect = star.getBoundingClientRect();

            if (starRect.left > basketRect.left &&
                starRect.right < basketRect.right) {
                // Star caught!
                score++;
                scoreValue.textContent = score;
                createParticles(starRect.left + 15, starRect.top + 15);
                star.remove();
                return;
            }
        }

        // Remove star if it goes off screen
        if (starY > 600) {
            star.remove();
        } else {
            requestAnimationFrame(animateStar);
        }
    }

    requestAnimationFrame(animateStar);
}

// Create visual particles for feedback
function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = i % 2 === 0 ? '#ffeb3b' : '#4cc9f0';

        document.querySelector('.game-area').appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Game timer
function updateTimer() {
    if (!gameActive) return;

    timeLeft--;
    timeValue.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    } else {
        setTimeout(updateTimer, 1000);
    }
}

// Start the game
function startGame() {
    gameActive = true;
    instructions.style.display = 'none';
    score = 0;
    timeLeft = 60;
    scoreValue.textContent = score;
    timeValue.textContent = timeLeft;

    // Start creating stars
    setInterval(createStar, 500); // Create a new star every 500ms

    // Start timer
    updateTimer();
}

// End the game
function endGame() {
    gameActive = false;
    finalScore.textContent = score;
    gameOver.style.display = 'block';
}

// Restart the game
function restartGame() {
    gameOver.style.display = 'none';
    startGame();
}

// Initialize the game when page loads
window.onload = initGame;