AddFilterMeButton();
ProcessNewPosts();
AddQuickPostStyleTags();
AddQuoteStyle();
AddTCIndicator();
BlockBlacklistedUsers();
MonitorNewPosts();

function ProcessNewPosts()
{
    const getting = browser.storage.local.get('blacklist');
    getting.then((result) => {
        const blacklistSetting = result.blacklist || "";

        // Split the string of usernames into an array.
        // Allows for both comma separated and comma-space separated lists.
        const blacklist = blacklistSetting.split(',').map((user) => user.trim());

        // Array.from needed because NodeList doesn't implement indexOf
        const messages = Array.from(document.querySelectorAll('.message-container'));
        const newMessages = messages.filter((m) => !m.classList.contains('carbonation-processed'));

        newMessages.forEach((post) => {
            // Add new post processing functions here
            AddPostNumber(post, messages);
            BlockBlacklistedUsers(post, blacklist);
            post.classList.add('carbonation-processed');
        });
    });
}

function AddFilterMeButton() {
    const getSetting = browser.storage.local.get('filterme');

    getSetting.then(function (result) {
        const filterEnabled = result.filterme;

        if (filterEnabled === false) return;

        const userId = GetUserId();
        const url = GetUrlTopic() + '&u=' + userId;
        const infobar = document.querySelector('.infobar');
        const filterMeButton = document.createElement('a');
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
    const pageNumber = GetUrlParameter('page') || 1;
    const postFloor = (pageNumber - 1) * POSTS_PER_PAGE;

    const postIndex = messages.indexOf(post);

    if (postIndex >= 0)
    {
        const postNumber = document.createTextNode(` | #${(postFloor + postIndex + 1)}`);
        post.querySelector('.message-top').appendChild(postNumber);
    }
}

function AddQuickPostStyleTags() {
    const getSetting = browser.storage.local.get('quickpoststyletags');

    getSetting.then(function (result) {
        const quickpoststyletags = result.quickpoststyletags;

        if (quickpoststyletags === false) return;

        const quickpostBody = document.querySelector('.quickpost-body');
        const textarea = quickpostBody.querySelector('textarea');

        const italicsButton = document.createElement('button');
        let italicsButtonStatus = false;
        italicsButton.id = 'italicsButton';
        italicsButton.type = 'button';
        italicsButton.innerHTML = 'i';
        italicsButton.onclick = function() {
            AddTextToTextArea(textarea, italicsButtonStatus ? '</i>' : '<i>');
            italicsButtonStatus = !italicsButtonStatus;
            italicsButton.innerHTML = italicsButtonStatus ? '/i' : 'i';
        };

        const boldButton = document.createElement('button');
        let boldButtonStatus = false;
        boldButton.id = 'boldButton';
        boldButton.type = 'button';
        boldButton.innerHTML = 'b';
        boldButton.onclick = function() {
            AddTextToTextArea(textarea, boldButtonStatus ? '</b>' : '<b>');
            boldButtonStatus = !boldButtonStatus;
            boldButton.innerHTML = boldButtonStatus ? '/b' : 'b';
        };

        const underlineButton = document.createElement('button');
        let underlineButtonStatus = false;
        underlineButton.id = 'underlineButton';
        underlineButton.type = 'button';
        underlineButton.innerHTML = 'u';
        underlineButton.onclick = function() {
            AddTextToTextArea(textarea, underlineButtonStatus ? '</u>' : '<u>');
            underlineButtonStatus = !underlineButtonStatus;
            underlineButton.innerHTML = underlineButtonStatus ? '/u' : 'u';
        };

        const preButton = document.createElement('button');
        let preButtonStatus = false;
        preButton.id = 'preButton';
        preButton.type = 'button';
        preButton.innerHTML = 'pre';
        preButton.onclick = function() {
            AddTextToTextArea(textarea, preButtonStatus ? '</pre>' : '<pre>');
            preButtonStatus = !preButtonStatus;
            preButton.innerHTML = preButtonStatus ? '/pre' : 'pre';
        };

        const spoilerButton = document.createElement('button');
        let spoilerButtonStatus = false;
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
    const getting = browser.storage.local.get('quotestyle');
    getting.then(function (result) {
        const quotestyle = result.quotestyle;

        if (quotestyle === false) return;

        const color = GetBackgroundColor();

        // I should abstract this into the Styles.css file but I'm just not
        const styletag = document.createElement('style');
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
    const getting = browser.storage.local.get('tcindicator');
    getting.then(function (result) {
        const tcindicator = result.tcindicator;

        if (tcindicator === false) return;

        // Too difficult to get the TC if not on the first page
        if (GetPageNumber() !== 1) return;

        const tcName = GetUsernameFromPost(document.querySelector('.message-container'));

        document.querySelectorAll('.message-container').forEach(function (post) {
            if (tcName === GetUsernameFromPost(post)) {
                const tcTag = document.createTextNode(` | TC`);
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
    const postObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                ProcessNewPosts();
            }
        });
    });
    postObserver.observe(document.querySelector('.message-container').parentNode, { childList: true });
}
