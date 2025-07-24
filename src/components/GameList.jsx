import React from 'react';
import Button from '@mui/material/Button';

function GameList({ games, onSelectGame }) {
  return (
    <div>
      <h2>Spiele</h2>
      <ul>
        {games.map((game) => (
          <li key={game.name}>
            <Button
              variant="outlined"
              onClick={() => onSelectGame(game.name)}
              sx={{ marginBottom: 1 }}
            >
              {game.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameList;
