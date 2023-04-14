const {
    app,
    BrowserWindow,
    ipcMain,
    shell,
    nativeTheme,
} = require('electron')
const fs = require('fs')
const path = require('path')

const config = require('./config').config


const productName = 'Shai'
app.setAppPath(__dirname)
app.setDesktopName(productName + '.desktop')
app.setName(productName)
app.setPath('userCache', path.join(app.getPath('cache'), productName))
app.setPath('userData', path.join(app.getPath('appData'), productName))
app.setVersion('0.0.4')

app.whenReady().then(_ => {
    // start the main window
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        title: app.name,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // handle light/dark mode config
    let colorScheme = 'light'
    if (config.colorScheme === 'system') {
        if (nativeTheme.shouldUseDarkColors) {
            colorScheme = 'dark'
        } else {
            colorScheme = 'light'
        }
    } else {
        colorScheme = config.colorScheme
    }

    ipcMain.handle('getColorScheme', async _ => {
        return colorScheme
    })

    // don't change title on new messages
    win.setTitle(app.name)
    win.on('page-title-updated', async event => {
        event.preventDefault()
    })

    win.loadURL('https://www.messenger.com/login/')

    win.webContents.on('dom-ready', async _ => {
        const cssPath = path.join(__dirname, '..', 'css')

        // inject caprine css
        win.webContents.insertCSS(fs.readFileSync(path.join(cssPath, 'caprine', 'browser.css'), 'utf8'))
        if (colorScheme === 'dark') {
            win.webContents.insertCSS(fs.readFileSync(path.join(cssPath, 'caprine', 'dark-mode.css'), 'utf8'))
        }

        // inject our css files
        win.webContents.insertCSS(fs.readFileSync(path.join(cssPath, 'scrollbars.css'), 'utf8'))
        win.webContents.insertCSS(fs.readFileSync(path.join(cssPath, 'extra.css'), 'utf8'))
    })

    // open links in the default browser
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
