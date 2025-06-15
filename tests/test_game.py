import unittest
import json
from web.api.server import app, reset_game_state

class TestGameAPI(unittest.TestCase):

    def setUp(self):
        """Set up for test methods."""
        self.app = app.test_client()
        self.app.testing = True
        reset_game_state() # Ensure a clean state for each test

    def tearDown(self):
        """Tear down after test methods."""
        reset_game_state() # Reset state again after test

    def test_initial_achievement_status(self):
        """Test the initial status of achievements."""
        response = self.app.get('/api/achievements/status')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode())

        self.assertIn('achievements', data)
        self.assertIn('unlocked_items', data)

        self.assertFalse(data['achievements']['first_win'])
        self.assertFalse(data['achievements']['high_score_100'])
        self.assertFalse(data['achievements']['ten_wins'])
        self.assertEqual(data['unlocked_items'], {})

    def test_unlock_first_win_achievement(self):
        """Test unlocking the 'first_win' achievement."""
        # Simulate game event: 1 win, score 50
        response = self.app.post('/api/achievements/check',
                                  data=json.dumps({'wins': 1, 'score': 50}),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode())

        self.assertTrue(data['achievements']['first_win'])
        self.assertEqual(data['unlocked_items']['first_win'], "Special Card Pack")

        # Verify status endpoint reflects this
        status_response = self.app.get('/api/achievements/status')
        status_data = json.loads(status_response.data.decode())
        self.assertTrue(status_data['achievements']['first_win'])
        self.assertEqual(status_data['unlocked_items']['first_win'], "Special Card Pack")

    def test_unlock_high_score_achievement(self):
        """Test unlocking the 'high_score_100' achievement."""
        response = self.app.post('/api/achievements/check',
                                  data=json.dumps({'wins': 0, 'score': 100}),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode())

        self.assertTrue(data['achievements']['high_score_100'])
        self.assertEqual(data['unlocked_items']['high_score_100'], "Golden Card Theme")
        self.assertFalse(data['achievements']['first_win']) # Should not unlock first_win

    def test_unlock_multiple_achievements(self):
        """Test unlocking multiple achievements over time (simulating rounds)."""
        # Round 1: First win and high score
        self.app.post('/api/achievements/check',
                      data=json.dumps({'wins': 1, 'score': 120}),
                      content_type='application/json')

        status_response = self.app.get('/api/achievements/status')
        status_data = json.loads(status_response.data.decode())
        self.assertTrue(status_data['achievements']['first_win'])
        self.assertTrue(status_data['achievements']['high_score_100'])
        self.assertEqual(status_data['unlocked_items']['first_win'], "Special Card Pack")
        self.assertEqual(status_data['unlocked_items']['high_score_100'], "Golden Card Theme")

        # Simulate more wins (up to 10)
        for i in range(2, 11):
            self.app.post('/api/achievements/check',
                          data=json.dumps({'wins': i, 'score': 120 + (i*10)}),
                          content_type='application/json')

        status_response_final = self.app.get('/api/achievements/status')
        status_data_final = json.loads(status_response_final.data.decode())
        self.assertTrue(status_data_final['achievements']['ten_wins'])
        self.assertEqual(status_data_final['unlocked_items']['ten_wins'], "Bonus Coins")

    def test_no_new_achievements(self):
        """Test sending data that doesn't unlock new achievements."""
        # Initial state: no achievements
        self.app.post('/api/achievements/check',
                      data=json.dumps({'wins': 0, 'score': 50}), # Not enough for any achievement
                      content_type='application/json')

        status_response = self.app.get('/api/achievements/status')
        status_data = json.loads(status_response.data.decode())
        self.assertFalse(status_data['achievements']['first_win'])
        self.assertFalse(status_data['achievements']['high_score_100'])
        self.assertEqual(status_data['unlocked_items'], {})

    def test_achievements_idempotency(self):
        """Test that unlocking an achievement again doesn't change status or re-add unlockable."""
        # Unlock first_win
        self.app.post('/api/achievements/check',
                      data=json.dumps({'wins': 1, 'score': 50}),
                      content_type='application/json')

        response1 = self.app.get('/api/achievements/status')
        data1 = json.loads(response1.data.decode())
        self.assertTrue(data1['achievements']['first_win'])
        self.assertEqual(len(data1['unlocked_items']), 1)

        # Try to unlock first_win again
        self.app.post('/api/achievements/check',
                      data=json.dumps({'wins': 2, 'score': 60}), # Still meets first_win criteria
                      content_type='application/json')

        response2 = self.app.get('/api/achievements/status')
        data2 = json.loads(response2.data.decode())
        self.assertTrue(data2['achievements']['first_win']) # Still true
        self.assertEqual(len(data2['unlocked_items']), 1) # Should not add duplicate or new unlockables for same achievement
        self.assertFalse(data2['achievements']['ten_wins']) # Assuming wins are not yet 10

    # Note on testing "shop purchase mechanics":
    # The current backend doesn't have explicit shop purchase endpoints.
    # Unlockables are tied directly to achievements. These tests verify that
    # achievements grant the correct unlockables. A real shop would need
    # separate endpoints for listing items and purchasing them with coins,
    # which would then be tested here.

    # Note on "identify any break points" when running through levels:
    # These tests simulate progression by repeatedly calling /api/achievements/check.
    # "Break points" in this context would be if the achievement logic failed
    # (e.g., didn't unlock when it should, or unlocked incorrectly).
    # The existing tests cover these aspects for the defined achievements.

if __name__ == '__main__':
    unittest.main()
