
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

const baseActions = [
  'Tor',
  'Fehlwurf',
  'Technischer Fehler',
  '2-Minuten'
];

const tempowellen = [
  '1. Welle',
  '2. Welle',
  'Schnelle Mitte'
];

function ActionDialog({ open, onClose, player, onSave, currentTime }) {
  const [selectedAction, setSelectedAction] = useState('');
  const [half, setHalf] = useState('1');
  const [isTempotor, setIsTempotor] = useState(null);
  const [tempoWelle, setTempoWelle] = useState('');

  const handleSave = () => {
    onSave({
      player,
      action: selectedAction,
      half,
      time: currentTime,
      tempotor: isTempotor ? tempoWelle : null
    });
    setSelectedAction('');
    setIsTempotor(null);
    setTempoWelle('');
    setHalf('1');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aktion erfassen für {player?.firstName} {player?.lastName}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Aktion wählen</Typography>
        <Grid container spacing={2} style={{ marginTop: 10 }}>
          {baseActions.map((act) => (
  <Grid item xs={6} key={act}>
    <Button
      variant={selectedAction === act ? 'contained' : 'outlined'}
      fullWidth
      onClick={() => setSelectedAction(act)}
      style={{
        backgroundColor:
          selectedAction === act
            ? act === 'Tor'
              ? 'lightgreen'
              : act === 'Fehlwurf'
              ? '#ff9999'
              : undefined
            : undefined
      }}
    >
      {act}
    </Button>
  </Grid>
))}

        </Grid>

        {selectedAction === 'Tor' && (
          <>
            <Typography variant="subtitle1" style={{ marginTop: 20 }}>Tempotor?</Typography>
            <ToggleButtonGroup
              value={isTempotor}
              exclusive
              onChange={(e, value) => setIsTempotor(value)}
              fullWidth
              style={{ marginTop: 10 }}
            >
              <ToggleButton value={true}>Ja</ToggleButton>
              <ToggleButton value={false}>Nein</ToggleButton>
            </ToggleButtonGroup>

            {isTempotor === true && (
              <>
                <Typography variant="subtitle1" style={{ marginTop: 20 }}>Welle auswählen</Typography>
                <ToggleButtonGroup
                  value={tempoWelle}
                  exclusive
                  onChange={(e, value) => setTempoWelle(value)}
                  fullWidth
                  style={{ marginTop: 10 }}
                >
                  {tempowellen.map((w) => (
                    <ToggleButton key={w} value={w}>{w}</ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </>
            )}
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
          disabled={
            !selectedAction ||
            (selectedAction === 'Tor' && isTempotor === true && !tempoWelle)
          }
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActionDialog;
