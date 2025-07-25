const Round = require('../models/Round');
const Player = require('../models/Player');
const Tournament = require('../models/Tournament');

async function updatePlayerDataAfterRound(roundId) {
  const round = await Round.findById(roundId);
  if (!round) throw new Error('Round not found');

  for (const pairing of round.pairings) {
    const { whitePlayerId, blackPlayerId, result } = pairing;

    // 1. Update scores
    if (result === '1-0') {
      await Player.findByIdAndUpdate(whitePlayerId, { $inc: { points: 1 } });
    } else if (result === '0-1') {
      await Player.findByIdAndUpdate(blackPlayerId, { $inc: { points: 1 } });
    } else if (result === '0.5-0.5') {
      await Player.findByIdAndUpdate(whitePlayerId, { $inc: { points: 0.5 } });
      await Player.findByIdAndUpdate(blackPlayerId, { $inc: { points: 0.5 } });
    }

    // // 2. Update colorHistory
    // await Player.findByIdAndUpdate(whitePlayerId, {
    //   $push: { colorHistory: 'white', opponents: blackPlayerId }
    // });

    // await Player.findByIdAndUpdate(blackPlayerId, {
    //   $push: { colorHistory: 'black', opponents: whitePlayerId }
    // });
  }

  console.log('✅ Player data (score, colors, opponents) updated');
}

exports.getRoundsByTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await Tournament.findOne({
      _id: tournamentId,
      createdBy: req.user.userId
    });

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const rounds = await Round.find({ tournament: tournamentId })
      .sort({ roundNumber: 1 })
      .populate({
        path: 'pairings.whitePlayerId',
        select: 'name rating'
      })
      .populate({
        path: 'pairings.blackPlayerId',
        select: 'name rating'
      });

    res.status(200).json({ rounds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch rounds' });
  }
};

exports.updatePairingResult = async (req, res) => {
  const { roundId, pairingId } = req.params;
  const { result } = req.body;

  if (!['1-0', '0-1', '0.5-0.5'].includes(result)) {
    return res.status(400).json({ error: 'Invalid result format' });
  }

  try {
    const round = await Round.findById(roundId);
    if (!round) return res.status(404).json({ error: 'Round not found' });

    const pairing = round.pairings.id(pairingId);
    if (!pairing) return res.status(404).json({ error: 'Pairing not found' });

    pairing.result = result;
    await round.save();

    // ✅ Check if all pairings in the round now have results
    const allResultsSubmitted = round.pairings.every(p => p.result);
    if (allResultsSubmitted) {
      await updatePlayerDataAfterRound(roundId);
      console.log(`✅ Player data updated after round ${round.roundNumber}`);
    }

    return res.json({ message: 'Result updated', pairing });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

