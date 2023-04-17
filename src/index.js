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
const menu = require('./menu').menu


const productName = 'Shai'
app.setAppPath(__dirname)
app.setDesktopName(productName + '.desktop')
app.setName(productName)
app.setPath('userCache', path.join(app.getPath('cache'), productName))
app.setPath('userData', path.join(app.getPath('appData'), productName))
app.setVersion('0.1.0')

app.whenReady().then(_ => {
    // start the main window
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        title: app.name,
        iconPath: 'media/icons/512x512.png',
        autoHideMenuBar: config.get('hideMenu'),
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // handle light/dark mode config
    let colorScheme = 'light'
    if (config.get('colorScheme') === 'system') {
        if (nativeTheme.shouldUseDarkColors) {
            colorScheme = 'dark'
        } else {
            colorScheme = 'light'
        }
    } else {
        colorScheme = config.get('colorScheme')
    }

    ipcMain.handle('getColorScheme', async _ => {
        return colorScheme
    })

    // handle zoom level config
    ipcMain.handle('getZoomLevel', async _ => {
        return config.get('zoomLevel')
    })

    // set about page options
    app.setAboutPanelOptions({
        applicationName: app.name,
        applicationVersion: app.getVersion(),
        copyright: 'Created by: Bogdan Tatarov',
        website: 'https://github.com/btatarov/shai',
        iconPath: 'media/icons/512x512.png'
    })

    // handle main menu events
    ipcMain.on('main-menu', async command => {
        switch(command) {
            case 'restart':
                app.relaunch()
		        app.quit()
                break
            case 'update-zoom':
                win.webContents.send('api', 'update-zoom')
                break
            case 'toggle-menu':
                win.setAutoHideMenuBar(config.get('hideMenu'))
                win.setMenuBarVisibility(!config.get('hideMenu'))
                break
            case 'about':
                app.showAboutPanel()
                break
        }
    })

    // don't change title on new messages
    win.setTitle(app.name)
    win.on('page-title-updated', async event => {
        event.preventDefault()
    })

    win.loadURL('https://www.messenger.com/login/')

    // inject the css files
    win.webContents.on('dom-ready', async _ => {
        const cssPath = path.join(__dirname, '..', 'css')
        win.webContents.insertCSS(fs.readFileSync(path.join(cssPath, 'main.css'), 'utf8'))
        win.webContents.insertCSS(fs.readFileSync(path.join(cssPath, 'dark.css'), 'utf8'))
        win.webContents.insertCSS(fs.readFileSync(path.join(cssPath, 'scrollbars.css'), 'utf8'))
    })

    // open links in the default browser
    win.webContents.setWindowOpenHandler(details => {
        if (details.url) {
            shell.openExternal(details.url)
            return {action: 'deny'}
        }
        return {action: 'allow'}
    })
})

// close app
app.on('window-all-closed', _ => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
