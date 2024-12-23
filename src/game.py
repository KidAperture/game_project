from game_settings import GameSettings
from ui import UI
from achievement_system import AchievementSystem

class Game:
    def __init__(self, game_settings, achievement_system):
        self.game_settings = game_settings
        self.achievement_system = achievement_system
        self.rounds_played = 0
        self.player_stats = {'rounds_won': 0, 'hands_made': 0, 'items_spent': 0}
        self.ui = UI(self.game_settings, self.achievement_system)

    def start_game(self):
        """Start a new game session based on selected difficulty."""
        print(f"Starting game with {self.game_settings.difficulty} difficulty.")
        self.run_round()

    def run_round(self):
        """Run a round of the game, applying difficulty-based logic."""
        self.rounds_played += 1
        print(f"Round {self.rounds_played} - Time Limit: {self.game_settings.time_limit}")
        self.ui.display_timer()  # Display the countdown timer for the round

        # Placeholder for round logic: handle cards, player decisions, etc.
        self.player_stats['rounds_won'] += 1  # Increment rounds won as an example
        self.check_achievements()
        self.show_rewards()

    def check_achievements(self):
        """Check for achievements based on player progress."""
        self.achievement_system.check_achievement(self.player_stats)

    def show_rewards(self):
        """Display unlocked rewards to the player."""
        self.achievement_system.display_rewards()

if __name__ == "__main__":
    game_settings = GameSettings()
    achievement_system = AchievementSystem()
    game = Game(game_settings, achievement_system)  # Create a Game instance
    game.start_game()  # Start the game