// src/components/tournament/PlayersTab.jsx
import React from 'react';

const PlayersTab = ({ tournament, onUpdate, onRefresh }) => {
  return (
    <div className="players-tab">
      <div className="tab-header">
        <h3>Tournament Players</h3>
        <button className="btn btn-primary">
          <span className="btn-icon">+</span>
          Add Player
        </button>
      </div>
      
      <div className="players-content">
        <p>Players component coming soon...</p>
        <p>Total Players: {tournament.players?.length || 0}</p>
        
        {tournament.players && tournament.players.length > 0 ? (
          <div className="players-preview">
            <h4>Current Players:</h4>
            <ul>
              {tournament.players.slice(0, 5).map((player, index) => (
                <li key={player._id || index}>
                  {player.name || `Player ${index + 1}`} - 
                  Rating: {player.rating || 'Unrated'} - 
                  Points: {player.points || 0}
                </li>
              ))}
              {tournament.players.length > 5 && (
                <li>... and {tournament.players.length - 5} more players</li>
              )}
            </ul>
          </div>
        ) : (
          <div className="empty-state">
            <p>No players registered yet. Add some players to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// src/components/tournament/RoundsTab.jsx
export const RoundsTab = ({ tournament, onUpdate, onRefresh }) => {
  return (
    <div className="rounds-tab">
      <div className="tab-header">
        <h3>Tournament Rounds</h3>
        <div className="round-info">
          Current Round: {tournament.currentRound}/{tournament.totalRounds}
        </div>
      </div>
      
      <div className="rounds-content">
        <p>Rounds and pairings component coming soon...</p>
        
        {tournament.rounds && tournament.rounds.length > 0 ? (
          <div className="rounds-preview">
            <h4>Round History:</h4>
            <ul>
              {tournament.rounds.map((round, index) => (
                <li key={round._id || index}>
                  Round {round.roundNumber || index + 1} - 
                  {round.pairings?.length || 0} pairings
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="empty-state">
            <p>No rounds generated yet.</p>
            {tournament.players?.length >= 2 ? (
              <p>You can generate the first round when ready!</p>
            ) : (
              <p>Add at least 2 players to generate rounds.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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
            <span className="btn-icon">🗑️</span>
            Delete Tournament
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayersTab;