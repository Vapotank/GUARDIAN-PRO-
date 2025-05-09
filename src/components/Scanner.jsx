import React, { useState } from 'react';

export default function Scanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult]     = useState(null);

  const startScan = async () => {
    setScanning(true);
    let res;
    if (window.electronAPI && window.electronAPI.runScan) {
      res = await window.electronAPI.runScan();
    } else {
      res = { stdout: 'Scan simulé : aucun problème détecté' };
    }
    setResult(res);
    setScanning(false);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Scanner de Diagnostic</h1>
      <button
        onClick={startScan}
        disabled={scanning}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {scanning ? 'Scan en cours...' : 'Commencer le scan'}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Résultats SFC</h2>
          <pre className="whitespace-pre-wrap">{result.stdout || result.stderr}</pre>
        </div>
      )}
    </div>
  );
}
