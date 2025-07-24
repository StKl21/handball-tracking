import React from "react";
import Papa from "papaparse";
import { addPlayer } from "./db.jsx";

const ImportPlayers = () => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        console.log("CSV DATA:", results.data);
        for (const player of results.data) {
          await addPlayer({
            first_name: player.first_name,
            last_name: player.last_name,
            position: player.position,
            jersey_number: player.jersey_number || ""
          });
        }
        alert("Spieler erfolgreich importiert!");
      }
    });
  };

  return (
    <div style={{ margin: "20px" }}>
      <h3>Spieler-Import</h3>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
};

export default ImportPlayers;
