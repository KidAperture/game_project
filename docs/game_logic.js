// game_logic.js
class CardGame {
  constructor() {
    this.deck = [];
    this.hand = [];
    this.coins = 0;
    this.score = 0;
    this.difficulty = 'normal'; // Default difficulty
    this.round = 1;
    this.wins = 0;
    this.shopItems = [
      { name: "Extra Health", cost: 10, description: "Increases max health by 5" },
      { name: "Card Draw", cost: 5, description: "Draw an extra card" }
    ];
    // Define achievements and unlockables locally
    this.achievementDefinitions = {
      "first_win": { condition: data => data.wins >= 1, unlocked: false, featureName: "Special Card Pack Details", featureDescription: "Unlocks a special pack of cards." },
      "high_score_100": { condition: data => data.score >= 100, unlocked: false, featureName: "Golden Card Theme", featureDescription: "A new visual theme for your cards." },
      "ten_wins": { condition: data => data.wins >= 10, unlocked: false, featureName: "Bonus Coins", featureDescription: "Get 50 bonus coins!" }
    };
    this.unlockedFeatures = {};
    this.localStorageKey = 'cardGameState';
  }

  initializeGame(difficulty) {
    if (!this.loadGameState()) {
      // No saved state, or loading failed, initialize fresh
      this.difficulty = difficulty;
      this.coins = 0;
      this.score = 0;
      this.round = 1;
      this.wins = 0;
      this.deck = [];
      this.hand = [];
      // Reset achievement status
      for (const achKey in this.achievementDefinitions) {
        if (this.achievementDefinitions.hasOwnProperty(achKey)) {
          this.achievementDefinitions[achKey].unlocked = false;
        }
      }
      this.unlockedFeatures = {};
      this.resetDeck(); // Creates and shuffles deck
      this.drawInitialHand();
    }
    // Always update UI elements after initialization (either loaded or fresh)
    this.updateStats();
    this.updateShop(); // In case shop appearance depends on game state not covered by stats
    // Potentially re-render hand or other UI elements if needed
  }

  saveGameState() {
    const state = {
      coins: this.coins,
      score: this.score,
      round: this.round,
      difficulty: this.difficulty,
      wins: this.wins,
      hand: this.hand, // Saving hand might be complex if cards have methods, ensure serializable
      deck: this.deck, // Same as hand
      achievementDefinitions: this.achievementDefinitions, // Stores unlocked status
      unlockedFeatures: this.unlockedFeatures
    };
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(state));
      console.log("Game state saved.");
    } catch (e) {
      console.error("Error saving game state to localStorage:", e);
    }
  }

  loadGameState() {
    try {
      const savedState = localStorage.getItem(this.localStorageKey);
      if (savedState === null) {
        console.log("No saved game state found.");
        return false;
      }
      const state = JSON.parse(savedState);

      this.coins = state.coins || 0;
      this.score = state.score || 0;
      this.round = state.round || 1;
      this.difficulty = state.difficulty || 'normal';
      this.wins = state.wins || 0;
      this.hand = state.hand || [];
      this.deck = state.deck || [];

      // Important: Merge achievement definitions, don't just overwrite
      // This ensures if we add new achievements in code, they are picked up.
      if (state.achievementDefinitions) {
        for (const achKey in this.achievementDefinitions) {
          if (this.achievementDefinitions.hasOwnProperty(achKey) && state.achievementDefinitions.hasOwnProperty(achKey)) {
            this.achievementDefinitions[achKey].unlocked = state.achievementDefinitions[achKey].unlocked;
          }
        }
      }
      this.unlockedFeatures = state.unlockedFeatures || {};

      console.log("Game state loaded.");
      return true;
    } catch (e) {
      console.error("Error loading game state from localStorage:", e);
      // Optionally clear corrupted state: localStorage.removeItem(this.localStorageKey);
      return false;
    }
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
    this.saveGameState(); // Save state after advancing round
  }

  winRound() {
    console.log("Round won!");
    this.wins++;
    this.coins += 5; // Award 5 coins for winning
    this.score += 10; // Increase score
    this.checkAchievements(); // This will call unlockFeature, which should save state
    // No need to call saveGameState here if checkAchievements -> unlockFeature saves it.
    // However, if checkAchievements doesn't always result in an unlock, save here.
    this.saveGameState();
  }

  loseRound() {
    console.log("Round lost!");
    // Handle loss (e.g., reset score, end game)
    this.score = 0; // Reset score on loss for simplicity
    this.saveGameState();
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
    this.saveGameState();
  }

  unlockFeature(featureKey, featureDetails) { // featureKey is like 'first_win'
    if (!this.unlockedFeatures[featureKey]) {
      this.unlockedFeatures[featureKey] = featureDetails; // Store the details object
      console.log("Unlocked feature on frontend:", featureKey, featureDetails.featureName, featureDetails.featureDescription);
      // Add logic to make the feature available to the player
      // For example, add a new set of cards or a new game mode, update UI
      alert(`New Feature Unlocked: ${featureDetails.featureName} - ${featureDetails.featureDescription}`);
      this.saveGameState(); // Save state when a feature is unlocked
    }
  }

  // processUnlockables and syncAchievements removed.

  checkAchievements() {
    const gameState = {
      score: this.score,
      wins: this.wins,
      round: this.round
      // Add any other data relevant for achievements
    };

    for (const achKey in this.achievementDefinitions) {
      if (this.achievementDefinitions.hasOwnProperty(achKey)) {
        const ach = this.achievementDefinitions[achKey];
        if (!ach.unlocked && ach.condition(gameState)) {
          ach.unlocked = true;
          // Pass the whole achievement object which contains featureName and featureDescription
          this.unlockFeature(achKey, { featureName: ach.featureName, featureDescription: ach.featureDescription });
          // unlockFeature will call saveGameState if a new feature is actually unlocked.
          console.log("Achievement unlocked locally:", achKey, "-", ach.featureName);
        }
      }
    }
    // It might be good to save state even if no new achievement is unlocked,
    // if other parts of checkAchievements could change game state in the future.
    // For now, only unlocking a feature saves state. If checkAchievements itself
    // modified something like 'attempt_count', then saveGameState() would be needed here.
  }
}

export default CardGame;
