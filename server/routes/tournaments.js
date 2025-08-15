const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createTournament,
  getMyTournaments,
  getTournamentById,
  addPlayer,startFirstRound,
  generateNextRound,
  getLeaderboard,
} = require('../controllers/tournamentController');

// All tournament routes require auth
router.use(auth);

router.post('/create', createTournament);
router.get('/', getMyTournaments);
router.get('/:id', getTournamentById);
router.post('/:id/players', addPlayer);
router.post('/:id/start-round1', startFirstRound);
router.post('/:tournamentId/generate-next-round', generateNextRound);
router.get('/:tournamentId/leaderboard', getLeaderboard);

// Pairing + results routes will be added next
module.exports = router;
