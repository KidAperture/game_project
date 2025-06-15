// game_logic.js
class CardGame {
  constructor() {
    this.deck = [];
    this.hand = [];
    this.coins = 0;
    this.score = 0;
    this.difficulty = 'normal'; // Default difficulty
    this.round = 1;
    this.wins = 0; // Keep track of wins
    this.shopItems = [
      { name: "Extra Health", cost: 10, description: "Increases max health by 5" },
      { name: "Card Draw", cost: 5, description: "Draw an extra card" }
    ];
    // Achievements will be synced from the backend
    this.achievements = {};
    this.unlockedFeatures = {}; // To store features unlocked on the frontend
  }

  async initializeGame(difficulty) {
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
      <p>Round: ${this.round}</p>
    `;
  }

  playCard(cardIndex) {
    // Basic implementation: remove card from hand
    if (cardIndex < 0 || cardIndex >= this.hand.length) {
      console.error("Invalid card index");
      return;
    }
    const playedCard = this.hand.splice(cardIndex, 1)[0];
    console.log("Played card:", playedCard);
    // Add card effect logic here
    this.advanceRound();
  }

  advanceRound() {
    this.round++;
    // Basic win/loss condition:
    if (this.hand.length === 0) {
      this.loseRound();
    } else {
      this.winRound();
    }
    this.updateStats();
    // Removed direct checkAchievements call, will be part of sync or specific events
  }

  winRound() {
    console.log("Round won!");
    this.wins++;
    this.coins += 5; // Award 5 coins for winning
    this.score += 10; // Increase score
    // Call checkAchievements to notify backend
    this.checkAchievements();
  }

  loseRound() {
    console.log("Round lost!");
    // Handle loss (e.g., reset score, end game)
    this.score = 0; // Reset score on loss for simplicity
  }

  updateShop() {
    const shopElement = document.getElementById('shop-items');
    if (!shopElement) return; // Shop element might not exist on all pages
    shopElement.innerHTML = ''; // Clear existing items
    this.shopItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.innerHTML = `
        <h4>${item.name} - ${item.cost} Coins</h4>
        <p>${item.description}</p>
        <button onclick="game.buyItem('${item.name}')">Buy</button>
      `;
      shopElement.appendChild(itemElement);
    });
  }

  buyItem(itemName) {
    const item = this.shopItems.find(i => i.name === itemName);
    if (!item) {
      console.error("Item not found:", itemName);
      return;
    }
    if (this.coins < item.cost) {
      console.log("Not enough coins to buy", itemName);
      return;
    }
    this.coins -= item.cost;
    console.log("Bought item:", itemName);
    // Apply item effect (e.g., increase health, add cards)
    this.updateStats();
    this.updateShop(); // Refresh shop to reflect changes (e.g., if item is one-time purchase)
  }

  unlockFeature(featureName, featureDetails) {
    if (!this.unlockedFeatures[featureName]) {
      this.unlockedFeatures[featureName] = featureDetails || true;
      console.log("Unlocked feature on frontend:", featureName, featureDetails);
      // Add logic to make the feature available to the player
      // For example, add a new set of cards or a new game mode, update UI
      alert(`New Feature Unlocked: ${featureDetails || featureName}`);
    }
  }

  processUnlockables(unlockedItems) {
    if (!unlockedItems) return;
    for (const achKey in unlockedItems) {
      if (unlockedItems.hasOwnProperty(achKey)) {
        const featureDetails = unlockedItems[achKey];
        // Use achKey or a more descriptive name if your backend provides one for the feature itself
        this.unlockFeature(achKey, featureDetails);
      }
    }
  }

  async checkAchievements() {
    const gameState = {
      score: this.score,
      wins: this.wins,
      round: this.round
      // Add any other data relevant for achievements
    };

    try {
      const response = await fetch('/api/achievements/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameState),
      });
      if (!response.ok) {
        console.error("Failed to check achievements:", response.status, await response.text());
        return;
      }
      const data = await response.json();
      console.log("Backend checkAchievements response:", data);
      if (data.achievements) {
        this.achievements = data.achievements;
      }
      if (data.unlocked_items) {
        this.processUnlockables(data.unlocked_items);
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  }

  async syncAchievements() {
    try {
      const response = await fetch('/api/achievements/status');
      if (!response.ok) {
        console.error("Failed to sync achievements:", response.status, await response.text());
        return;
      }
      const data = await response.json();
      console.log("Backend syncAchievements response:", data);
      if (data.achievements) {
        this.achievements = data.achievements;
      }
      if (data.unlocked_items) {
        this.processUnlockables(data.unlocked_items);
      }
    } catch (error) {
      console.error("Error syncing achievements:", error);
    }
  }
}

export default CardGame; 