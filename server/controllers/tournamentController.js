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

    tournament.currentRound += 1;
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

// controllers/roundController.js

// exports.generateNextRound = async (req, res) => {
//   const { tournamentId } = req.params;

//   try {
//     const tournament = await Tournament.findById(tournamentId).populate('players');
//     if (!tournament) {
//       return res.status(404).json({ error: 'Tournament not found' });
//     }

//     const previousRounds = await Round.find({ tournament: tournamentId });
//     const currentRoundNumber = previousRounds.length + 1;

//     const players = [...tournament.players].sort((a, b) => b.points - a.points);
//     const pairings = [];
//     const updatedPlayers = [];

//     while (players.length > 1) {
//       const p1 = players.shift();
//       const p2Index = players.findIndex(p2 => !p1.opponents.includes(p2._id.toString()));
//       if (p2Index === -1) {
//         players.push(p1); // No valid opponent, skip pairing this player for now
//         continue;
//       }

//       const p2 = players.splice(p2Index, 1)[0];

//       // Determine colors
//       const p1Whites = p1.colorHistory.filter(c => c === 'white').length;
//       const p1Blacks = p1.colorHistory.filter(c => c === 'black').length;
//       const p2Whites = p2.colorHistory.filter(c => c === 'white').length;
//       const p2Blacks = p2.colorHistory.filter(c => c === 'black').length;

//       let whitePlayerId, blackPlayerId;
//       if (p1Whites <= p1Blacks && p2Whites > p2Blacks) {
//         whitePlayerId = p1._id;
//         blackPlayerId = p2._id;
//         p1.colorHistory.push('white');
//         p2.colorHistory.push('black');
//       } else if (p2Whites <= p2Blacks && p1Whites > p1Blacks) {
//         whitePlayerId = p2._id;
//         blackPlayerId = p1._id;
//         p2.colorHistory.push('white');
//         p1.colorHistory.push('black');
//       } else {
//         whitePlayerId = p1._id;
//         blackPlayerId = p2._id;
//         p1.colorHistory.push('white');
//         p2.colorHistory.push('black');
//       }

//       p1.opponents.push(p2._id);
//       p2.opponents.push(p1._id);

//       pairings.push({
//         whitePlayerId,
//         blackPlayerId,
//         result: null,
//       });

//       updatedPlayers.push(p1, p2);
//     }

//     // Handle bye if one player is left
//     if (players.length === 1) {
//       const byePlayer = players[0];
//       byePlayer.points += 1;
//       byePlayer.byes += 1;
//       byePlayer.opponents.push(null);
//       byePlayer.colorHistory.push('white'); // Arbitrary
//       updatedPlayers.push(byePlayer);
//     }

//     const newRound = new Round({
//       roundNumber: currentRoundNumber,
//       tournament: tournamentId,
//       pairings,
//     });

//     await newRound.save();

//     // ✅ Add round ID to tournament and update round counter
//     tournament.currentRound = currentRoundNumber;
//     tournament.rounds.push(newRound._id);
//     await tournament.save();

//     // Save updated players
//     for (const updatedPlayer of updatedPlayers) {
//       await updatedPlayer.save();
//     }

//     return res.json({ message: `Round ${currentRoundNumber} generated`, round: newRound });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// };

exports.generateNextRound = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const tournament = await Tournament.findById(tournamentId).populate('players');
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const previousRounds = await Round.find({ tournament: tournamentId });
    const currentRoundNumber = previousRounds.length + 1;

    // Sort: higher points first, then rating (optional if you store ratings)
    const players = [...tournament.players].sort((a, b) => b.points - a.points);

    let pairings = [];
    let updatedPlayers = [];

    /**
     * Backtracking pairing function
     */
    const pairPlayers = (remainingPlayers, currentPairings) => {
      if (remainingPlayers.length === 0) return currentPairings; // All paired

      const p1 = remainingPlayers[0];

      // Try to find valid opponent
      for (let i = 1; i < remainingPlayers.length; i++) {
        const p2 = remainingPlayers[i];

        // Skip if already played before
        if (p1.opponents.includes(p2._id.toString())) continue;

        // Determine colors based on history
        const p1Whites = p1.colorHistory.filter(c => c === 'white').length;
        const p1Blacks = p1.colorHistory.filter(c => c === 'black').length;
        const p2Whites = p2.colorHistory.filter(c => c === 'white').length;
        const p2Blacks = p2.colorHistory.filter(c => c === 'black').length;

        let whitePlayerId, blackPlayerId;
        if (p1Whites <= p1Blacks && p2Whites > p2Blacks) {
          whitePlayerId = p1._id;
          blackPlayerId = p2._id;
          p1.colorHistory.push('white');
          p2.colorHistory.push('black');
        } else if (p2Whites <= p2Blacks && p1Whites > p1Blacks) {
          whitePlayerId = p2._id;
          blackPlayerId = p1._id;
          p2.colorHistory.push('white');
          p1.colorHistory.push('black');
        } else {
          whitePlayerId = p1._id;
          blackPlayerId = p2._id;
          p1.colorHistory.push('white');
          p2.colorHistory.push('black');
        }

        // Record opponents
        p1.opponents.push(p2._id);
        p2.opponents.push(p1._id);

        // Try pairing rest
        const nextRemaining = remainingPlayers.filter((_, idx) => idx !== 0 && idx !== i);
        const result = pairPlayers(nextRemaining, [
          ...currentPairings,
          { whitePlayerId, blackPlayerId, result: null }
        ]);

        if (result) return result; // Found a valid full pairing

        // ❌ Backtrack
        p1.opponents.pop();
        p2.opponents.pop();
        p1.colorHistory.pop();
        p2.colorHistory.pop();
      }

      return null; // No valid pairing found from here
    };

    pairings = pairPlayers(players, []);

    // If no valid pairing (due to all having played each other), allow repeats
    if (!pairings) {
      console.warn("No perfect pairing found, allowing repeats for this round");
      const tempPlayers = [...players];
      pairings = [];
      while (tempPlayers.length > 1) {
        const p1 = tempPlayers.shift();
        const p2 = tempPlayers.shift();
        pairings.push({
          whitePlayerId: p1._id,
          blackPlayerId: p2._id,
          result: null
        });
      }
    }

    // Handle bye if odd player count
    if (players.length % 2 !== 0) {
      const byePlayer = players[players.length - 1];
      byePlayer.points += 1;
      byePlayer.byes = (byePlayer.byes || 0) + 1;
      byePlayer.opponents.push(null);
      byePlayer.colorHistory.push('white'); // Arbitrary
    }

    // Save round
    const newRound = new Round({
      roundNumber: currentRoundNumber,
      tournament: tournamentId,
      pairings,
    });

    await newRound.save();

    // Update tournament
    tournament.currentRound = currentRoundNumber;
    tournament.rounds.push(newRound._id);
    await tournament.save();

    // Save all player updates
    for (const player of players) {
      await player.save();
    }

    return res.json({ message: `Round ${currentRoundNumber} generated`, round: newRound });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};


// leaderBoard
exports.getLeaderboard = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const players = await Player.find({ tournament: tournamentId });

    const leaderboard = players
      .map(player => ({
        _id: player._id,
        name: player.name,
        rating: player.rating,
        points: player.points,
        opponents: player.opponents,
        colorHistory: player.colorHistory
      }))
      .sort((a, b) => b.points - a.points); // Sort by points descending

    return res.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
};
