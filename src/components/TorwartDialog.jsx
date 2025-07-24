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
  Typography
} from '@mui/material';

const actions = [
  { label: 'Gegentor', color: 'error' },
  { label: 'Parade', color: 'success' },
  { label: 'Tor', color: 'primary' },
  { label: 'Technischer Fehler', color: 'primary' }
];

const zones = ['LA', 'Rückraum', 'Durchbruch', 'RA', 'Kreis'];
const tempoOptions = ['1. Welle', '2. Welle', 'Schnelle Mitte'];

function TorwartDialog({ open, onClose, player, onSave, currentTime }) {
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [half, setHalf] = useState('1');
  const [tempoAsked, setTempoAsked] = useState(false);
  const [tempo, setTempo] = useState('');

  const handleSave = () => {
    onSave({
      player,
      action: selectedAction,
      zone: selectedZone,
      half,
      time: currentTime,
      tempo: tempo || null
    });
    onClose();
    reset();
  };

  const reset = () => {
    setSelectedAction('');
    setSelectedZone('');
    setHalf('1');
    setTempo('');
    setTempoAsked(false);
  };

  const handleActionClick = (label) => {
    setSelectedAction(label);
    if (label === 'Gegentor' || label === 'Parade') {
      setTempoAsked(false);
    } else {
      setSelectedZone('');
      setTempoAsked(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aktion erfassen (TW) – {player?.firstName} {player?.lastName}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Aktion wählen</Typography>
        <Grid container spacing={2} style={{ marginTop: 10 }}>
          {actions.map(({ label, color }) => (
            <Grid item xs={6} key={label}>
              <Button
                variant={selectedAction === label ? 'contained' : 'outlined'}
                color={color}
                fullWidth
                onClick={() => handleActionClick(label)}
              >
                {label}
              </Button>
            </Grid>
          ))}
        </Grid>

        {(selectedAction === 'Gegentor' || selectedAction === 'Parade') && (
          <>
            <Typography variant="subtitle1" style={{ marginTop: 20 }}>Wurfposition</Typography>
            <ToggleButtonGroup
              value={selectedZone}
              exclusive
              onChange={(e, value) => setSelectedZone(value)}
              fullWidth
              style={{ marginTop: 10 }}
            >
              {zones.map((zone) => (
                <ToggleButton key={zone} value={zone}>
                  {zone}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Typography variant="subtitle1" style={{ marginTop: 20 }}>Tempotor?</Typography>
            <ToggleButtonGroup
              value={tempoAsked ? 'Ja' : 'Nein'}
              exclusive
              onChange={(e, value) => setTempoAsked(value === 'Ja')}
              fullWidth
              style={{ marginTop: 10 }}
            >
              <ToggleButton value="Ja">Ja</ToggleButton>
              <ToggleButton value="Nein">Nein</ToggleButton>
            </ToggleButtonGroup>
          </>
        )}

        {tempoAsked && (
          <>
            <Typography variant="subtitle1" style={{ marginTop: 20 }}>Tempospiel-Art</Typography>
            <ToggleButtonGroup
              value={tempo}
              exclusive
              onChange={(e, value) => setTempo(value)}
              fullWidth
              style={{ marginTop: 10 }}
            >
              {tempoOptions.map((opt) => (
                <ToggleButton key={opt} value={opt}>
                  {opt}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </>
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
          disabled={!selectedAction || ((selectedAction === 'Gegentor' || selectedAction === 'Parade') && !selectedZone)}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TorwartDialog;