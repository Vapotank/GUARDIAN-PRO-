import React, { useState, useEffect } from 'react';

export default function Optimize() {
  const [startup, setStartup]   = useState([]);
  const [services, setServices] = useState([]);
  const [log, setLog]           = useState('');

  useEffect(() => {
    (async () => {
      if (window.electronAPI && window.electronAPI.getStartup) {
        const s = (await window.electronAPI.getStartup()).stdout.split(/\r?\n/).filter(Boolean);
        setStartup(s);
      } else {
        setStartup(['App1', 'App2']);
      }
      if (window.electronAPI && window.electronAPI.getServices) {
        const out = (await window.electronAPI.getServices()).stdout;
        const svc = out.split(/\r?\n/).filter(l => l.startsWith('SERVICE_NAME')).map(l => l.split(':')[1].trim());
        setServices(svc);
      } else {
        setServices(['ServiceA', 'ServiceB']);
      }
    })();
  }, []);

  const freeMem   = async () => {
    if (window.electronAPI && window.electronAPI.optimizeMemory) {
      setLog((await window.electronAPI.optimizeMemory()).stdout);
    } else {
      setLog('Simulation : mémoire standby libérée.');
    }
  };
  const toggleSvc = async (name, action) => {
    if (window.electronAPI && window.electronAPI.setService) {
      setLog((await window.electronAPI.setService({ service: name, action })).stdout);
    } else {
      setLog(`Simulation : ${action} ${name}.`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Optimisation Générale</h2>
        <button onClick={freeMem} className="px-3 py-1 bg-yellow-500 rounded">Libérer mémoire standby</button>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Applications au démarrage</h2>
        <ul className="list-disc list-inside">{startup.map(a => <li key={a}>{a}</li>)}</ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Services Windows</h2>
        <table className="min-w-full bg-white">
          <thead><tr><th>Service</th><th>Action</th></tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s}>
                <td className="p-2">{s}</td>
                <td className="p-2">
                  <button onClick={()=>toggleSvc(s,'start')} className="px-2 py-1 bg-green-500 text-white rounded mr-2">Start</button>
                  <button onClick={()=>toggleSvc(s,'stop')}  className="px-2 py-1 bg-red-500 text-white rounded">Stop</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {log && <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{log}</pre>}
    </div>
);
}
