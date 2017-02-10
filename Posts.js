AddFilterMeButton();
AddPostNumber();
BlockBlacklistedUsers();

function AddFilterMeButton() {
    var userId = GetUserId();
    var url = document.location + '&u=' + userId;
    var infobar = document.querySelector('.infobar');
    var filterMeButton = document.createElement('a');
    filterMeButton.href = url;
    filterMeButton.id = 'filterMe';
    filterMeButton.innerHTML = 'Filter Me';
    filterMeButton.style = 'text-decoration: none;';

    infobar.insertBefore(document.createTextNode(' | '), infobar.firstChild);
    infobar.insertBefore(filterMeButton, infobar.firstChild);
}

function AddPostNumber() {
    var pageNumber = GetUrlParameter('page') || 1;
    var postFloor = (pageNumber - 1) * POSTS_PER_PAGE;

    document.querySelectorAll('.message-container').forEach(function (post, index) {
        postNumber = document.createTextNode(` | #${(postFloor + index + 1)}`);
        post.querySelector('.message-top').appendChild(postNumber);
    });
}

function BlockBlacklistedUsers() {
    var getting = browser.storage.local.get("blacklist");
    getting.then(function (result) {
        var blacklist = result.blacklist;

        if (blacklist == null) return;

        // Split the string of usernames into an array.
        // Allows for both comma separated and comma-space separated lists.
        // TODO: Doesn't actually work. Probably scoping issue
        var blacklist = blacklist.split(',');
        blacklist.forEach(function (user, index) {
            if (user.substring(0) === " ") { user = user.slice(1); }
        });

        document.querySelectorAll('.message-container').forEach(function (post, index) {
            if (blacklist.includes(GetUsernameFromPost(post))) {
                post.style = 'display: none;';
            }
        });
    });
}