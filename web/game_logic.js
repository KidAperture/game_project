// game_logic.js
class CardGame {
  constructor() {
    this.deck = [];
    this.hand = [];
    this.coins = 0;
    this.score = 0;
    this.difficulty = 'normal'; // Default difficulty
  }

  initializeGame(difficulty) {
    this.difficulty = difficulty;
    this.resetDeck();
    this.drawInitialHand();
    this.updateStats();
  }

  resetDeck() {
    this.deck = [];
    for (let suit of ['hearts', 'diamonds', 'clubs', 'spades']) {
      for (let value = 1; value <= 13; value++) {
        this.deck.push({ suit, value });
      }
    }
    this.shuffleDeck();
  }

  shuffleDeck() {
    this.deck.sort(() => Math.random() - 0.5);
  }

  drawInitialHand() {
    this.hand = this.deck.splice(0, 8); // Draw 8 cards
  }

  updateStats() {
    document.getElementById('game-stats').innerHTML = `
      <p>Coins: ${this.coins}</p>
      <p>Score: ${this.score}</p>
    `;
  }
}

export default CardGame; 