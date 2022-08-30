document.addEventListener('DOMContentLoaded', async () => {
    const useDarkColors = true

    const element = document.documentElement
	element.classList.toggle('dark-mode', useDarkColors)
	element.classList.toggle('light-mode', !useDarkColors)
	element.classList.toggle('__fb-dark-mode', useDarkColors)
	element.classList.toggle('__fb-light-mode', !useDarkColors)

	const className = useDarkColors ? '__fb-light-mode' : '__fb-dark-mode'
	for (const element of document.querySelectorAll(`.${className}`)) {
		element.classList.remove(className);
	}
})
