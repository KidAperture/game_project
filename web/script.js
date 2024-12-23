// script.js
import CardGame from './game_logic.js';

const game = new CardGame();

document.addEventListener('DOMContentLoaded', () => {
  const difficultySelect = prompt("Select difficulty: easy, normal, hard");
  game.initializeGame(difficultySelect);

  // Render initial hand
  renderHand();
});

function renderHand() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';

  game.hand.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerText = `${card.value} of ${card.suit}`;
    gameBoard.appendChild(cardElement);
  });
} 