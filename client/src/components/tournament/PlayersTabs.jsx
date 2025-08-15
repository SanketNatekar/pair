
// src/components/tournament/PlayersTab.jsx
// import React from 'react';

// const PlayersTab = ({ tournament, onUpdate, onRefresh }) => {
//   return (
//     <div className="players-tab">
//       <div className="tab-header ">
//         <h3>Tournament Players</h3>
//         <button className="btn btn-primary ">
//           <span className="btn-icon">+</span>
//           Add Player
//         </button>
//       </div>
    
//       <div className="players-content">
//         <p>Players component coming soon...</p>
//         <p>Total Players: {tournament.players?.length || 0}</p>
        
//         {tournament.players && tournament.players.length > 0 ? (
//           <div className="players-preview">
//             <h4>Current Players:</h4>
//             <ul>
//               {tournament.players.slice(0, 5).map((player, index) => (
//                 <li key={player._id || index}>
//                 {player.name || `Player ${index + 1}`} - 
//                   Rating: {player.rating || 'Unrated'} - 
//                   Points: {player.points || 0}
//                 </li>
//               ))}
//               {tournament.players.length > 5 && (
//                 <li>... and {tournament.players.length - 5} more players</li>
//               )}
//             </ul>
//           </div>
//         ) : (
//           <div className="empty-state">
//             <p>No players registered yet. Add some players to get started!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// src/components/tournament/RoundsTab.jsx
// export const RoundsTab = ({ tournament, onUpdate, onRefresh }) => {
//   return (
//     <div className="rounds-tab">
//       <div className="tab-header">
//         <h3>Tournament Rounds</h3>
//         <div className="round-info">
//           Current Round: {tournament.currentRound}/{tournament.totalRounds}
//         </div>
//       </div>
      
//       <div className="rounds-content">
//         <p>Rounds and pairings component coming soon...</p>
        
//         {tournament.rounds && tournament.rounds.length > 0 ? (
//           <div className="rounds-preview">
//             <h4>Round History:</h4>
//             <ul>
//               {tournament.rounds.map((round, index) => (
//                 <li key={round._id || index}>
//                   Round {round.roundNumber || index + 1} - 
//                   {round.pairings?.length || 0} pairings
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ) : (
//           <div className="empty-state">
//             <p>No rounds generated yet.</p>
//             {tournament.players?.length >= 2 ? (
//               <p>You can generate the first round when ready!</p>
//             ) : (
//               <p>Add at least 2 players to generate rounds.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// src/components/tournament/StandingsTab.jsx
export const StandingsTab = ({ tournament, onRefresh }) => {
  return (
    <div className="standings-tab">
      <div className="tab-header">
        <h3>Tournament Standings</h3>
        <button className="btn btn-secondary" onClick={onRefresh}>
          <span className="btn-icon">🔄</span>
          Refresh
        </button>
      </div>
      
      <div className="standings-content">
        <p>Standings and rankings component coming soon...</p>
        
        {tournament.players && tournament.players.length > 0 ? (
          <div className="standings-preview">
            <h4>Current Standings Preview:</h4>
            <ol>
              {tournament.players
                .sort((a, b) => (b.points || 0) - (a.points || 0))
                .slice(0, 5)
                .map((player, index) => (
                  <li key={player._id || index}>
                    {player.name || `Player ${index + 1}`} - 
                    {player.points || 0} points
                  </li>
                ))}
            </ol>
          </div>
        ) : (
          <div className="empty-state">
            <p>No players to rank yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// src/components/tournament/SettingsTab.jsx
export const SettingsTab = ({ tournament, onUpdate, onDelete }) => {
  return (
    <div className="settings-tab">
      <div className="tab-header">
        <h3>Tournament Settings</h3>
      </div>
      
      <div className="settings-content">
        <div className="settings-section">
          <h4>Basic Information</h4>
          <div className="setting-item">
            <label>Tournament Name:</label>
            <span>{tournament.name}</span>
          </div>
          <div className="setting-item">
            <label>Total Rounds:</label>
            <span>{tournament.totalRounds}</span>
          </div>
          <div className="setting-item">
            <label>Current Round:</label>
            <span>{tournament.currentRound}</span>
          </div>
        </div>
        
        <div className="settings-section">
          <h4>Advanced Settings</h4>
          <p>Tournament configuration options coming soon...</p>
        </div>
        
        <div className="settings-section danger-zone">
          <h4>Danger Zone</h4>
          <p>Be careful with these actions - they cannot be undone.</p>
          <button className="btn btn-danger" onClick={onDelete}>
            <span className="btn-icon">🗑</span>
            Delete Tournament
          </button>
        </div>
      </div>
    </div>
  );
};

// export default PlayersTab;






// // src/components/tournament/PlayersTab.jsx
import React, { useState } from 'react';
import { tournamentService } from '../../services/tournamentService';
import { toast } from 'react-hot-toast';

const PlayersTab = ({ tournament, onUpdate, onRefresh }) => {
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [removingPlayer, setRemovingPlayer] = useState(null);
  
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    rating: ''
  });

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    
    if (!newPlayer.name.trim()) {
      toast.error('Player name is required');
      return;
    }

    // Validate rating if provided
    if (newPlayer.rating && (isNaN(newPlayer.rating) || newPlayer.rating < 0)) {
      toast.error('Rating must be a valid number');
      return;
    }

    try {
      setAddingPlayer(true);
      
      const playerData = {
        name: newPlayer.name.trim(),
        rating: newPlayer.rating ? parseInt(newPlayer.rating) : null
      };

      await tournamentService.addPlayer(tournament._id, playerData);
      
      // Reset form
      setNewPlayer({ name: '', rating: ''});
      setShowAddPlayer(false);
      
      // Refresh tournament data
      if (onRefresh) onRefresh();
      
      toast.success('Player added successfully!');
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error(error.response?.data?.message || 'Failed to add player');
    } finally {
      setAddingPlayer(false);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    // Check if tournament has started
    if (tournament.rounds && tournament.rounds.length > 0) {
      toast.error('Cannot remove players after tournament has started');
      return;
    }

    try {
      setRemovingPlayer(playerId);
      
      await tournamentService.removePlayer(tournament._id, playerId);
      
      // Refresh tournament data
      if (onRefresh) onRefresh();
      
      toast.success('Player removed successfully!');
    } catch (error) {
      console.error('Error removing player:', error);
      toast.error(error.response?.data?.message || 'Failed to remove player');
    } finally {
      setRemovingPlayer(null);
    }
  };

  const players = tournament?.players || [];
  const canModifyPlayers = !tournament?.rounds || tournament.rounds.length === 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tournament Players ({players.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage players registered for this tournament
          </p>
        </div>
        
        {canModifyPlayers && (
          <button
            onClick={() => setShowAddPlayer(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Player
          </button>
        )}
      </div>

      {/* Add Player Modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Add New Player</h4>
              <button
                onClick={() => setShowAddPlayer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter player name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  value={newPlayer.rating}
                  onChange={(e) => setNewPlayer({...newPlayer, rating: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter player rating"
                  min="0"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPlayer(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingPlayer}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {addingPlayer ? 'Adding...' : 'Add Player'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Players List */}
      {players.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No players yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            {canModifyPlayers ? 'Add players to start your tournament.' : 'This tournament has no registered players.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  {canModifyPlayers && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player, index) => (
                  <tr key={player._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {player.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-500">Player #{index + 1}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {player.rating || 'Unrated'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{player.email || '-'}</div>
                      <div className="text-sm text-gray-500">{player.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {player.points || 0} pts
                      </div>
                    </td>
                    {canModifyPlayers && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemovePlayer(player._id)}
                          disabled={removingPlayer === player._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {removingPlayer === player._id ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tournament Status Warning */}
      {!canModifyPlayers && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="flex-shrink-0 h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Tournament In Progress</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Players cannot be added or removed once the tournament has started.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersTab;