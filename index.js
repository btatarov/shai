#!/usr/bin/electron
const { app, BrowserWindow, shell } = require('electron')
const fs = require('fs')
const path = require('path')

const productName = 'Shai'
app.setAppPath(__dirname)
app.setDesktopName(productName + '.desktop')
app.setName(productName)
app.setPath('userCache', path.join(app.getPath('cache'), productName))
app.setPath('userData', path.join(app.getPath('appData'), productName))
app.setVersion('0.0.2')

app.whenReady().then(_ => {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        title: app.name,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.setTitle(app.name)
    win.on('page-title-updated', async event => {
        event.preventDefault()
    })

    win.loadURL('https://www.messenger.com/login/')
    win.webContents.on('dom-ready', async _ => {
        // inject caprine css
        const files = ['browser.css', 'scrollbar.css', 'dark-mode.css']
        const cssPath = path.join(__dirname, 'css', 'caprine')
        for (const file of files) {
            if (fs.existsSync(path.join(cssPath, file))) {
                win.webContents.insertCSS(fs.readFileSync(path.join(cssPath, file), 'utf8'))
            }
        }

        // inject our css
        win.webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'css', 'extra.css'), 'utf8'))
    })

    // open links in the browser
    win.webContents.setWindowOpenHandler(details => {
        shell.openExternal(details.url)
        return {action: 'deny'}
    })
})

// close app
app.on('window-all-closed', _ => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
