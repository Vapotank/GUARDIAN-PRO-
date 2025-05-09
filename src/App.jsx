import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Scanner   from './components/Scanner';
import Updates   from './components/Updates';
import Optimize  from './components/Optimize';
import Cleaner   from './components/Cleaner';
import Logs      from './components/Logs';  // <-- import

export default function App() {
  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-100 p-4">
        <ul className="space-y-2">
          <li><NavLink to="/"        end         className="block p-2">Dashboard</NavLink></li>
          <li><NavLink to="/scanner"             className="block p-2">Scanner</NavLink></li>
          <li><NavLink to="/updates"             className="block p-2">Mises à jour</NavLink></li>
          <li><NavLink to="/optimize"            className="block p-2">Optimisation</NavLink></li>
          <li><NavLink to="/cleaner"             className="block p-2">Nettoyeur</NavLink></li>
          <li><NavLink to="/logs"                className="block p-2">Logs</NavLink></li> {/* nouveau */}
        </ul>
      </nav>
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/scanner"  element={<Scanner />} />
          <Route path="/updates"  element={<Updates />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/cleaner"  element={<Cleaner />} />
          <Route path="/logs"     element={<Logs />} />               {/* nouvelle */}
        </Routes>
      </main>
    </div>
  );
}
