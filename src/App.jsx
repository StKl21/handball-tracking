import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GameList from './components/GameList';
import PlayerGrid from './components/PlayerGrid_Tempotor';
import KaderAuswahl from './components/KaderAuswahl';
import StatistikSeite from './components/StatistikSeite_Tempotor';
import {
  addGame,
  getAllGames,
  getGameByName,
  addAction,
  getAllActions,
  updateGameScore,
} from './components/db';

function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [guestTeam, setGuestTeam] = useState('');
  const [actions, setActions] = useState([]);
  const [showKaderSelection, setShowKaderSelection] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [guestScore, setGuestScore] = useState(0);
  const [squad, setSquad] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [half, setHalf] = useState(1);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const loadGames = async () => {
    const allGames = await getAllGames();
    setGames(allGames);
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleSelectGame = async (gameName) => {
    const game = await getGameByName(gameName);
    setSelectedGame(gameName);
    setGuestTeam(game?.guestTeam || '');
    setSquad(Array.isArray(game?.squad) ? game.squad : []);
    setHomeScore(game?.score?.home || 0);
    setGuestScore(game?.score?.guest || 0);
    const allActions = await getAllActions();
    const filtered = allActions.filter((a) => a.gameName === gameName);
    setActions(filtered);
  };

  const handleNewGame = async () => {
    const guestTeamName = prompt("Name des Gegners:");
    if (guestTeamName) {
      setGuestTeam(guestTeamName);
      setSelectedGame(guestTeamName);
      setShowKaderSelection(true);
    }
  };

  const handleSaveSquad = async (gameName, finalSquad) => {
    await addGame(gameName, guestTeam, finalSquad);
    setSquad(finalSquad);
    setShowKaderSelection(false);
    loadGames();
  };

  const handleSaveAction = async (actionData) => {
    const newAction = {
      ...actionData,
      gameName: selectedGame,
      timestamp: new Date(),
      gameTime: formatTime(elapsedSeconds),
      half: half
    };
    await addAction(newAction);
    setActions((prev) => [...prev, newAction]);

    if (newAction.action === 'Tor') {
      const newHome = homeScore + 1;
      setHomeScore(newHome);
      await updateGameScore(selectedGame, newHome, guestScore);
    }
    if (newAction.action === 'Gegentor') {
      const newGuest = guestScore + 1;
      setGuestScore(newGuest);
      await updateGameScore(selectedGame, homeScore, newGuest);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const toggleClock = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next === 1800 && half === 1) {
            clearInterval(intervalRef.current);
            const startSecondHalf = window.confirm("2. Halbzeit starten?");
            if (startSecondHalf) {
              setHalf(2);
              intervalRef.current = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
            }
          }
          if (next >= 3600) {
            clearInterval(intervalRef.current);
            return 3600;
          }
          return next;
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const handleBackToOverview = () => {
    const confirmEnd = window.confirm("Spiel beenden und zur Übersicht zurück?");
    if (confirmEnd) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setElapsedSeconds(0);
      setHalf(1);
      setSelectedGame(null);
      setShowKaderSelection(false);
    } else {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <div style={{ padding: 20 }}>
          {!selectedGame && !showKaderSelection && (
            <>
              <h1>Hexabanner Match Tracking</h1>
              <button onClick={handleNewGame}>Neues Spiel anlegen</button>
              <GameList
                games={games}
                onSelectGame={handleSelectGame}
                onNewGame={handleNewGame}
              />
            </>
          )}

          {showKaderSelection && (
            <KaderAuswahl
              onSave={handleSaveSquad}
              guestTeam={guestTeam}
            />
          )}

          {selectedGame && !showKaderSelection && (
            <>
              <button onClick={handleBackToOverview}>
                Zurück zur Übersicht
              </button>
              <h2 style={{ marginTop: 20, fontSize: "1.5em" }}>
                TSV Wolfschlugen {homeScore} : {guestScore} {guestTeam}
              </h2>

              <div style={{ margin: '10px 0' }}>
                <button
                  onClick={toggleClock}
                  style={{
                    backgroundColor: isRunning ? 'yellow' : 'lightgreen',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    fontWeight: 'bold'
                  }}
                >
                  {isRunning ? 'Pause' : 'Play'}
                </button>

                <span style={{ marginLeft: 20, fontWeight: 'bold' }}>
                  Spielzeit: {formatTime(elapsedSeconds)} – {half}. Halbzeit
                </span>

                <button
                  style={{
                    marginLeft: 20,
                    backgroundColor: '#9c27b0',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '5px'
                  }}
                  onClick={() => navigate('/statistik')}
                >
                  Statistik ansehen
                </button>
              </div>

              <PlayerGrid
                game={selectedGame}
                actions={actions}
                onSaveAction={handleSaveAction}
                squad={squad}
                currentTime={formatTime(elapsedSeconds)}
              />
            </>
          )}
        </div>
      } />

      <Route
        path="/statistik"
        element={
          <StatistikSeite
            gameName={selectedGame}
            actions={actions}
            squad={squad}
          />
        }
      />
    </Routes>
  );
}

export default App;