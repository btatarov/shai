const {
    dialog,
    ipcMain,
    Menu,
} = require('electron')

const config = require('./config').config


const isMac = process.platform === 'darwin'


const renderMenu = async _ => {
    const macosMenuTemplate = [
        // TODO:
    ]

    const defaultMenuTemplate = [
        {
            role: 'fileMenu',
            submenu: [
                { role: 'quit' }
            ]
        },
        {
            label: 'Settings',
            submenu: [
                {
                    label: 'Theme',
                    submenu: [
                        {
                            label: 'Follow system',
                            type: 'checkbox',
                            checked: config.get('colorScheme') === 'system',
                            click: async _ => {
                                if (config.get('colorScheme') !== 'system') {
                                    config.set('colorScheme', 'system')
                                    ipcMain.emit('main-menu', 'restart')
                                }
                                renderMenu()
                            }
                        },
                        {
                            label: 'Light',
                            type: 'checkbox',
                            checked: config.get('colorScheme') === 'light',
                            click: async _ => {
                                if (config.get('colorScheme') !== 'light') {
                                    config.set('colorScheme', 'light')
                                    ipcMain.emit('main-menu', 'restart')
                                }
                                renderMenu()
                            }
                        },
                        {
                            label: 'Dark',
                            type: 'checkbox',
                            checked: config.get('colorScheme') === 'dark',
                            click: async _ => {
                                if (config.get('colorScheme') !== 'dark') {
                                    config.set('colorScheme', 'dark')
                                    ipcMain.emit('main-menu', 'restart')
                                }
                                renderMenu()
                            }
                        }
                    ]
                },
                {
                    label: 'Zoom level',
                    submenu: [
                        {
                            label: 'Small (80%)',
                            type: 'checkbox',
                            checked: config.get('zoomLevel') === 0.8,
                            click: async _ => {
                                if (config.get('zoomLevel') !== 0.8) {
                                    config.set('zoomLevel', 0.8)
                                    ipcMain.emit('main-menu', 'update-zoom')
                                }
                                renderMenu()
                            }
                        },
                        {
                            label: 'Normal',
                            type: 'checkbox',
                            checked: config.get('zoomLevel') === 1.0,
                            click: async _ => {
                                if (config.get('zoomLevel') !== 1.0) {
                                    config.set('zoomLevel', 1.0)
                                    ipcMain.emit('main-menu', 'update-zoom')
                                }
                                renderMenu()
                            }
                        },
                        {
                            label: 'Large (120%)',
                            type: 'checkbox',
                            checked: config.get('zoomLevel') === 1.2,
                            click: async _ => {
                                if (config.get('zoomLevel') !== 1.2) {
                                    config.set('zoomLevel', 1.2)
                                    ipcMain.emit('main-menu', 'update-zoom')
                                }
                                renderMenu()
                            }
                        },
                        {
                            label: 'Extra large (150%)',
                            type: 'checkbox',
                            checked: config.get('zoomLevel') === 1.5,
                            click: async _ => {
                                if (config.get('zoomLevel') !== 1.5) {
                                    config.set('zoomLevel', 1.5)
                                    ipcMain.emit('main-menu', 'update-zoom')
                                }
                                renderMenu()
                            }
                        },
                    ]
                },
                {
                    label: 'Show menu bar',
                    type: 'checkbox',
                    checked: ! config.get('hideMenu'),
                    click: async _ => {
                        if (config.get('hideMenu')) {
                            config.set('hideMenu', false)
                        } else {
                            config.set('hideMenu', true)
                            dialog.showMessageBox({
                                type: 'info',
                                message: 'The menu bar can be toggled by pressing the ALT key.',
                                buttons: ['OK'],
                            })
                        }
                        ipcMain.emit('main-menu', 'toggle-menu')
                        renderMenu()
                    }
                }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'About',
                    click: async _ => {
                        ipcMain.emit('main-menu', 'about')
                    }
                }
            ]
        }
    ]

    const menuTemplate = (isMac) ? macosMenuTemplate : defaultMenuTemplate

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

    return menu
}

const menu = renderMenu()

module.exports = { menu }
