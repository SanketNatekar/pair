// src/pages/TournamentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tournamentService } from '../services/tournamentService';
import TournamentHeader from '../components/tournament/TournamentHeader.jsx';
import TournamentTabs from '../components/tournament/TournamentTabs.jsx';
import PlayersTab, { StandingsTab, SettingsTab } from '../components/tournament/PlayersTabs.jsx';
import RoundsTab from '../components/tournament/RoundsTab.jsx';
import './TournamentDetail.css';

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('players');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (id) {
      fetchTournament();
    }
  }, [id, refreshTrigger]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await tournamentService.getTournament(id);
      setTournament(response.data);
    } catch (error) {
      console.error('Error fetching tournament:', error);
      if (error.response?.status === 404) {
        setError('Tournament not found');
      } else {
        setError('Failed to load tournament. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTournamentUpdate = (updatedData) => {
    setTournament(prev => ({ ...prev, ...updatedData }));
  };

  const refreshTournament = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="tournament-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading tournament...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tournament-detail-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={fetchTournament}>
              Try Again
            </button>
            <Link to="/" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="tournament-detail-error">
        <div className="error-content">
          <div className="error-icon">🏆</div>
          <h2>Tournament not found</h2>
          <p>The tournament you're looking for doesn't exist or has been deleted.</p>
          <Link to="/" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'players':
        return (
          <PlayersTab 
            tournament={tournament} 
            onUpdate={handleTournamentUpdate}
            onRefresh={refreshTournament}
          />
        );
      case 'rounds':
        return (
          <RoundsTab 
            tournament={tournament} 
            onUpdate={handleTournamentUpdate}
            onRefresh={refreshTournament}
          />
        );
      case 'standings':
        return (
          <StandingsTab 
            tournament={tournament} 
            onRefresh={refreshTournament}
          />
        );
      case 'settings':
        return (
          <SettingsTab 
            tournament={tournament} 
            onUpdate={handleTournamentUpdate}
            onDelete={() => navigate('/')}
          />
        );
      default:
        return <PlayersTab tournament={tournament} onUpdate={handleTournamentUpdate} />;
    }
  };

  return (
    <div className="tournament-detail">
      <TournamentHeader 
        tournament={tournament}
        onUpdate={handleTournamentUpdate}
        onRefresh={refreshTournament}
      />
      
      <div className="tournament-detail-content">
        <TournamentTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tournament={tournament}
        />
        
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;

// // src/pages/TournamentDetail.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { tournamentService } from '../services/tournamentService';
// import TournamentHeader from '../components/tournament/TournamentHeader.jsx';
// import TournamentTabs from '../components/tournament/TournamentTabs.jsx';
// // import PlayersTab from '../components/tournament/PlayersTab.jsx';
// // import RoundsTab from '../components/tournament/RoundsTab.jsx';
// // import StandingsTab from '../components/tournament/StandingsTab.jsx';
// // import SettingsTab from '../components/tournament/SettingsTab.jsx';
// // import './TournamentDetail.css';

// const TournamentDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [tournament, setTournament] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('players');
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   useEffect(() => {
//     if (id) {
//       fetchTournament();
//     }
//   }, [id, refreshTrigger]);

//   const fetchTournament = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await tournamentService.getTournament(id);
//       setTournament(response.data);
//     } catch (error) {
//       console.error('Error fetching tournament:', error);
//       if (error.response?.status === 404) {
//         setError('Tournament not found');
//       } else {
//         setError('Failed to load tournament. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTournamentUpdate = (updatedData) => {
//     setTournament(prev => ({ ...prev, ...updatedData }));
//   };

//   const refreshTournament = () => {
//     setRefreshTrigger(prev => prev + 1);
//   };

//   if (loading) {
//     return (
//       <div className="tournament-detail-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading tournament...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="tournament-detail-error">
//         <div className="error-content">
//           <div className="error-icon">⚠️</div>
//           <h2>Oops! Something went wrong</h2>
//           <p>{error}</p>
//           <div className="error-actions">
//             <button className="btn btn-primary" onClick={fetchTournament}>
//               Try Again
//             </button>
//             <Link to="/" className="btn btn-secondary">
//               Back to Dashboard
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!tournament) {
//     return (
//       <div className="tournament-detail-error">
//         <div className="error-content">
//           <div className="error-icon">🏆</div>
//           <h2>Tournament not found</h2>
//           <p>The tournament you're looking for doesn't exist or has been deleted.</p>
//           <Link to="/" className="btn btn-primary">
//             Back to Dashboard
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'players':
//         return (
//           <PlayersTab 
//             tournament={tournament} 
//             onUpdate={handleTournamentUpdate}
//             onRefresh={refreshTournament}
//           />
//         );
//       case 'rounds':
//         return (
//           <RoundsTab 
//             tournament={tournament} 
//             onUpdate={handleTournamentUpdate}
//             onRefresh={refreshTournament}
//           />
//         );
//       case 'standings':
//         return (
//           <StandingsTab 
//             tournament={tournament} 
//             onRefresh={refreshTournament}
//           />
//         );
//       case 'settings':
//         return (
//           <SettingsTab 
//             tournament={tournament} 
//             onUpdate={handleTournamentUpdate}
//             onDelete={() => navigate('/')}
//           />
//         );
//       default:
//         return <PlayersTab tournament={tournament} onUpdate={handleTournamentUpdate} />;
//     }
//   };

//   return (
//     <div className="tournament-detail">
//       <TournamentHeader 
//         tournament={tournament}
//         onUpdate={handleTournamentUpdate}
//         onRefresh={refreshTournament}
//       />
      
//       <div className="tournament-detail-content">
//         <TournamentTabs 
//           activeTab={activeTab}
//           onTabChange={setActiveTab}
//           tournament={tournament}
//         />
        
//         <div className="tab-content">
//           {renderTabContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TournamentDetail;