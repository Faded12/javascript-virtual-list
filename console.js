const scroller = document.querySelector('#virtual-list');
scroller.addEventListener('scroll',updataInfo);

const throttle = (fn, wait) => {
    let lastTime = 0
    return function (...args) {
        let now = new Date().getTime()
        if (now - lastTime > wait) {
            lastTime = now
            fn.apply(this, args)
        }
    }
}

const load = throttle(() => {
    const text = document.querySelector('#virtual-list').children[0]
    const box = document.querySelector('#console')
    res = text.innerHTML.replaceAll("<div style=\"height: 60px;\">", '').replaceAll('</div></div>',
        '</div>\n')
    box.innerHTML = `控制台：<xmp>${res}</xmp>`
}, 200)

function updataInfo() {
    load()
}