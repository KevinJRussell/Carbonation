let settings;
let blacklist;
let pageNumber;
let usernotes;

GetSettings();

// Setup functions:
function GetSettings() {
    const getSettings = browser.storage.local.get();

    getSettings.then(function (result) {
        settings = result;

        PrepareUserData();

        ProcessPage();

        ProcessPosts();

        MonitorNewPosts();
    });
}

function PrepareUserData() {
    // Allow for both comma delimited and comma-space delimited lists
    blacklist = settings.blacklist.split(',').map((user) => user.trim());
    pageNumber = GetPageNumber();
    usernotes = new Map(settings.usernotes);
}

function ProcessPage() {
    if (settings.filterme)
        AddFilterMeButton();

    if (settings.quickpoststyletags)
        AddQuickPostStyleTags();

    if (settings.quotestyle)
        AddQuoteStyle();
}

function ProcessPosts() {
    // Array.from needed because NodeList doesn't implement indexOf
    const messages = Array.from(document.querySelectorAll('.message-container'));
    const newMessages = messages.filter((m) => !m.classList.contains('carbonation-processed'));

    newMessages.forEach((post) => {
        if (settings.usernotebutton)
            AddUserNoteButton(post);

        // If url parameter u has a value, we are on a filtered post list
        if (settings.postnumbers && GetUrlParameter('u') === null)
            AddPostNumber(post, messages.indexOf(post));

        // Too difficult to get the TC if not on the first page
        if (settings.tcindicator && pageNumber === 1)
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
                ProcessPosts();
            }
        });
    });
    postObserver.observe(document.querySelector('.message-container').parentNode, { childList: true });
}

// Page mods:
function AddFilterMeButton() {
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
}

function AddPostNumber(post, index) {
    if (index < 0) return;

    const pageNumber = GetPageNumber();
    const postFloor = (pageNumber - 1) * POSTS_PER_PAGE;
    const postNumberNode = document.createTextNode(` | #${(postFloor + index + 1)}`);

    post.querySelector('.message-top').appendChild(postNumberNode);
}

function AddQuickPostStyleTags() {
    const quickpostBody = document.querySelector('.quickpost-body');
    const textarea = quickpostBody.querySelector('textarea');

    const italicsButton = CreateStyleTagButton(textarea, 'italics', 'i');
    const boldButton = CreateStyleTagButton(textarea, 'bold', 'b');
    const underlineButton = CreateStyleTagButton(textarea, 'underline', 'u');
    const preButton = CreateStyleTagButton(textarea, 'pre', 'pre');
    const spoilerButton = CreateStyleTagButton(textarea, 'spoiler', 'spoiler');
    const imgButton = CreateStyleTagButton(textarea, 'img', 'img');

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
    const tcName = GetUsernameFromPost(document.querySelector('.message-container'));

    if (tcName === null) return; // Probably an Anonymous topic

    if (tcName === GetUsernameFromPost(post)) {
        const tcTag = document.createTextNode(` | TC`);
        post.querySelector('.message-top').appendChild(tcTag);
    }
}

function AddUserNoteButton(post) {
    const notesButton = document.createElement('a');
    notesButton.innerHTML = 'Notes';
    notesButton.onclick = () => ToggleUserNoteArea(post);

    post.querySelector('.message-top').appendChild(document.createTextNode(' | '));
    post.querySelector('.message-top').appendChild(notesButton);
}

function ToggleUserNoteArea(post) {
    const userId = GetUserIdFromPost(post);
    const notesArea = post.querySelector('.message-top .usernotes-area');

    if (userId === null) return; // Prevents notes in Anonymous topics, which would apply to every Human ever

    if (notesArea) {
        SaveUserNotes(notesArea.value, userId);

        notesArea.remove();
    } else {
        const usernotesArea = document.createElement('textarea');
        usernotesArea.id = 'usernotes-area';
        usernotesArea.classList.add('usernotes-area');
        usernotesArea.style = 'width: 100%; opacity: 0.6;';
        usernotesArea.value = usernotes.get(userId) === undefined ? '' : usernotes.get(userId);

        post.querySelector('.message-top').appendChild(usernotesArea);
    }
}

function SaveUserNotes(notes, userId) {
    if (notes === '') return;

    usernotes.set(userId, notes);

    browser.storage.local.set({
        usernotes: [...usernotes]
    });
}

function BlockBlacklistedUsers(post, blacklist) {
    if (blacklist.includes(GetUsernameFromPost(post))) {
        post.style = 'display: none;';
    }
}