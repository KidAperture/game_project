class GameSettings:
    def __init__(self):
        self.difficulty = "Normal"
        self.time_limit = 60  # Default time limit in seconds
        self.deck_size = 52  # Default deck size
        self.max_discards = 1  # Max cards to discard
        self.max_jokers = 1  # Max jokers available
        self.apply_difficulty()

    def apply_difficulty(self):
        if self.difficulty == "Easy":
            self.time_limit = 90
            self.deck_size = 54
            self.max_discards = 2
            self.max_jokers = 2
        elif self.difficulty == "Normal":
            self.time_limit = 60
            self.deck_size = 52
            self.max_discards = 1
            self.max_jokers = 1
        elif self.difficulty == "Hard":
            self.time_limit = 45
            self.deck_size = 50
            self.max_discards = 1
            self.max_jokers = 0
        print(f"Game difficulty set to {self.difficulty}: Time limit = {self.time_limit}s, Deck size = {self.deck_size}, Max discards = {self.max_discards}, Max jokers = {self.max_jokers}")
