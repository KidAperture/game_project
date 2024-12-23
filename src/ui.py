import time

class UI:
    def __init__(self, game_settings, achievement_system):
        self.game_settings = game_settings
        self.achievement_system = achievement_system
        self.timer = game_settings.time_limit  # Start with the initial time limit
        self.display_settings_menu()

    def display_settings_menu(self):
        """Display the difficulty selection menu."""
        print("Select Difficulty Level:")
        print("1. Easy")
        print("2. Normal")
        print("3. Hard")
        user_input = input("Enter choice (1/2/3): ")
        if user_input == "1":
            self.game_settings.difficulty = "Easy"
        elif user_input == "2":
            self.game_settings.difficulty = "Normal"
        elif user_input == "3":
            self.game_settings.difficulty = "Hard"
        self.game_settings.apply_difficulty()
        print(f"Difficulty set to: {self.game_settings.difficulty}")
        self.start_game()

    def start_game(self):
        """Start the game with the selected difficulty."""
        game = Game(self.game_settings, self.achievement_system)
        game.start_game()

    def update_difficulty_info(self):
        """Update and display the UI elements related to difficulty."""
        print(f"\nCurrent Difficulty: {self.game_settings.difficulty}")
        print(f"Time limit per round: {self.game_settings.time_limit} seconds")
        print(f"Jokers available this round: {self.game_settings.max_jokers}")
        print(f"Cards in the deck: {self.game_settings.deck_size}")

    def display_timer(self):
        """Display the countdown timer for the time limit."""
        print(f"Time remaining: {self.timer} seconds", end="\r")
        if self.timer > 0:
            time.sleep(1)
            self.timer -= 1
            self.display_timer()
        else:
            print("\nTime's up! Proceeding to the next phase.")

    def show_game_progress(self, player_stats):
        """Show the player stats and game progress."""
        print(f"\nRounds Played: {player_stats['rounds_won']}")
        print(f"Hands Made: {player_stats['hands_made']}")
        print(f"Items Used: {player_stats['items_spent']}")
