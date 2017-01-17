function GetUserId() {
    var userbar = document.querySelector('.userbar');
    var url = userbar.querySelector('a').getAttribute('href');

    return GetParameter(url.split('?')[1], 'user');
}

function GetUrlParameter(key) {
    return GetParameter(window.location.search.substring(1), key);
}

function GetParameter(url, key) {
    var decodeUrl = decodeURIComponent(url);
    var queryStrings = decodeUrl.split('&');
    var value = null;

    for (var i = 0; i < queryStrings.length; i++) {
        var urlParameter = queryStrings[i].split('=');

        if (urlParameter[0] == key)
            value = urlParameter[1];
    }

    return value;
}