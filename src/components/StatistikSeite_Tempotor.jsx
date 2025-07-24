
import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function StatistikSeite({ actions = [], squad = [] }) {
  const navigate = useNavigate();

  const feldspieler = (squad || []).filter(p => p.position !== 'TW');
  const torhueter = (squad || []).filter(p => p.position === 'TW');

  const countActions = (playerId, type) =>
    actions.filter(a => a.player?.id === playerId && a.action === type).length;

  const countTempotore = (welle) =>
    actions.filter(a => a.action === 'Tor' && a.tempotor === welle).length;

  const getQuote = (tore, fehlwuerfe) =>
    tore + fehlwuerfe === 0 ? '—' : `${Math.round((tore / (tore + fehlwuerfe)) * 100)}%`;

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Spielstatistik
      </Typography>

      <Button variant="contained" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        Zurück zum Tracking
      </Button>

      <Typography variant="h6" gutterBottom>Feldspieler</Typography>
      <TableContainer component={Paper} style={{ marginBottom: 30 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Spieler</TableCell>
              <TableCell>Tore</TableCell>
              <TableCell>Fehlwürfe</TableCell>
              <TableCell>Quote</TableCell>
              <TableCell>Techn. Fehler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feldspieler.map((p) => {
              const tore = countActions(p.id, 'Tor');
              const fehl = countActions(p.id, 'Fehlwurf');
              const tf = countActions(p.id, 'Technischer Fehler');
              return (
                <TableRow key={p.id}>
                  <TableCell>{p.firstName} {p.lastName}</TableCell>
                  <TableCell>{tore}</TableCell>
                  <TableCell>{fehl}</TableCell>
                  <TableCell>{getQuote(tore, fehl)}</TableCell>
                  <TableCell>{tf}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>Torhüter</Typography>
      <TableContainer component={Paper} style={{ marginBottom: 30 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Spieler</TableCell>
              <TableCell>Gegentore</TableCell>
              <TableCell>Gehalten</TableCell>
              <TableCell>Quote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {torhueter.map((p) => {
              const gt = countActions(p.id, 'Gegentor');
              const gehalten = countActions(p.id, 'Gehalten');
              return (
                <TableRow key={p.id}>
                  <TableCell>{p.firstName} {p.lastName}</TableCell>
                  <TableCell>{gt}</TableCell>
                  <TableCell>{gehalten}</TableCell>
                  <TableCell>{getQuote(gehalten, gt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>Tempotore</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Welle</TableCell>
              <TableCell>Anzahl</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {['1. Welle', '2. Welle', 'Schnelle Mitte'].map((welle) => (
              <TableRow key={welle}>
                <TableCell>{welle}</TableCell>
                <TableCell>{countTempotore(welle)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default StatistikSeite;
