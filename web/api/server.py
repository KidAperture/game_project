from flask import Flask, jsonify, request

# Global state for achievements and unlockables
user_achievements = {}
achievement_conditions = {}
unlockables_db = {}

def reset_game_state():
    """Resets the game state for testing or re-initialization."""
    global user_achievements, achievement_conditions, unlockables_db
    user_achievements = {
        "first_win": False,
        "high_score_100": False,
        "ten_wins": False
    }
    achievement_conditions = {
        "first_win": lambda data: data.get("wins", 0) >= 1,
        "high_score_100": lambda data: data.get("score", 0) >= 100,
        "ten_wins": lambda data: data.get("wins", 0) >= 10
    }
    unlockables_db = {
        "first_win": "Special Card Pack",
        "high_score_100": "Golden Card Theme",
        "ten_wins": "Bonus Coins"
    }

app = Flask(__name__)
reset_game_state() # Initialize state when app is created

@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.json
    # Save score to a database or file (placeholder logic here)
    print(f"Received score data: {data}")
    return jsonify({"status": "success", "message": "Score saved!"})

@app.route('/get_scores', methods=['GET'])
def get_scores():
    # Retrieve scores from a database or file (placeholder logic here)
    return jsonify({"scores": [100, 200, 300]})

@app.route('/api/achievements/check', methods=['POST'])
def check_achievements_route():
    data = request.json # Expected: {"score": 150, "wins": 1, ...any other relevant game state}
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated_achievements = False
    for ach_name, condition_fn in achievement_conditions.items():
        if not user_achievements.get(ach_name, False) and condition_fn(data):
            user_achievements[ach_name] = True
            updated_achievements = True
            print(f"Achievement unlocked: {ach_name}")

    if updated_achievements:
        return jsonify({
            "status": "success",
            "message": "Achievements updated",
            "achievements": user_achievements,
            "unlocked_items": get_player_unlockables()
        })
    else:
        return jsonify({
            "status": "success",
            "message": "No new achievements",
            "achievements": user_achievements,
            "unlocked_items": get_player_unlockables()
        })

@app.route('/api/achievements/status', methods=['GET'])
def get_achievements_status():
    return jsonify({
        "achievements": user_achievements,
        "unlocked_items": get_player_unlockables()
    })

def get_player_unlockables():
    """Helper function to get items unlocked by the player."""
    unlocked = {}
    for ach_name, is_achieved in user_achievements.items():
        if is_achieved and ach_name in unlockables_db:
            unlocked[ach_name] = unlockables_db[ach_name]
    return unlocked

if __name__ == '__main__':
    # Call reset_game_state() if you want to reset before each run when not in test mode,
    # but typically for testing, you'd control reset from the test script.
    app.run(debug=True, port=5000)