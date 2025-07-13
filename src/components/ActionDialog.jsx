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
  'Tor',
  'Fehlwurf',
  'Assist',
  'Technischer Fehler',
  '2-Minuten',
  'Gegentor',
  'Gehalten'
];

const zones = [
  'LA',
  'Rückraum',
  'Kreis',
  'RA',
  'Durchbruch'
];

function ActionDialog({ open, onClose, player, onSave }) {
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [half, setHalf] = useState('1');

  const handleSave = () => {
    onSave({
      player,
      action: selectedAction,
      zone: selectedZone,
      half
    });
    onClose();
    setSelectedAction('');
    setSelectedZone('');
    setHalf('1');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aktion erfassen für {player?.firstName} {player?.lastName}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Aktion wählen</Typography>
        <Grid container spacing={2} style={{ marginTop: 10 }}>
          {actions.map((act) => (
            <Grid item xs={6} key={act}>
              <Button
                variant={selectedAction === act ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => setSelectedAction(act)}
              >
                {act}
              </Button>
            </Grid>
          ))}
        </Grid>

        {(selectedAction === 'Gegentor' || selectedAction === 'Gehalten') && (
          <>
            <Typography variant="subtitle1" style={{ marginTop: 20 }}>Zone wählen</Typography>
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
          disabled={!selectedAction || ((selectedAction === 'Gegentor' || selectedAction === 'Gehalten') && !selectedZone)}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActionDialog;
