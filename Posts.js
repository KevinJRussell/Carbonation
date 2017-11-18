AddFilterMeButton();
AddPostNumber();
AddQuoteStyle();
BlockBlacklistedUsers();

function AddFilterMeButton() {
    var getSetting = browser.storage.local.get('filterme');

    getSetting.then(function (result) {
        var filterEnabled = result.filterme;

        if (filterEnabled === false) return;
        
        var userId = GetUserId();
        var url = document.location + '&u=' + userId;
        var infobar = document.querySelector('.infobar');
        var filterMeButton = document.createElement('a');
        filterMeButton.href = url;
        filterMeButton.id = 'filterMe';
        filterMeButton.innerHTML = 'Filter Me';
        filterMeButton.style = 'text-decoration: none;';

        if (infobar == null) return;

        infobar.insertBefore(document.createTextNode(' | '), infobar.firstChild);
        infobar.insertBefore(filterMeButton, infobar.firstChild);
    });    
}

function AddPostNumber() {
    var pageNumber = GetUrlParameter('page') || 1;
    var postFloor = (pageNumber - 1) * POSTS_PER_PAGE;

    document.querySelectorAll('.message-container').forEach(function (post, index) {
        postNumber = document.createTextNode(` | #${(postFloor + index + 1)}`);
        post.querySelector('.message-top').appendChild(postNumber);
    });
}

function AddQuoteStyle() {
    var getting = browser.storage.local.get('quotestyle');
    getting.then(function (result) {
        var quotestyle = result.quotestyle;

        if (quotestyle == false) return;

        var color = GetBackgroundColor();

        // I should abstract this into the Styles.css file but I'm just not
        var styletag = document.createElement('style');
        styletag.textContent = `.quoted-message {
                                    border: ${color.toString()} 2px solid;
                                    margin: 0 30px 2px 30px;
                                    border-radius: 5px;
                                    padding-left: 3px;
                                }
                                
                                .quoted-message .message-top {
                                    background-color: ${color.toString()};
                                    margin-top: -2px !important;
                                    margin-left: -3px !important;
                                    border-radius: 3px 3px 0 0;
                                }`
        document.body.appendChild(styletag);
    });
}

function BlockBlacklistedUsers() {
    var getting = browser.storage.local.get('blacklist');
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
