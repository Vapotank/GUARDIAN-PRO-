const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../build/index.html'));
  } else {
    win.loadURL('http://localhost:3000');
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Helper to execute commands
const execPromise = (cmd) => new Promise(resolve => {
  exec(cmd, { windowsHide: true }, (err, stdout, stderr) => resolve({ err, stdout, stderr }));
});

// IPC handlers
ipcMain.handle('get-stats', async () => {
  const cpu = await execPromise('wmic cpu get loadpercentage /value');
  const mem = await execPromise('wmic OS get FreePhysicalMemory /value');
  const disk = await execPromise('wmic logicaldisk where DeviceID="C:" get FreeSpace /value');
  return {
    cpu: (cpu.stdout.match(/LoadPercentage=(\d+)/)?.[1] ?? '0') + '%',
    memory: Math.round((parseInt(mem.stdout.match(/FreePhysicalMemory=(\d+)/)?.[1] ?? '0') / 1024)) + ' MB',
    diskFree: Math.round((parseInt(disk.stdout.match(/FreeSpace=(\d+)/)?.[1] ?? '0') / (1024 ** 3))) + ' GB'
  };
});
ipcMain.handle('run-scan', () => execPromise('sfc /scannow'));
ipcMain.handle('repair-issues', () => execPromise('DISM /Online /Cleanup-Image /RestoreHealth'));
ipcMain.handle('check-updates', () => execPromise('powershell "Get-WindowsUpdate -AcceptAll -IgnoreReboot"'));
ipcMain.handle('install-updates', () => execPromise('powershell "Install-WindowsUpdate -AcceptAll -IgnoreReboot"'));
ipcMain.handle('optimize-memory', () => execPromise('EmptyStandbyList.exe workingsets'));
ipcMain.handle('get-startup', () => execPromise('reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'));
ipcMain.handle('set-startup', (e, { name, exe }) => execPromise(
  `reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v "${name}" /t REG_SZ /d "${exe}" /f`
));
ipcMain.handle('get-services', () => execPromise('sc query type= service state= all'));
ipcMain.handle('set-service', (e, { service, action }) => execPromise(`sc ${action} "${service}"`));
ipcMain.handle('clean-disk', () => execPromise('cleanmgr /d C: /sagerun:1'));

