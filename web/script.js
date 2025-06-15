// script.js
import CardGame from './game_logic.js';

const game = new CardGame();
window.game = game; // Make game instance global for shop button onclicks

let selectedCardIndex = -1; // Track selected card

document.addEventListener('DOMContentLoaded', () => { // Removed async
  const difficultySelect = prompt("Select difficulty: easy, normal, hard") || 'normal';
  game.initializeGame(difficultySelect); // initializeGame now handles initial stats/shop updates if loading state
  // Calls to updateStats and updateShop here are redundant if initializeGame handles them post-load.
  // game.updateStats();
  // game.updateShop();

  renderHand(); // Render hand based on loaded or new game state

  const playCardBtn = document.getElementById('play-card-btn');
  playCardBtn.addEventListener('click', () => {
    if (selectedCardIndex !== -1) {
      game.playCard(selectedCardIndex);
      selectedCardIndex = -1; // Reset selection
      renderHand(); // Re-render hand after playing a card
      // No need to call updateStats or updateShop here as playCard->advanceRound handles it
    } else {
      alert("Please select a card to play.");
    }
  });

  const nextRoundBtn = document.getElementById('next-round-btn');
  nextRoundBtn.addEventListener('click', () => {
    game.advanceRound();
    renderHand(); // Re-render hand
    // updateStats is called by advanceRound
  });
});

function renderHand() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  selectedCardIndex = -1; // Reset selection on re-render

  game.hand.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerText = `${card.value} of ${card.suit}`;
    cardElement.addEventListener('click', () => {
      // Remove 'selected' class from previously selected card
      const currentlySelected = document.querySelector('.card.selected');
      if (currentlySelected) {
        currentlySelected.classList.remove('selected');
      }
      // Add 'selected' class to clicked card
      cardElement.classList.add('selected');
      selectedCardIndex = index;
    });
    gameBoard.appendChild(cardElement);
  });
} 