import logging

class AchievementSystem:
    def __init__(self):
        self.achievements = {"Win 5 Rounds": False, "Make a Rare Hand": False}
        self.unlockables = {"New Card Design": False}
        logging.basicConfig(level=logging.INFO)
        
    def check_achievement(self, player_stats):
        if player_stats['rounds_won'] >= 5:
            self.unlock_achievement("Win 5 Rounds")
        if player_stats['hands_made'] >= 3:  # Example: Make 3 rare hands
            self.unlock_achievement("Make a Rare Hand")
    
    def unlock_achievement(self, achievement):
        if achievement in self.achievements:
            self.achievements[achievement] = True
            logging.info(f"Achievement unlocked: {achievement}")
    
    def display_rewards(self):
        logging.info("Achievements Unlocked:")
        for achievement, unlocked in self.achievements.items():
            if unlocked:
                logging.info(f"- {achievement}")
        logging.info("Unlockables Available:")
        for unlockable, available in self.unlockables.items():
            if available:
                logging.info(f"- {unlockable}")