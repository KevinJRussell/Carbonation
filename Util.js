function GetUrlParameter(key) {
    var decodeUrl = decodeURIComponent(window.location.search.substring(1));
    var queryStrings = decodeUrl.split('&');
    var value = null;

    for (var i = 0; i < queryStrings.length; i++) {
        var urlParameter = queryStrings[i].split('=');

        if (urlParameter[0] == key)
            value = urlParameter[1];
    }

    return value;
}