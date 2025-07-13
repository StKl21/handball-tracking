import React from 'react';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';

function ExportData({ actions, gameName }) {
  const handleExport = () => {
    if (actions.length === 0) {
      alert('Keine Daten zum Exportieren!');
      return;
    }

    const rows = actions.map(a => ({
      Spiel: gameName,
      Spieler: `${a.player.firstName} ${a.player.lastName}`,
      Position: a.player.position,
      Aktion: a.action,
      Zone: a.zone || '',
      Halbzeit: a.half
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Aktionen');

    XLSX.writeFile(workbook, `handball_${gameName}.xlsx`);
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleExport}
      style={{ marginTop: 20 }}
    >
      Export als Excel
    </Button>
  );
}

export default ExportData;
