const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalRounds: { type: Number, default: 5 },
  currentRound: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  rounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Round' }],
}, { timestamps: true });

module.exports = mongoose.model('Tournament', TournamentSchema);
