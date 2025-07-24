
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  FormControlLabel,
  Switch
} from '@mui/material';

const actions = [
  { label: 'Tor', color: 'success' },
  { label: 'Fehlwurf', color: 'error' },
  { label: 'Technischer Fehler', color: 'primary' },
  { label: '2-Minuten', color: 'primary' },
];

const tempospielOptionen = ['1. Welle', '2. Welle', 'Schnelle Mitte'];

function ActionDialog({ open, onClose, player, onSave, currentTime }) {
  const [selectedAction, setSelectedAction] = useState('');
  const [half, setHalf] = useState('1');
  const [tempotor, setTempotor] = useState(false);
  const [tempoArt, setTempoArt] = useState('');

  const handleSave = () => {
    onSave({
      player,
      action: selectedAction,
      half,
      gameTime: currentTime,
      tempo: tempotor ? tempoArt : null,
    });
    onClose();
    setSelectedAction('');
    setHalf('1');
    setTempotor(false);
    setTempoArt('');
  };

  const showTempoOptions = selectedAction === 'Tor' && tempotor;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aktion erfassen für {player?.firstName} {player?.lastName}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Spielzeit: {currentTime}</Typography>

        <Typography variant="subtitle1" style={{ marginTop: 20 }}>Aktion wählen</Typography>
        <Grid container spacing={2} style={{ marginTop: 10 }}>
          {actions.map((act) => (
            <Grid item xs={6} key={act.label}>
              <Button
                variant={selectedAction === act.label ? 'contained' : 'outlined'}
                color={act.color}
                fullWidth
                onClick={() => setSelectedAction(act.label)}
              >
                {act.label}
              </Button>
            </Grid>
          ))}
        </Grid>

        {selectedAction === 'Tor' && (
          <FormControlLabel
            style={{ marginTop: 20 }}
            control={
              <Switch
                checked={tempotor}
                onChange={(e) => setTempotor(e.target.checked)}
                color="primary"
              />
            }
            label="Tempotor?"
          />
        )}

        {showTempoOptions && (
          <ToggleButtonGroup
            value={tempoArt}
            exclusive
            onChange={(e, value) => setTempoArt(value)}
            fullWidth
            style={{ marginTop: 10 }}
          >
            {tempospielOptionen.map((opt) => (
              <ToggleButton key={opt} value={opt}>
                {opt}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}

        <Typography variant="subtitle1" style={{ marginTop: 20 }}>Halbzeit</Typography>
        <ToggleButtonGroup
          value={half}
          exclusive
          onChange={(e, value) => setHalf(value)}
          fullWidth
          style={{ marginTop: 10 }}
        >
          <ToggleButton value="1">1. Halbzeit</ToggleButton>
          <ToggleButton value="2">2. Halbzeit</ToggleButton>
        </ToggleButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!selectedAction || (tempotor && selectedAction === 'Tor' && !tempoArt)}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActionDialog;
