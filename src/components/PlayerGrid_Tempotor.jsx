
import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl
} from '@mui/material';
import ActionDialog from './ActionDialog_Tempotor';
import TorwartDialog from './TorwartDialog';

function PlayerGrid({ game, actions, onSaveAction, squad, currentTime }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isGoalie, setIsGoalie] = useState(false);

  const [selectedPlayerFilter, setSelectedPlayerFilter] = useState('all');
  const [minTimeFilter, setMinTimeFilter] = useState('');

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setIsGoalie(player.position === 'TW');
    setDialogOpen(true);
  };

  const handleSaveAction = async (actionData) => {
    await onSaveAction(actionData);
    setDialogOpen(false);
  };

  const filteredActions = actions.filter((a) => {
    const matchesPlayer =
      selectedPlayerFilter === 'all' || a.player?.id === selectedPlayerFilter;
    const matchesTime =
      !minTimeFilter ||
      (a.gameTime &&
        parseInt(a.gameTime.split(':')[0]) >= parseInt(minTimeFilter));
    return matchesPlayer && matchesTime;
  });

  return (
    <div>
      <Grid container spacing={2}>
        {(Array.isArray(squad) ? squad : []).map((player) => (
          <Grid item xs={6} sm={4} md={3} key={player.id}>
            <Paper
              onClick={() => handlePlayerClick(player)}
              style={{
                padding: 16,
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <strong>
                {player.firstName} {player.lastName}
              </strong>
              <br />
              <span>{player.position}</span>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {selectedPlayer && isGoalie ? (
        <TorwartDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          player={selectedPlayer}
          onSave={handleSaveAction}
          currentTime={currentTime}
        />
      ) : (
        <ActionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          player={selectedPlayer}
          onSave={handleSaveAction}
          currentTime={currentTime}
        />
      )}

      <div style={{ marginTop: 30 }}>
        <h3>Aktionen filtern:</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Spieler</InputLabel>
              <Select
                value={selectedPlayerFilter}
                label="Spieler"
                onChange={(e) => setSelectedPlayerFilter(e.target.value)}
              >
                <MenuItem value="all">Alle</MenuItem>
                {squad.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ab Minute"
              type="number"
              value={minTimeFilter}
              onChange={(e) => setMinTimeFilter(e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Gefilterte Aktionen:</h3>
        <ul>
          {filteredActions.map((a, i) => (
            <li key={i}>
              {a.player?.firstName} {a.player?.lastName} – {a.action} –{' '}
              {a.gameTime || '??:??'} – Halbzeit {a.half}
              {a.zone && ` – Zone: ${a.zone}`}
              {a.tempotor && ` – Tempotor: ${a.tempotor}`}
            </li>
          ))}
          {filteredActions.length === 0 && <li>Keine passenden Aktionen gefunden.</li>}
        </ul>
      </div>
    </div>
  );
}

export default PlayerGrid;
