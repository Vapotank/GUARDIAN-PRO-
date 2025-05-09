const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// Helper pour streaming
function spawnWithLog(command, args = []) {
  return new Promise(resolve => {
    const proc = spawn(command, args, { shell: true, windowsHide: true });
    proc.stdout.on('data', data => {
      mainWindow.webContents.send('process-log', data.toString());
    });
    proc.stderr.on('data', data => {
      mainWindow.webContents.send('process-log', data.toString());
    });
    proc.on('close', code => {
      mainWindow.webContents.send('process-log', `→ Process finished (code ${code})\n`);
      resolve(code);
    });
  });
}

// IPC handlers
ipcMain.handle('get-stats', async () => {
  const execPromise = cmd => new Promise(res =>
    exec(cmd, { windowsHide: true }, (err, stdout, stderr) => res({ err, stdout, stderr }))
  );
  const cpu  = await execPromise('wmic cpu get loadpercentage /value');
  const mem  = await execPromise('wmic OS get FreePhysicalMemory /value');
  const disk = await execPromise('wmic logicaldisk where DeviceID="C:" get FreeSpace /value');
  return {
    cpu:      (cpu.stdout.match(/LoadPercentage=(\d+)/)?.[1] ?? '0') + '%',
    memory:   Math.round((parseInt(mem.stdout.match(/FreePhysicalMemory=(\d+)/)?.[1] ?? '0') / 1024)) + ' MB',
    diskFree: Math.round((parseInt(disk.stdout.match(/FreeSpace=(\d+)/)?.[1] ?? '0') / (1024 ** 3))) + ' GB'
  };
});

ipcMain.handle('run-scan',       () => spawnWithLog('sfc', ['/scannow']).then(() => spawnWithLog('chkdsk', ['C:', '/F', '/R'])));
ipcMain.handle('repair-issues',   () => spawnWithLog('DISM', ['/Online', '/Cleanup-Image', '/RestoreHealth']));
ipcMain.handle('check-updates',   () => spawnWithLog('powershell', ['-Command', 'Get-WindowsUpdate -AcceptAll -IgnoreReboot']));
ipcMain.handle('install-updates', () => spawnWithLog('powershell', ['-Command', 'Install-WindowsUpdate -AcceptAll -IgnoreReboot']));
ipcMain.handle('optimize-memory', () => spawnWithLog('EmptyStandbyList.exe', ['workingsets']));
ipcMain.handle('get-startup',     () => spawnWithLog('reg', ['query', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run']));
ipcMain.handle('set-startup',     (e, cfg) => spawnWithLog('reg', ['add', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', '/v', cfg.name, '/t', 'REG_SZ', '/d', cfg.exe, '/f']));
ipcMain.handle('get-services',    () => spawnWithLog('sc', ['query', 'type=', 'service', 'state=', 'all']));
ipcMain.handle('set-service',     (e, srv) => spawnWithLog('sc', [srv.action, srv.service]));
ipcMain.handle('clean-disk',      () => spawnWithLog('cleanmgr', ['/d', 'C:', '/sagerun:1']));
