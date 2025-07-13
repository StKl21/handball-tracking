import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import ActionDialog from './ActionDialog';

const dummyPlayers = [
  { id: 1, firstName: 'Julian', lastName: 'Blum', position: 'LA' },
  { id: 2, firstName: 'Rico', lastName: 'Petruzzi', position: 'TW' },
  { id: 3, firstName: 'Lukas', lastName: 'Wilhelm', position: 'TW' }
];

function PlayerGrid({ game, actions, onSaveAction }) {
  const [players, setPlayers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    setPlayers(dummyPlayers);
  }, []);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setDialogOpen(true);
  };

  const handleSaveAction = async (actionData) => {
    await onSaveAction(actionData);
    setDialogOpen(false);
  };

  return (
    <div>
      <h2>Spieler im Spiel: {game}</h2>
      <Grid container spacing={2}>
        {players.map((player) => (
          <Grid item xs={6} sm={4} md={3} key={player.id}>
            <Paper
              onClick={() => handlePlayerClick(player)}
              style={{
                padding: 16,
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <strong>{player.firstName} {player.lastName}</strong>
              <br />
              <span>{player.position}</span>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <ActionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        player={selectedPlayer}
        onSave={handleSaveAction}
      />

      <div style={{ marginTop: 30 }}>
        <h3>Aktionen:</h3>
        <ul>
          {actions.map((a, i) => (
            <li key={i}>
              {a.player.firstName} {a.player.lastName} - {a.action} - Halbzeit {a.half}
              {a.zone && ` - Zone: ${a.zone}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PlayerGrid;
