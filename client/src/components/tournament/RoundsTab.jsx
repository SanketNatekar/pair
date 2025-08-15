// src/components/tournament/RoundsTab.jsx
import React, { useState } from 'react';
import { tournamentService } from '../../services/tournamentService';
import { toast } from 'react-hot-toast';

const RoundsTab = ({ tournament, onUpdate, onRefresh }) => {
  const [generatingPairings, setGeneratingPairings] = useState(false);
  const [updatingResult, setUpdatingResult] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);

  const rounds = tournament?.rounds || [];
  const players = tournament?.players || [];
  const currentRound = tournament?.currentRound || 0;
  const totalRounds = tournament?.totalRounds || 0;
  
  // Get the latest round or null if no rounds
  const latestRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
  const displayRound = selectedRound || latestRound;

  const handleGeneratePairings = async () => {
    // Validation checks
    if (players.length < 2) {
      toast.error('Need at least 2 players to generate pairings');
      return;
    }

    if (currentRound >= totalRounds) {
      toast.error('Tournament is already complete');
      return;
    }

    // Check if current round is complete (if there is one)
    if (latestRound && !isRoundComplete(latestRound)) {
      toast.error('Complete the current round before generating the next one');
      return;
    }

    try {
      setGeneratingPairings(true);
      
      await tournamentService.generatePairings(tournament._id);
      
      // Refresh tournament data to get new round
      if (onRefresh) onRefresh();
      
      toast.success(`Round ${currentRound + 1} pairings generated successfully!`);
    } catch (error) {
      console.error('Error generating pairings:', error);
      toast.error(error.response?.data?.message || 'Failed to generate pairings');
    } finally {
      setGeneratingPairings(false);
    }
  };

  const handleResultUpdate = async (pairingId, result, roundId) => {

    console.log(pairingId);

    if (!displayRound) return;

    try {
      setUpdatingResult(pairingId);
      
      await tournamentService.updateResult(
        roundId, 
        pairingId, 
        result
      );
      
      // Refresh tournament data
      if (onRefresh) onRefresh();
      
      toast.success('Result updated successfully!');
    } catch (error) {
      console.error('Error updating result:', error);
      toast.error(error.response?.data?.message || 'Failed to update result');
    } finally {
      setUpdatingResult(null);
    }
  };

  const isRoundComplete = (round) => {
    if (!round || !round.pairings) return false;
    return round.pairings.every(pairing => pairing.result !== null && pairing.result !== undefined);
  };

  const getPlayerName = (playerId) => {
    const player = players.find(p => p._id === playerId);
    // console.log(players);
    // console.log(playerId);
    return player ? player.name : 'Unknown Player';
  };

  const getResultDisplay = (result) => {
    switch (result) {
      case '1-0': return '1-0';
      case '0-1': return '0-1';
      case '0.5-0.5': return '½-½';
      default: return 'Pending';
    }
  };

  const getResultButtonClass = (pairing, result) => {
    const isSelected = pairing.result === result;
    const baseClass = "px-3 py-1 text-xs rounded transition-colors ";
    
    if (isSelected) {
      switch (result) {
        case 'white': return baseClass + "bg-green-100 text-green-800 border border-green-300";
        case 'black': return baseClass + "bg-red-100 text-red-800 border border-red-300";
        case 'draw': return baseClass + "bg-yellow-100 text-yellow-800 border border-yellow-300";
        default: return baseClass + "bg-gray-100 text-gray-800 border border-gray-300";
      }
    } else {
      return baseClass + "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tournament Rounds
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Round {currentRound} of {totalRounds} 
            {rounds.length > 0 && ` • ${rounds.length} round${rounds.length !== 1 ? 's' : ''} played`}
          </p>
        </div>
        
        {players.length >= 2 && currentRound < totalRounds && (
          <button
            onClick={handleGeneratePairings}
            disabled={generatingPairings || (latestRound && !isRoundComplete(latestRound))}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingPairings ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Round {currentRound + 1}
              </>
            )}
          </button>
        )}
      </div>

      {/* Round Navigation */}
      {rounds.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {rounds.map((round, index) => (
            <button
              key={round._id}
              onClick={() => setSelectedRound(round)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                displayRound?._id === round._id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Round {round.roundNumber || index + 1}
              {isRoundComplete(round) && <span className="ml-1 text-green-400">✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      {rounds.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No rounds generated yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            {players.length >= 2 
              ? 'Generate the first round to start pairing players.'
              : `Add at least 2 players to generate rounds. Currently ${players.length} player${players.length !== 1 ? 's' : ''}.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Round Display */}
          {displayRound && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">
                    Round {displayRound.roundNumber || rounds.indexOf(displayRound) + 1}
                  </h4>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isRoundComplete(displayRound) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {isRoundComplete(displayRound) ? 'Complete' : 'In Progress'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {displayRound.pairings?.length || 0} pairings
                    </span>
                  </div>
                </div>
              </div>

              {/* Pairings Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        White
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        vs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Black
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayRound.pairings?.map((pairing, index) => (
                      <tr key={pairing._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getPlayerName(pairing.whitePlayerId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-gray-400">vs</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {pairing.blackPlayerId ? getPlayerName(pairing.blackPlayerId) : 'BYE'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            pairing.result 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {getResultDisplay(pairing.result)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {!pairing.blackPlayerId ? (
                            <span className="text-xs text-gray-500">Auto Win</span>
                          ) : (
                            <div className="flex justify-center gap-1">
                              <button
                                onClick={() => handleResultUpdate(pairing._id, '1-0',displayRound._id)}
                                disabled={updatingResult === pairing._id}
                                className={getResultButtonClass(pairing, 'white')}
                              >
                                1-0
                              </button>
                              <button
                                onClick={() => handleResultUpdate(pairing._id, '0.5-0.5',displayRound._id)}
                                disabled={updatingResult === pairing._id}
                                className={getResultButtonClass(pairing, 'draw')}
                              >
                                ½-½
                              </button>
                              <button
                                onClick={() => handleResultUpdate(pairing._id, '0-1',displayRound._id)}
                                disabled={updatingResult === pairing._id}
                                className={getResultButtonClass(pairing, 'black')}
                              >
                                0-1
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Round Completion Status */}
          {displayRound && !isRoundComplete(displayRound) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <svg className="flex-shrink-0 h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Round In Progress</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Enter all match results to complete this round and generate the next one.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tournament Complete */}
          {currentRound >= totalRounds && isRoundComplete(latestRound) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <svg className="flex-shrink-0 h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Tournament Complete! 🎉</h3>
                  <p className="mt-1 text-sm text-green-700">
                    All rounds have been played. Check the standings tab to see the final results.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoundsTab;