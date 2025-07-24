import React, { useState } from 'react';
import { Grid, Paper, Button, TextField } from '@mui/material';
import { players } from './players';

function KaderAuswahl({ onSave, guestTeam }) {
  const [selected, setSelected] = useState(players.map((p) => ({ ...p, active: true })));
  const [gameName, setGameName] = useState(guestTeam || "");
  const [isHome, setIsHome] = useState(true); // Standard: Heimspiel

  const handleClick = (playerId) => {
    setSelected((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, active: !p.active } : p
      )
    );
  };

  const handleSave = () => {
    const squad = selected.filter((p) => p.active);
    onSave(gameName, squad, isHome); // isHome wird übergeben
  };

  return (
    <div>
      <h2>Kader-Auswahl</h2>

      <TextField
        label="Gegner-Team"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      <Button
        variant={isHome ? 'contained' : 'outlined'}
        color="primary"
        onClick={() => setIsHome(true)}
        sx={{ marginRight: 1 }}
      >
        Heimspiel
      </Button>
      <Button
        variant={!isHome ? 'contained' : 'outlined'}
        color="secondary"
        onClick={() => setIsHome(false)}
        sx={{ marginBottom: 3 }}
      >
        Auswärtsspiel
      </Button>

      <Grid container spacing={2}>
        {selected.map((player) => (
          <Grid item xs={6} sm={4} md={3} key={player.id}>
            <Paper
              onClick={() => handleClick(player.id)}
              style={{
                padding: 16,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: player.active ? 'lightgreen' : 'tomato',
              }}
            >
              <strong>{player.firstName} {player.lastName}</strong>
              <br />
              <span>{player.position}</span>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 3 }}
        onClick={handleSave}
      >
        Speichern und Spiel starten
      </Button>
    </div>
  );
}

export default KaderAuswahl;
