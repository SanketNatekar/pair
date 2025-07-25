import React, { useState, useEffect } from 'react';
import { tournamentService } from '../services/tournamentService';
import { useAuth } from '../context/AuthContext.jsx';
import TournamentList from '../components/tournament/TournamentList.jsx';
import CreateTournamentModal from '../components/tournament/CreateTournamentModal.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await tournamentService.getAllTournaments();
      setTournaments(response.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      setError('Failed to load tournaments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = async (tournamentData) => {
    try {
      const response = await tournamentService.createTournament(tournamentData);
      setTournaments(prev => [response.data, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error; // Let the modal handle the error display
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    if (!window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      return;
    }

    try {
      await tournamentService.deleteTournament(tournamentId);
      setTournaments(prev => prev.filter(t => t._id !== tournamentId));
    } catch (error) {
      console.error('Error deleting tournament:', error);
      setError('Failed to delete tournament. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Chess Tournament Manager</h1>
            <p className="header-subtitle">Manage your chess tournaments with ease</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="welcome-text">Welcome, {user?.name}</span>
              <button className="btn btn-outline" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="content-header">
            <div className="content-title">
              <h2>My Tournaments</h2>
              <span className="tournament-count">
                {tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button 
              className="btn btn-primary btn-create"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="btn-icon">+</span>
              Create Tournament
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
              <button 
                className="error-retry" 
                onClick={fetchTournaments}
              >
                Retry
              </button>
            </div>
          )}

          <TournamentList
            tournaments={tournaments}
            loading={loading}
            onDelete={handleDeleteTournament}
          />
        </div>
      </main>

      {showCreateModal && (
        <CreateTournamentModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTournament}
        />
      )}
    </div>
  );
};

export default Dashboard;