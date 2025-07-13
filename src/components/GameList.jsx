import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import { addGame, getAllGames } from './db';

function GameList({ onSelectGame }) {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState('');

  useEffect(() => {
    async function loadGames() {
      const storedGames = await getAllGames();
      setGames(storedGames);
    }
    loadGames();
  }, []);

  const handleAddGame = async () => {
    if (newGame.trim() === '') return;
    const id = await addGame(newGame);
    setGames([...games, { id, name: newGame }]);
    setNewGame('');
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Spiele</h2>
      <TextField
        label="Neues Spiel (z. B. Gegner)"
        value={newGame}
        onChange={(e) => setNewGame(e.target.value)}
        variant="outlined"
        size="small"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddGame}
        style={{ marginLeft: 10 }}
      >
        Hinzufügen
      </Button>

      <List>
        {games.map((game) => (
          <ListItem
            button
            key={game.id}
            onClick={() => onSelectGame(game.name)}
          >
            <ListItemText primary={game.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default GameList;
