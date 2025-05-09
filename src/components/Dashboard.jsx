import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.getStats) {
      window.electronAPI.getStats().then(setStats);
    } else {
      setStats({ cpu: '–%', memory: '– MB', diskFree: '– GB' });
    }
  }, []);

  if (!stats) return <p>Chargement des statistiques…</p>;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white shadow rounded">
        <h2 className="text-lg font-semibold">État du Système</h2>
        <ul className="mt-2 list-disc list-inside">
          <li>CPU : {stats.cpu}</li>
          <li>Mémoire libre : {stats.memory}</li>
          <li>Espace disque libre : {stats.diskFree}</li>
        </ul>
      </div>
    </div>
  );
}
