// import api from './api';

// export const tournamentService = {
//   getAllTournaments: () => api.get('/tournaments'),
//   getTournament: (id) => api.get(`/tournaments/${id}`),
//   createTournament: (data) => api.post('/tournaments', data),
//   updateTournament: (id, data) => api.put(`/tournaments/${id}`, data),
//   deleteTournament: (id) => api.delete(`/tournaments/${id}`),
//   addPlayer: (tournamentId, playerData) => api.post(`/tournaments/${tournamentId}/players`, playerData),
//   generatePairings: (tournamentId) => api.post(`/tournaments/${tournamentId}/generate-pairings`),
// };

// src/services/tournamentService.js
import api from './api';

export const tournamentService = {
  // Get all tournaments for the current user
  getAllTournaments: () => api.get('/tournaments'),
  
  // Get a specific tournament with populated data
  getTournament: (id) => api.get(`/tournaments/${id}`),
  
  // Create a new tournament
  createTournament: (data) => api.post('/tournaments/create', data),
  
  // Update tournament details
  updateTournament: (id, data) => api.put(`/tournaments/${id}`, data),
  
  // Delete a tournament
  deleteTournament: (id) => api.delete(`/tournaments/${id}`),
  
  // Player management
  addPlayer: (tournamentId, playerData) => 
    api.post(`/tournaments/${tournamentId}/players`, playerData),
  
  removePlayer: (tournamentId, playerId) => 
    api.delete(`/tournaments/${tournamentId}/players/${playerId}`),
  
  // Round management
  generatePairings: (tournamentId) => 
    api.post(`/tournaments/${tournamentId}/generate-next-round`),
  
  updateResult: (tournamentId, roundId, pairingId, result) => 
    api.put(`/rounds/${roundId}/pairings/${pairingId}/result`, { result }),
  
  // Get tournament standings
  getStandings: (tournamentId) => 
    api.get(`/tournaments/${tournamentId}/standings`),
};