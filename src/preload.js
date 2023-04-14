const { ipcRenderer } = require('electron')


let useDarkColors = false
ipcRenderer.invoke('getColorScheme').then(scheme => {
    useDarkColors = (scheme === 'dark')
})

document.addEventListener('DOMContentLoaded', async _ => {
    // handle light/dark mode
    const element = document.documentElement
    element.classList.toggle('dark-mode', useDarkColors)
    element.classList.toggle('light-mode', !useDarkColors)
    element.classList.toggle('__fb-dark-mode', useDarkColors)
    element.classList.toggle('__fb-light-mode', !useDarkColors)

    const className = useDarkColors ? '__fb-light-mode' : '__fb-dark-mode'
    const elements = [...document.querySelectorAll(`.${className}`)]
    elements.map(element => {
        element.classList.remove(className)
    })

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
