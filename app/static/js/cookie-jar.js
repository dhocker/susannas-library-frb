/*
    Simple access to cookies
    Adapted from w3schools.com
    See http://www.w3schools.com/js/js_cookies.asp
*/

export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + String(cvalue) + "; " + expires;
}

export function getCookieString(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function getCookieInteger(cname) {
    return parseInt(getCookieString(cname), 10);
}
