const { ipcRenderer } = require('electron')


let colorScheme = 'light'
ipcRenderer.invoke('getColorScheme').then(scheme => {
    colorScheme = (scheme === 'dark') ? 'dark' : 'light'
})

document.addEventListener('DOMContentLoaded', async _ => {
    // set light/dark mode
    document.documentElement.classList.toggle('__fb-light-mode', colorScheme === 'light')
    document.documentElement.classList.toggle('__fb-dark-mode', colorScheme === 'dark')

    // set zoom level
    const updateZoom = _ => {
        ipcRenderer.invoke('getZoomLevel').then(zoomLevel => {
            document.documentElement.style.setProperty('--shai-zoom-level', zoomLevel)
        })
    }
    ipcRenderer.on('api', (_, command) => {
        switch(command) {
            case 'update-zoom':
                updateZoom()
                break
        }
    })
    updateZoom()

    // observe the DOM for ivalid color scheme classes
    const invalidClass = (colorScheme === 'dark') ? '__fb-light-mode' : '__fb-dark-mode'
    const observer = new MutationObserver(_ => {
        if (document.querySelector(`.${invalidClass}`)) {
            [...document.querySelectorAll(`.${invalidClass}`)].map(element => {
                element.classList.remove(invalidClass)
            })
        }
    })
    observer.observe(document.documentElement, {childList: true, subtree: true})

    // handle scroll events
    const triggerScrollEvent = async event => {
        event.target.classList.add('was-scrolled')
    }
    document.addEventListener('wheel', triggerScrollEvent)
    document.addEventListener('touchmove', triggerScrollEvent)

    document.addEventListener('scroll', async event => {
        // was event triggered by the user
        if (!event.target.classList.contains('was-scrolled') && !event.target.querySelectorAll('.was-scrolled')[0]) {
            return
        }

        // remove 'was-scrolled' classes
        let target_children = [...event.target.querySelectorAll('.was-scrolled')]
        target_children.map(element => {
            element.classList.remove('was-scrolled')
        })
        event.target.classList.remove('was-scrolled')

        // is scroll event already in progress?
        if (event.target.scrollIntervalHandle) {
            clearInterval(event.target.scrollIntervalHandle)
        } else {
            event.target.classList.add('is-scrolling')
        }

        // timeout to hide the scrollbars
        event.target.scrollIntervalHandle = setInterval(_ => {
            event.target.classList.remove('is-scrolling')
            clearInterval(event.target.scrollIntervalHandle)
            event.target.scrollIntervalHandle = null
        }, 1500)
    }, true)
})
