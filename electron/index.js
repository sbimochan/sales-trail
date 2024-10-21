const { join } = require('path')
const { spawn } = require('child_process')
const { app, BrowserWindow } = require('electron/main')

const public = join(__dirname, 'api', 'public')
const php = join(__dirname, 'php-bin', 'php')
const server = spawn(php, ['-S', 'localhost:8000'], { cwd: public })

function createWindow() {
  const win = new BrowserWindow({
    minWidth: 1024,
    minHeight: 768,
    icon: 'icon.png',
    autoHideMenuBar: true,
    show: false
  })

  const splash = new BrowserWindow({
    width: 310,
    height: 150,
    resizable: false,
    frame: false,
    show: true,
    autoHideMenuBar: true
  })

  splash.loadFile('./assets/splash.html')
  splash.show()

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
