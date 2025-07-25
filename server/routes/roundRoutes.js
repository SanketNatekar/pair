const express = require('express');
const router = express.Router();
const { getRoundsByTournament, updatePairingResult } = require('../controllers/roundController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.put('/:roundId/pairings/:pairingId/result', updatePairingResult);
router.get('/:tournamentId', getRoundsByTournament);

module.exports = router;
