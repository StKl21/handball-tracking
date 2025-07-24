
import React from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function StatistikSeite({ actions, squad }) {
  const navigate = useNavigate();

  const isGoalie = (position) => ['TW'].includes(position);

  const grouped = squad.map((player) => {
    const playerActions = actions.filter(a => a.player?.id === player.id);

    if (isGoalie(player.position)) {
      const gehalten = playerActions.filter(a => a.action === 'Gehalten').length;
      const gegentore = playerActions.filter(a => a.action === 'Gegentor').length;
      const sum = gehalten + gegentore;
      const quote = sum > 0 ? `${Math.round((gehalten / sum) * 100)} %` : '-';

      return { ...player, gehalten, gegentore, quote };
    } else {
      const tore = playerActions.filter(a => a.action === 'Tor').length;
      const fehlwuerfe = playerActions.filter(a => a.action === 'Fehlwurf').length;
      const technFehler = playerActions.filter(a => a.action === 'Technischer Fehler').length;
      const sum = tore + fehlwuerfe;
      const quote = sum > 0 ? `${Math.round((tore / sum) * 100)} %` : '-';

      return { ...player, tore, fehlwuerfe, technFehler, quote };
    }
  });

  const feldspieler = grouped.filter(p => !isGoalie(p.position));
  const torhueter = grouped.filter(p => isGoalie(p.position));

  return (
    <div style={{ padding: 20 }}>
      <Button variant="outlined" onClick={() => navigate(-1)}>Zurück zum Tracking</Button>

      <Typography variant="h5" style={{ marginTop: 20 }}>Feldspieler</Typography>
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
            {feldspieler.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.firstName} {p.lastName}</TableCell>
                <TableCell>{p.tore}</TableCell>
                <TableCell>{p.fehlwuerfe}</TableCell>
                <TableCell>{p.quote}</TableCell>
                <TableCell>{p.technFehler}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5">Torhüter</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Spieler</TableCell>
              <TableCell>Gehalten</TableCell>
              <TableCell>Gegentore</TableCell>
              <TableCell>Quote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {torhueter.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.firstName} {p.lastName}</TableCell>
                <TableCell>{p.gehalten}</TableCell>
                <TableCell>{p.gegentore}</TableCell>
                <TableCell>{p.quote}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default StatistikSeite;
