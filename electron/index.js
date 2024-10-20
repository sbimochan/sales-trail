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
    autoHideMenuBar: true
  })

  win.loadURL('http://localhost:8000')
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
