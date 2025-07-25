const Tournament = require('../models/Tournament');
const Player = require('../models/Player');
const Round = require('../models/Round');

// Create tournament
exports.createTournament = async (req, res) => {
  try {
    const { name, totalRounds } = req.body;
    const tournament = await Tournament.create({
      name,
      totalRounds,
      createdBy: req.user.userId, // set from auth middleware
    });
    res.status(201).json(tournament);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create tournament' });
  }
};

// Get all tournaments for logged-in user
exports.getMyTournaments = async (req, res) => {
  try {
    const t = await Tournament.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tournaments' });
  }
};

// Get single tournament (verify ownership)
exports.getTournamentById = async (req, res) => {
  try {
    const t = await Tournament.findOne({ _id: req.params.id, createdBy: req.user.userId })
      .populate('players')
      .populate('rounds');
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tournament' });
  }
};

// Add player
exports.addPlayer = async (req, res) => {
  try {
    const { name, rating } = req.body;
    const tournamentId = req.params.id;

    // Ensure tournament belongs to user
    const t = await Tournament.findOne({ _id: tournamentId, createdBy: req.user.userId });
    if (!t) return res.status(404).json({ message: 'Tournament not found' });

    const player = await Player.create({
      name,
      rating,
      tournament: tournamentId,
      points: 0,
      colorHistory: [],
      opponents: [],
    });

    t.players.push(player._id);
    await t.save();

    res.status(201).json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not add player' });
  }
};

// Start Round 1
exports.startFirstRound = async (req, res) => {
  try {
    const tournamentId = req.params.id;

    // Ensure user owns this tournament
    const tournament = await Tournament.findOne({
      _id: tournamentId,
      createdBy: req.user.userId,
    }).populate('players');

    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    if (tournament.currentRound > 0) {
      return res.status(400).json({ message: 'Round 1 already started' });
    }

    // Sort players by rating descending
    const sortedPlayers = [...tournament.players].sort((a, b) => b.rating - a.rating);

    const matches = [];
    let n = sortedPlayers.length/2;
    for (let i = 0; i < n; i += 1) {
      const white = sortedPlayers[i];
      const black = sortedPlayers[i + n];

      if (!black) {
        // Bye for last player
        white.points += 1;
        white.byes = (white.byes || 0) + 1;
        await white.save();
        continue;
      }

      // Update color history and opponents
      white.colorHistory.push('white');
      black.colorHistory.push('black');

      white.opponents.push(black._id);
      black.opponents.push(white._id);

      await white.save();
      await black.save();

      matches.push({
        whitePlayerId: white._id,
        blackPlayerId: black._id,
        result: null,
      });
    }

    // Store round 1 matches
    // tournament.rounds.push({ roundNumber: 1, matches });
    // tournament.currentRound = 1;
    // await tournament.save();

    // Create Round document
      console.log(matches);
      const round = await Round.create({
        roundNumber: 1,
        tournament: tournament._id,
        pairings: matches,
      });

      // Save reference in tournament
      tournament.rounds.push(round._id);
      await tournament.save();


    res.status(200).json({ message: 'Round 1 started', round });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to start round 1' });
  }
};

const determineColor = (p1, p2) => {
  const whiteCount1 = p1.colorHistory.filter(c => c === 'white').length;
  const whiteCount2 = p2.colorHistory.filter(c => c === 'white').length;

  if (whiteCount1 < whiteCount2) return p1;
  if (whiteCount2 < whiteCount1) return p2;
  return Math.random() > 0.5 ? p1 : p2;
};

exports.generateNextRound = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const previousRounds = await Round.find({ tournament: tournamentId }).sort({ roundNumber: -1 });
    const currentRoundNumber = previousRounds.length;

    const players = await Player.find({ tournament: tournamentId }).sort({ points: -1 });

    const pairings = [];
    const unpaired = new Set(players.map(p => p._id.toString()));

    while (unpaired.size > 1) {
      const [p1Id] = Array.from(unpaired);
      const p1 = players.find(p => p._id.toString() === p1Id);
      unpaired.delete(p1Id);

      let opponent = null;
      for (let i = 0; i < players.length; i++) {
        const p2 = players[i];
        if (
          unpaired.has(p2._id.toString()) &&
          !p1.opponents.includes(p2._id) &&
          p1._id.toString() !== p2._id.toString()
        ) {
          opponent = p2;
          break;
        }
      }

      if (opponent) {
        unpaired.delete(opponent._id.toString());

        const white = determineColor(p1, opponent);
        const black = white._id.toString() === p1._id.toString() ? opponent : p1;

        pairings.push({
          whitePlayerId: white._id,
          blackPlayerId: black._id,
          result: null,
        });

        // Update player objects
        p1.opponents.push(opponent._id);
        opponent.opponents.push(p1._id);
        p1.colorHistory.push(white._id.toString() === p1._id.toString() ? 'white' : 'black');
        opponent.colorHistory.push(white._id.toString() === opponent._id.toString() ? 'white' : 'black');
      } else {
        // Bye
        p1.byes += 1;
        p1.points += 1;

        pairings.push({
          whitePlayerId: p1._id,
          blackPlayerId: null,
          result: 'bye',
        });
      }
    }

    // Handle odd player out
    if (unpaired.size === 1) {
      const [byePlayerId] = Array.from(unpaired);
      const byePlayer = players.find(p => p._id.toString() === byePlayerId);
      byePlayer.byes += 1;
      byePlayer.score += 1;

      pairings.push({
        whitePlayerId: byePlayer._id,
        blackPlayerId: null,
        result: 'bye',
      });
    }

    // Save round
    const newRound = new Round({
      roundNumber: currentRoundNumber + 1,
      tournament: tournamentId,
      pairings,
    });

    await newRound.save();

    // Save updated players
    await Promise.all(players.map(p => p.save()));

    return res.status(201).json({ message: `Round ${currentRoundNumber + 1} generated`, round: newRound });
  } catch (error) {
    console.error('Error generating next round:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

