class AchievementSystem:
    def __init__(self):
        self.achievements = {"Win 5 Rounds": False, "Make a Rare Hand": False}
        self.unlockables = {"New Card Design": False}
        
    def check_achievement(self, player_stats):
        if player_stats['rounds_won'] >= 5:
            self.achievements["Win 5 Rounds"] = True
        if player_stats['hands_made'] >= 3:  # Example: Make 3 rare hands
            self.achievements["Make a Rare Hand"] = True

    def display_rewards(self):
        print("Achievements Unlocked:")
        for achievement, unlocked in self.achievements.items():
            if unlocked:
                print(f"- {achievement}")
        print("Unlockables Available:")
        for unlockable, available in self.unlockables.items():
            if available:
                print(f"- {unlockable}")
