import Game from './Game';
import {getScoreText} from './utils.js';

const canvas = document.getElementById('gameCanvas');
const winScoreRange = document.getElementById('winScoreRange');
const scoreText = document.getElementById('scoreText');
const winScoreDisplay = document.getElementById('winScoreDisplay');
let winScore = Math.pow(2, parseInt(winScoreRange.value, 10));
winScoreDisplay.textContent = winScore;

winScoreRange.addEventListener('input', (e) => {
    winScore = Math.pow(2, parseInt(e.target.value, 10));
    winScoreDisplay.textContent = winScore;
    scoreText.textContent = getScoreText(winScore);
    game = new Game(canvas, winScore);
    setTimeout(() => {
        winScoreRange.blur();
    }, 0); // Устанавливаем задержку на 0 мс
});

let game = new Game(canvas, winScore);
