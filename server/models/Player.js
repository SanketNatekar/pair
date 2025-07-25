const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  colorHistory: [String], // 'w' or 'b'
  opponents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  buchholz: { type: Number, default: 0 },
  sonnebornBerger: { type: Number, default: 0 },
  byes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema);
