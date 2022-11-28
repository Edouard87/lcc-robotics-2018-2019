function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}

function setLocale(lang) {

  document.cookie = "language=" + lang + ";path=/";
  location.reload(true)

}

// window.alert(getCookie("language"));
// window.alert(document.cookie)

if (getCookie("language") == null) {

  document.cookie = "language=en;path=/"

}
