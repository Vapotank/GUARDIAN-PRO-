import React, { useState } from 'react';

export default function Cleaner() {
  const [log, setLog] = useState('');

  const clean = async () => {
    if (window.electronAPI && window.electronAPI.cleanDisk) {
      setLog((await window.electronAPI.cleanDisk()).stdout);
    } else {
      setLog('Simulation : nettoyage terminé.');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Nettoyeur de Disque</h1>
      <button onClick={clean} className="px-4 py-2 bg-blue-600 text-white rounded">Démarrer le nettoyage</button>
      <pre className="mt-4 bg-gray-50 p-2 rounded whitespace-pre-wrap">{log}</pre>
    </div>
  );
}
