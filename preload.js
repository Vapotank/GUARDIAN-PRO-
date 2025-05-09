const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getStats:       () => ipcRenderer.invoke('get-stats'),
  runScan:        () => ipcRenderer.invoke('run-scan'),
  repair:         () => ipcRenderer.invoke('repair-issues'),
  checkUpdates:   () => ipcRenderer.invoke('check-updates'),
  installUpdates: () => ipcRenderer.invoke('install-updates'),
  optimizeMemory: () => ipcRenderer.invoke('optimize-memory'),
  getStartup:     () => ipcRenderer.invoke('get-startup'),
  setStartup:     cfg => ipcRenderer.invoke('set-startup', cfg),
  getServices:    () => ipcRenderer.invoke('get-services'),
  setService:     srv => ipcRenderer.invoke('set-service', srv),
  cleanDisk:      () => ipcRenderer.invoke('clean-disk'),
  // Nouveau : abonnement aux logs du process principal
  onLog:          callback => ipcRenderer.on('process-log', (_, message) => callback(message))
});
