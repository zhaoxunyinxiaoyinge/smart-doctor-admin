export {
    customCheckLinkFns
}

const customCheckLinkFns = function (text: string, url: string): undefined | String | Boolean {
    if (!url) {
        return
    }
    if (url.indexOf('http') !== 0) {
        return '链接必须以 http/https 开头'
    }
    return true
}