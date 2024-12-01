const php = require('./php')
const { join } = require('path')
const { spawn } = require('child_process')
const { app, BrowserWindow } = require('electron/main')

const server = spawn(php, ['-S', 'localhost:8000'], {
  cwd: join(__dirname, 'api', 'public')
})

let splash;
app.disableHardwareAcceleration();

const createWindow = () => {
  splash = new BrowserWindow({
    width: 620,
    height: 300,
    resizable: false,
    frame: false,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
    icon: './assets/incon.png'
  })

  splash.loadFile('./assets/splash.html')

  splash.once('ready-to-show', () => {
    splash.show();
  });

  const win = new BrowserWindow({
    minWidth: 1024,
    minHeight: 768,
    autoHideMenuBar: true,
    show: false,
    icon: './assets/icon.png'
  })

  win.loadURL('http://localhost:8000')

  win.once('ready-to-show', () => {
    splash.close()
    win.show()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  server.kill()
  app.quit()
})
