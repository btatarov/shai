const { ipcRenderer } = require('electron')


let colorScheme = 'light'
ipcRenderer.invoke('getColorScheme').then(scheme => {
    colorScheme = (scheme === 'dark') ? 'dark' : 'light'
})

document.addEventListener('DOMContentLoaded', async _ => {
    // set light/dark mode
    document.documentElement.classList.toggle('__fb-light-mode', colorScheme === 'light')
    document.documentElement.classList.toggle('__fb-dark-mode', colorScheme === 'dark')

    // handle scroll events
    document.addEventListener('scroll', async event => {
        if (event.target.scrollIntervalHandle) {
            clearInterval(event.target.scrollIntervalHandle)
        } else {
            event.target.classList.add('is-scrolling')
        }
        event.target.scrollIntervalHandle = setInterval(_ => {
            event.target.classList.remove('is-scrolling')
            clearInterval(event.target.scrollIntervalHandle)
            event.target.scrollIntervalHandle = null
        }, 1500)
    }, true)
})
