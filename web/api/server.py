from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.json
    # Save score to a database or file (placeholder logic here)
    return jsonify({"status": "success", "message": "Score saved!"})

@app.route('/get_scores', methods=['GET'])
def get_scores():
    # Retrieve scores from a database or file (placeholder logic here)
    return jsonify({"scores": [100, 200, 300]})

if __name__ == '__main__':
    app.run(debug=True)