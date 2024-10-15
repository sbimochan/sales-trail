const { app, BrowserWindow } = require('electron/main')

function createWindow() {
  const win = new BrowserWindow({
    minWidth: 1024,
    minHeight: 720,
  })

  win.loadFile('index.html')
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
