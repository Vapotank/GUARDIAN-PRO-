import React, { useState } from 'react';

export default function Updates() {
  const [log, setLog] = useState('');

  const check   = async () => {
    if (window.electronAPI && window.electronAPI.checkUpdates) {
      setLog((await window.electronAPI.checkUpdates()).stdout);
    } else {
      setLog('Simulation : pas de mises à jour trouvées.');
    }
  };
  const install = async () => {
    if (window.electronAPI && window.electronAPI.installUpdates) {
      setLog((await window.electronAPI.installUpdates()).stdout);
    } else {
      setLog('Simulation : mises à jour installées.');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Gestionnaire de Mises à Jour</h1>
      <div>
        <button onClick={check}   className="px-3 py-1 mr-2 bg-gray-200 rounded">Vérifier</button>
        <button onClick={install} className="px-3 py-1 bg-green-500 text-white rounded">Installer</button>
      </div>
      <pre className="mt-4 bg-gray-50 p-2 rounded whitespace-pre-wrap">{log}</pre>
    </div>
  );
}
