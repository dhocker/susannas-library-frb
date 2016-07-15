/*
    Simple access to cookies
    Adapted from w3schools.com
    See http://www.w3schools.com/js/js_cookies.asp
*/

export function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + String(cvalue) + "; " + expires;
}

export function getCookieString(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function getCookieInteger(cname) {
    return parseInt(getCookieString(cname), 10);
}
