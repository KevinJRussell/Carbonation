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
    var value = null;

    decodeUrl.split('&').forEach(function (queryString) {
            var urlParameter = queryString.split('=');

            if (urlParameter[0] == key)
                value = urlParameter[1];
    });

    return value;
}