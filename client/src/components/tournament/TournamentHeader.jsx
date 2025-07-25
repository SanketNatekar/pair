// src/components/tournament/TournamentHeader.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TournamentHeader.css';

const TournamentHeader = ({ tournament, onUpdate, onRefresh }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusInfo = (tournament) => {
    if (tournament.currentRound === 0) {
      return {
        status: 'Registration Open',
        color: 'status-registration',
        description: 'Players can still join this tournament'
      };
    } else if (tournament.currentRound >= tournament.totalRounds) {
      return {
        status: 'Completed',
        color: 'status-completed', 
        description: 'Tournament has finished'
      };
    } else {
      return {
        status: 'In Progress',
        color: 'status-progress',
        description: `Currently in round ${tournament.currentRound}`
      };
    }
  };

  const statusInfo = getStatusInfo(tournament);

  const canGenerateRound = () => {
    return tournament.currentRound < tournament.totalRounds && 
           tournament.players && 
           tournament.players.length >= 2;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="tournament-header">
      <div className="tournament-header-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Dashboard</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{tournament.name}</span>
        </div>

        {/* Main Header */}
        <div className="header-main">
          <div className="header-left">
            <div className="tournament-title-section">
              <h1 className="tournament-title">{tournament.name}</h1>
              <span className={`tournament-status ${statusInfo.color}`}>
                {statusInfo.status}
              </span>
            </div>
            
            <div className="tournament-meta">
              <div className="meta-item">
                <span className="meta-label">Round:</span>
                <span className="meta-value">
                  {tournament.currentRound}/{tournament.totalRounds}
                </span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Players:</span>
                <span className="meta-value">
                  {tournament.players?.length || 0}
                </span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Created:</span>
                <span className="meta-value">
                  {formatDate(tournament.createdAt)}
                </span>
              </div>
            </div>

            {tournament.description && (
              <p className="tournament-description">
                {tournament.description}
              </p>
            )}
          </div>

          <div className="header-right">
            <div className="header-actions">
              <button 
                className="btn btn-secondary"
                onClick={onRefresh}
                title="Refresh tournament data"
              >
                <span className="btn-icon">🔄</span>
                Refresh
              </button>

              {canGenerateRound() && (
                <button 
                  className="btn btn-primary"
                  onClick={() => {/* TODO: Implement round generation */}}
                >
                  <span className="btn-icon">⚡</span>
                  Generate Round {tournament.currentRound + 1}
                </button>
              )}

              <div className="dropdown">
                <button 
                  className="btn btn-outline dropdown-toggle"
                  onClick={() => setShowActions(!showActions)}
                >
                  <span className="btn-icon">⚙️</span>
                  Actions
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {showActions && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item">
                      <span className="dropdown-icon">📊</span>
                      Export Results
                    </button>
                    <button className="dropdown-item">
                      <span className="dropdown-icon">🖨️</span>
                      Print Standings
                    </button>
                    <button className="dropdown-item">
                      <span className="dropdown-icon">📧</span>
                      Share Tournament
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item text-danger">
                      <span className="dropdown-icon">🗑️</span>
                      Delete Tournament
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Description */}
        <div className="status-description">
          <span className="status-icon">ℹ️</span>
          {statusInfo.description}
        </div>
      </div>
    </div>
  );
};

export default TournamentHeader;