const { join } = require('path')
const { spawn } = require('child_process')
const { app, BrowserWindow } = require('electron/main')

const artisan = join(__dirname, 'api', 'artisan')
const php = spawn('php', [artisan, 'serve'])

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

app.on('window-all-closed', app.quit)

app.on('before-quit', () => {
  php.kill()
})
