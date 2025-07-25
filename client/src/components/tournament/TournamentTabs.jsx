// src/components/tournament/TournamentTabs.jsx
import React from 'react';
import './TournamentTabs.css';

const TournamentTabs = ({ activeTab, onTabChange, tournament }) => {
  const tabs = [
    {
      id: 'players',
      label: 'Players',
      icon: '👥',
      count: tournament.players?.length || 0,
      description: 'Manage tournament participants'
    },
    {
      id: 'rounds',
      label: 'Rounds',
      icon: '🎯',
      count: tournament.rounds?.length || tournament.currentRound,
      description: 'View pairings and results'
    },
    {
      id: 'standings',
      label: 'Standings',
      icon: '🏆',
      description: 'Current rankings and scores'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      description: 'Tournament configuration'
    }
  ];

  return (
    <div className="tournament-tabs">
      <div className="tabs-container">
        <div className="tabs-list">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              title={tab.description}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.count !== undefined && (
                <span className="tab-count">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
        
        <div className="tab-indicator" />
      </div>
      
      {/* Tab descriptions for better UX */}
      <div className="tab-description">
        {tabs.find(tab => tab.id === activeTab)?.description}
      </div>
    </div>
  );
};

export default TournamentTabs;