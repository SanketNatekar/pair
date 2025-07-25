const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  roundNumber: Number,
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  pairings: [
    {
      whitePlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      blackPlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      result: { type: String, default: null },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Round', RoundSchema);
