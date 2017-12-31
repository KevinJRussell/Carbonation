let settings;
let blacklist;

GetSettings();

// Setup functions:
function GetSettings() {
    const getSettings = browser.storage.local.get();

    getSettings.then(function (result) {
        settings = result;

        // Allow for both comma delimited and comma-space delimited lists
        blacklist = result.blacklist.split(',').map((user) => user.trim());
        // In case it happens to be the first time the extension has been run since User Notes were added
        if (settings.usernotes === undefined) settings.usernotes = new Map();

        ProcessPage();

        ProcessNewPosts();

        MonitorNewPosts();
    });
}

function ProcessPage() {
    if (settings.filterme)
        AddFilterMeButton();

    if (settings.quickpoststyletags)
        AddQuickPostStyleTags();

    if (settings.quotestyle)
        AddQuoteStyle();
}

function ProcessNewPosts() {
    // Array.from needed because NodeList doesn't implement indexOf
    const messages = Array.from(document.querySelectorAll('.message-container'));
    const newMessages = messages.filter((m) => !m.classList.contains('carbonation-processed'));

    newMessages.forEach((post) => {
        if (settings.usernotebutton)
            AddUserNotes(post);

        if (settings.postnumbers)
            AddPostNumber(post, messages);

        if (settings.tcindicator)
            AddTCIndicator(post);

        if (blacklist)
            BlockBlacklistedUsers(post, blacklist);

        post.classList.add('carbonation-processed');
    });
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

// Page mods:
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
    const pageNumber = GetPageNumber();
    const postFloor = (pageNumber - 1) * POSTS_PER_PAGE;

    const postIndex = messages.indexOf(post);

    if (postIndex >= 0)
    {
        const postNumber = document.createTextNode(` | #${(postFloor + postIndex + 1)}`);
        post.querySelector('.message-top').appendChild(postNumber);
    }
}

function AddQuickPostStyleTags() {
    const quickpostBody = document.querySelector('.quickpost-body');
    const textarea = quickpostBody.querySelector('textarea');

    const italicsButton = document.createElement('button');
    let italicsButtonStatus = false;
    italicsButton.id = 'italicsButton';
    italicsButton.type = 'button';
    italicsButton.innerText = 'i';
    italicsButton.onclick = function() {
        AddTextToTextArea(textarea, italicsButtonStatus ? '</i>' : '<i>');
        italicsButtonStatus = !italicsButtonStatus;
        italicsButton.innerText = italicsButtonStatus ? '/i' : 'i';
    };

    const boldButton = document.createElement('button');
    let boldButtonStatus = false;
    boldButton.id = 'boldButton';
    boldButton.type = 'button';
    boldButton.innerText = 'b';
    boldButton.onclick = function() {
        AddTextToTextArea(textarea, boldButtonStatus ? '</b>' : '<b>');
        boldButtonStatus = !boldButtonStatus;
        boldButton.innerText = boldButtonStatus ? '/b' : 'b';
    };

    const underlineButton = document.createElement('button');
    let underlineButtonStatus = false;
    underlineButton.id = 'underlineButton';
    underlineButton.type = 'button';
    underlineButton.innerText = 'u';
    underlineButton.onclick = function() {
        AddTextToTextArea(textarea, underlineButtonStatus ? '</u>' : '<u>');
        underlineButtonStatus = !underlineButtonStatus;
        underlineButton.innerText = underlineButtonStatus ? '/u' : 'u';
    };

    const preButton = document.createElement('button');
    let preButtonStatus = false;
    preButton.id = 'preButton';
    preButton.type = 'button';
    preButton.innerText = 'pre';
    preButton.onclick = function() {
        AddTextToTextArea(textarea, preButtonStatus ? '</pre>' : '<pre>');
        preButtonStatus = !preButtonStatus;
        preButton.innerText = preButtonStatus ? '/pre' : 'pre';
    };

    const spoilerButton = document.createElement('button');
    let spoilerButtonStatus = false;
    spoilerButton.id = 'spoilerButton';
    spoilerButton.type = 'button';
    spoilerButton.innerText = 'spoiler';
    spoilerButton.onclick = function() {
        AddTextToTextArea(textarea, spoilerButtonStatus ? '</spoiler>' : '<spoiler>');
        spoilerButtonStatus = !spoilerButtonStatus;
        spoilerButton.innerText = spoilerButtonStatus ? '/spoiler' : 'spoiler';
    };

    quickpostBody.insertBefore(spoilerButton, quickpostBody.firstChild);
    quickpostBody.insertBefore(preButton, quickpostBody.firstChild);
    quickpostBody.insertBefore(underlineButton, quickpostBody.firstChild);
    quickpostBody.insertBefore(boldButton, quickpostBody.firstChild);
    quickpostBody.insertBefore(italicsButton, quickpostBody.firstChild);
}

function AddQuoteStyle() {
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
}

function AddTCIndicator(post) {
    // Too difficult to get the TC if not on the first page
    if (GetPageNumber() !== 1) return;

    const tcName = GetUsernameFromPost(document.querySelector('.message-container'));

    if (tcName === GetUsernameFromPost(post)) {
        const tcTag = document.createTextNode(` | TC`);
        post.querySelector('.message-top').appendChild(tcTag);
    }
}

function AddUserNotes(post) {
    const notesButton = document.createElement('a');
    notesButton.innerHTML = 'Notes';
    notesButton.onclick = () => ToggleUserNoteArea(post);

    post.querySelector('.message-top').appendChild(document.createTextNode(' | '));
    post.querySelector('.message-top').appendChild(notesButton);
}

function ToggleUserNoteArea(post) {
    const userId = GetUserIdFromPost(post);
    const notes = post.querySelector('.message-top .usernotes-area');

    if (notes) {
        SaveUserNotes(notes.value, userId);

        notes.remove();
    } else {
        const usernotesArea = document.createElement('textarea');
        usernotesArea.id = 'usernotes-area';
        usernotesArea.classList.add('usernotes-area');
        usernotesArea.style = 'width: 100%; opacity: 0.6;';
        usernotesArea.value = settings.usernotes.get(userId) === undefined ? '' : settings.usernotes.get(userId);

        post.querySelector('.message-top').appendChild(usernotesArea);
    }
}

function SaveUserNotes(notes, userId) {
    settings.usernotes.set(userId, notes);

    browser.storage.local.set({
        usernotes: settings.usernotes
    });
}

function BlockBlacklistedUsers(post, blacklist) {
    if (blacklist.includes(GetUsernameFromPost(post))) {
        post.style = 'display: none;';
    }
}