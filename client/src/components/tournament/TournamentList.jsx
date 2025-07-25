import React from 'react';
import TournamentCard from './TournamentCard.jsx';
import './TournamentList.css';

const TournamentList = ({ tournaments, loading, onDelete }) => {
  if (loading) {
    return (
      <div className="tournament-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading tournaments...</p>
      </div>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="tournament-list-empty">
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h3>No tournaments yet</h3>
          <p>Create your first tournament to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tournament-list">
      <div className="tournament-grid">
        {tournaments.map(tournament => (
          <TournamentCard
            key={tournament._id}
            tournament={tournament}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TournamentList;