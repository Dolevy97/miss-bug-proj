export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    loadFromStorage,
    saveToStorage,
    animateCSS,
    getRandomColor,
    getFormattedTime,
    debounce
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color', 'of nature', 'tuned', 'to', 'a live channel', 'All', 'this happened', 'more or less', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)]
        if (size >= 1) txt += ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function animateCSS(el, animation = 'bounce') {
    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)
        function handleAnimationEnd(event) {
            event.stopPropagation()
            el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getFormattedTime(time) {
    if (time === null) return
    const date = new Date(time)
    const now = Date.now()
    const diffInSeconds = Math.floor((now - time) / 1000)
    const day = 60 * 60 * 24

    if (diffInSeconds < 60) return 'a few seconds ago'
    if (diffInSeconds < 60 * 5) return 'a few minutes ago'
    if (diffInSeconds < 60 * 60) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 60 * 60 * 2) return 'an hour ago'
    if (diffInSeconds < 60 * 60 * 3) return 'a couple of hours ago'
    if (diffInSeconds < 60 * 60 * 24) return `${Math.floor(diffInSeconds / (60 * 60))} hours ago`

    const startOfToday = new Date().setHours(0, 0, 0, 0)
    if (time >= startOfToday) return 'today'

    const currYear = new Date().getFullYear()
    const diffInDays = Math.floor(diffInSeconds / day)

    if (diffInDays < 1) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    if (date.getFullYear() === currYear) return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
    return new Intl.DateTimeFormat('en-US').format(date)
}

function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}