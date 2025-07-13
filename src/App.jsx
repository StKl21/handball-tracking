import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import GameList from './components/GameList';
import PlayerGrid from './components/PlayerGrid';
import HeatmapChart from './components/HeatmapChart';
import { getAllActions, addAction } from './components/db';
import ExportData from './components/ExportData';


function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    async function load() {
      const all = await getAllActions();
      setActions(all);
    }
    load();
  }, []);

  const handleSaveAction = async (action) => {
  console.log('ACTION DATA TO SAVE:', action);
  await addAction(action);
  const all = await getAllActions();
  console.log('ALL ACTIONS FROM DB:', all);
  setActions(all);
};

  return (
    <div style={{ padding: 20 }}>
      <h1>Handball Tracking App</h1>

      {!selectedGame ? (
        <GameList onSelectGame={setSelectedGame} />
      ) : (
        <>
          <h2>Spiel: {selectedGame}</h2>
          <PlayerGrid
            game={selectedGame}
            actions={actions}
            onSaveAction={handleSaveAction}
          />
          <HeatmapChart actions={actions} />
          <ExportData actions={actions} gameName={selectedGame} />
          <Button
            variant="contained"
            onClick={() => setSelectedGame(null)}
            style={{ marginTop: 20 }}
          >
            Zurück zur Spielauswahl
          </Button>
        </>
      )}
    </div>
  );
}

export default App;
