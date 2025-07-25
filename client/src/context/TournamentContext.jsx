import React, { createContext, useContext, useState } from 'react';

const TournamentContext = createContext();

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider = ({ children }) => {
  const [currentTournament, setCurrentTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);

  return (
    <TournamentContext.Provider value={{
      currentTournament, setCurrentTournament,
      players, setPlayers,
      rounds, setRounds
    }}>
      {children}
    </TournamentContext.Provider>
  );
};