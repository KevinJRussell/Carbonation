function GetBackgroundColor() {
    return window.getComputedStyle(document.querySelector('.message-top'), null).backgroundColor;
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

function GetUrlParameter(key) {
    return GetParameter(window.location.search.substring(1), key);
}

function GetUrlTopic() {
    return window.location.toString().split('&')[0];
}

function GetUserId() {
    var userbar = document.querySelector('.userbar');
    var url = userbar.querySelector('a').getAttribute('href');

    return GetParameter(url.split('?')[1], 'user');
}

function GetUsernameFromPost(post) {
    return post.querySelector('.message-top').querySelector('a').innerHTML;
}