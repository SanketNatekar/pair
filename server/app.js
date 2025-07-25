// backend/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const tournamentRoutes = require('./routes/tournaments');
const roundRoutes = require('./routes/roundRoutes');
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/rounds', roundRoutes);

module.exports = app;
