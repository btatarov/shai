const Store = require('electron-store')


const schema = {
    colorScheme: {
        type: 'string',
        enum: ['dark', 'light', 'system'],
        default: 'system',
    },
    zoomLevel: {
        type: 'number',
        minimum: 0.8,
        maximum: 1.5,
        default: 1.0,
    },
    hideMenu: {
        type: 'boolean',
        default: false,
    },
    windowSize: {
        type: 'object',
        properties: {
            width: { type: 'number' },
            height: { type: 'number' },
            maximized: { type: 'boolean' },
        },
        default: {
            width: 1024,
            height: 768,
            maximized: false,
        }
    },
}

const config = new Store({schema})

module.exports = { config }
