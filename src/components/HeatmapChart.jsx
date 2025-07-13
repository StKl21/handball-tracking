import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

function HeatmapChart({ actions }) {
  const zones = ['LA', 'Rückraum', 'Kreis', 'RA', 'Durchbruch'];
  const halves = ['1', '2'];

  const counts = {};

  for (let half of halves) {
    counts[half] = {};
    zones.forEach(zone => {
      counts[half][zone] = { goals: 0, saves: 0 };
    });
  }

  for (let action of actions) {
    if (!action.zone) continue;

    if (action.action === 'Gegentor') {
      counts[action.half][action.zone].goals += 1;
    } else if (action.action === 'Gehalten') {
      counts[action.half][action.zone].saves += 1;
    }
  }

  const chartData = [];
  for (let half of halves) {
    for (let zone of zones) {
      chartData.push({
        name: `${zone} (HZ ${half})`,
        Gegentore: counts[half][zone].goals,
        Gehalten: counts[half][zone].saves
      });
    }
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Heatmap (Balkendiagramm)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Gegentore" fill="#ff4d4f" />
          <Bar dataKey="Gehalten" fill="#52c41a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HeatmapChart;
