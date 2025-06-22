// gameState.js
let currentWave = 1;
let playerHealth = 100;
let playerScore = 0;
let gameRunning = true;

export function setupGameState() {
    currentWave = 1;
    playerHealth = 100;
    playerScore = 0;
    gameRunning = true;
    updateUI();
}

export function updateUI() {
    document.getElementById('health').textContent = playerHealth;
    document.getElementById('score').textContent = playerScore;
    document.getElementById('wave').textContent = currentWave;
}

export function getWave() {
    return currentWave;
}

export function nextWave() {
    currentWave++;
    updateUI();
    console.log(`Starting Wave ${currentWave}`);
}

export function decreaseHealth(amount) {
    if (!gameRunning) return;
    playerHealth -= amount;
    if (playerHealth < 0) playerHealth = 0;
    updateUI();
    if (playerHealth <= 0) {
        gameOver("Game Over!", "Your health ran out. Try again!");
    }
}

export function increaseScore(amount) {
    playerScore += amount;
    updateUI();
}

export function gameOver(title, message) {
    gameRunning = false;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('gameModal').style.display = 'flex';
    cancelAnimationFrame(window._gameAnimFrame);
}

export function resetGame(scene, enemies, towers) {
    gameRunning = true;
    currentWave = 1;
    playerHealth = 100;
    playerScore = 0;
    updateUI();
    while (enemies.length > 0) {
        const enemy = enemies.pop();
        scene.remove(enemy);
    }
    while (towers.length > 0) {
        const tower = towers.pop();
        scene.remove(tower);
    }
    scene.traverse(object => {
        if (object.userData.isProjectile) {
            scene.remove(object);
        }
    });
    document.getElementById('gameModal').style.display = 'none';
}

export function isGameRunning() {
    return gameRunning;
}

export function getCurrentWave() {
    return currentWave;
}

export function getPlayerHealth() {
    return playerHealth;
} 