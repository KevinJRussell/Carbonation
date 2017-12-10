AddFilterMeButton();
ProcessNewPosts();
AddQuickPostStyleTags();
AddQuoteStyle();
AddTCIndicator();
BlockBlacklistedUsers();
MonitorNewPosts();

function ProcessNewPosts()
{
    var getting = browser.storage.local.get('blacklist');
    getting.then((result) => {
        var blacklistSetting = result.blacklist || "";

        // Split the string of usernames into an array.
        // Allows for both comma separated and comma-space separated lists.
        var blacklist = blacklistSetting.split(',').map((user) => user.trim());

        // Array.from needed because NodeList doesn't implement indexOf
        var messages = Array.from(document.querySelectorAll('.message-container'));
        var newMessages = messages.filter((m) => !m.classList.contains('carbonation-processed'));

        newMessages.forEach((post) => {
            // Add new post processing functions here
            AddPostNumber(post, messages);
            BlockBlacklistedUsers(post, blacklist);
            post.classList.add('carbonation-processed');
        });
    });
}

function AddFilterMeButton() {
    var getSetting = browser.storage.local.get('filterme');

    getSetting.then(function (result) {
        var filterEnabled = result.filterme;

        if (filterEnabled === false) return;

        var userId = GetUserId();
        var url = GetUrlTopic() + '&u=' + userId;
        var infobar = document.querySelector('.infobar');
        var filterMeButton = document.createElement('a');
        filterMeButton.href = url;
        filterMeButton.id = 'filterMe';
        filterMeButton.innerHTML = 'Filter Me';
        filterMeButton.style = 'text-decoration: none;';

        if (infobar === null) return;

        infobar.insertBefore(document.createTextNode(' | '), infobar.firstChild);
        infobar.insertBefore(filterMeButton, infobar.firstChild);
    });
}

function AddPostNumber(post, messages) {
    var pageNumber = GetUrlParameter('page') || 1;
    var postFloor = (pageNumber - 1) * POSTS_PER_PAGE;

    var postIndex = messages.indexOf(post);

    if (postIndex >= 0)
    {
        postNumber = document.createTextNode(` | #${(postFloor + postIndex + 1)}`);
        post.querySelector('.message-top').appendChild(postNumber);
    }
}

function AddQuickPostStyleTags() {
    var getSetting = browser.storage.local.get('quickpoststyletags');

    getSetting.then(function (result) {
        var quickpoststyletags = result.quickpoststyletags;

        if (quickpoststyletags === false) return;

        var quickpostBody = document.querySelector('.quickpost-body');
        var textarea = quickpostBody.querySelector('textarea');

        var italicsButton = document.createElement('button');
        var italicsButtonStatus = false;
        italicsButton.id = 'italicsButton';
        italicsButton.type = 'button';
        italicsButton.innerHTML = 'i';
        italicsButton.onclick = function() {
            AddTextToTextArea(textarea, italicsButtonStatus ? '</i>' : '<i>');
            italicsButtonStatus = !italicsButtonStatus;
            italicsButton.innerHTML = italicsButtonStatus ? '/i' : 'i';
        };

        var boldButton = document.createElement('button');
        var boldButtonStatus = false;
        boldButton.id = 'boldButton';
        boldButton.type = 'button';
        boldButton.innerHTML = 'b';
        boldButton.onclick = function() {
            AddTextToTextArea(textarea, boldButtonStatus ? '</b>' : '<b>');
            boldButtonStatus = !boldButtonStatus;
            boldButton.innerHTML = boldButtonStatus ? '/b' : 'b';
        };

        var underlineButton = document.createElement('button');
        var underlineButtonStatus = false;
        underlineButton.id = 'underlineButton';
        underlineButton.type = 'button';
        underlineButton.innerHTML = 'u';
        underlineButton.onclick = function() {
            AddTextToTextArea(textarea, underlineButtonStatus ? '</u>' : '<u>');
            underlineButtonStatus = !underlineButtonStatus;
            underlineButton.innerHTML = underlineButtonStatus ? '/u' : 'u';
        };

        var preButton = document.createElement('button');
        var preButtonStatus = false;
        preButton.id = 'preButton';
        preButton.type = 'button';
        preButton.innerHTML = 'pre';
        preButton.onclick = function() {
            AddTextToTextArea(textarea, preButtonStatus ? '</pre>' : '<pre>');
            preButtonStatus = !preButtonStatus;
            preButton.innerHTML = preButtonStatus ? '/pre' : 'pre';
        };

        var spoilerButton = document.createElement('button');
        var spoilerButtonStatus = false;
        spoilerButton.id = 'spoilerButton';
        spoilerButton.type = 'button';
        spoilerButton.innerHTML = 'spoiler';
        spoilerButton.onclick = function() {
            AddTextToTextArea(textarea, spoilerButtonStatus ? '</spoiler>' : '<spoiler>');
            spoilerButtonStatus = !spoilerButtonStatus;
            spoilerButton.innerHTML = spoilerButtonStatus ? '/spoiler' : 'spoiler';
        };

        quickpostBody.insertBefore(spoilerButton, quickpostBody.firstChild);
        quickpostBody.insertBefore(preButton, quickpostBody.firstChild);
        quickpostBody.insertBefore(underlineButton, quickpostBody.firstChild);
        quickpostBody.insertBefore(boldButton, quickpostBody.firstChild);
        quickpostBody.insertBefore(italicsButton, quickpostBody.firstChild);
    });
}

function AddQuoteStyle() {
    var getting = browser.storage.local.get('quotestyle');
    getting.then(function (result) {
        var quotestyle = result.quotestyle;

        if (quotestyle === false) return;

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
                                }`;
        document.body.appendChild(styletag);
    });
}

function AddTCIndicator() {
    var getting = browser.storage.local.get('tcindicator');
    getting.then(function (result) {
        var tcindicator = result.tcindicator;

        if (tcindicator === false) return;

        // Too difficult to get the TC if not on the first page
        if (GetPageNumber() !== 1) return;

        var tcName = GetUsernameFromPost(document.querySelector('.message-container'));

        document.querySelectorAll('.message-container').forEach(function (post, index) {
            if (tcName === GetUsernameFromPost(post)) {
                var tcTag = document.createTextNode(` | TC`);
                post.querySelector('.message-top').appendChild(tcTag);
            }
        });
    });
}

function BlockBlacklistedUsers(post, blacklist) {
    if (blacklist.includes(GetUsernameFromPost(post))) {
        post.style = 'display: none;';
    }
}

function MonitorNewPosts() {
    var postObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList")
            {
                ProcessNewPosts();
            }
        });
    });
    postObserver.observe(document.querySelector('.message-container').parentNode, { childList: true });
}
