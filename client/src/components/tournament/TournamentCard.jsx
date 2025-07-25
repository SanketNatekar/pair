import React from 'react';
import { Link } from 'react-router-dom';
import './TournamentCard.css';

const TournamentCard = ({ tournament, onDelete }) => {
  const getStatusColor = (tournament) => {
    if (tournament.currentRound === 0) return 'status-registration';
    if (tournament.currentRound >= tournament.totalRounds) return 'status-completed';
    return 'status-progress';
  };

  const getStatusText = (tournament) => {
    if (tournament.currentRound === 0) return 'Registration Open';
    if (tournament.currentRound >= tournament.totalRounds) return 'Completed';
    return 'In Progress';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="tournament-card">
      <div className="tournament-card-header">
        <h3 className="tournament-title">{tournament.name}</h3>
        <span className={`tournament-status ${getStatusColor(tournament)}`}>
          {getStatusText(tournament)}
        </span>
      </div>

      <div className="tournament-info">
        <div className="info-item">
          <span className="info-label">Players:</span>
          <span className="info-value">{tournament.players?.length || 0}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Round:</span>
          <span className="info-value">
            {tournament.currentRound}/{tournament.totalRounds}
          </span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Created:</span>
          <span className="info-value">{formatDate(tournament.createdAt)}</span>
        </div>
      </div>

      <div className="tournament-actions">
        <Link 
          to={`/tournament/${tournament._id}`} 
          className="btn btn-primary"
        >
          View Tournament
        </Link>
        
        <button 
          className="btn btn-secondary"
          onClick={() => {/* TODO: Implement edit */}}
        >
          Edit
        </button>
        
        <button 
          className="btn btn-danger"
          onClick={() => onDelete(tournament._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;