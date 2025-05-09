import React, { useEffect, useRef, useState } from 'react';

export default function Logs() {
  const [lines, setLines] = useState([]);
  const bottomRef = useRef();

  useEffect(() => {
    // S'abonner aux messages 'process-log'
    window.electronAPI.onLog((msg) => {
      setLines(prev => [...prev, msg]);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className="p-4 h-full bg-black text-green-300 font-mono overflow-y-auto">
      {lines.map((l, i) => <div key={i}>{l}</div>)}
      <div ref={bottomRef} />
    </div>
  );
}
