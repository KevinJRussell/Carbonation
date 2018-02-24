// Constant fields:
const POSTS_PER_PAGE = 50;

AddMessageHistoryButton();
ErrorPage();

// Global page mods:
function AddMessageHistoryButton() {
    const getting = browser.storage.local.get('messagehistory');
    getting.then(function (result) {
        const history = result.messagehistory;

        if (history !== true) return;

        const menubar = document.querySelector('.menubar');
        const bookmarks = menubar.querySelector('#bookmarks');
        const messageHistoryButton = document.createElement('a');
        messageHistoryButton.href = '/history.php';
        messageHistoryButton.id = 'messageHistory';
        messageHistoryButton.innerHTML = 'Message History';

        if (bookmarks === null) return;

        bookmarks.insertBefore(document.createTextNode(' | '), bookmarks.firstChild);
        bookmarks.insertBefore(messageHistoryButton, bookmarks.firstChild);
    });
}

function ErrorPage() {
    if (document.body.style.backgroundImage.indexOf('errorlinks.png') == -1)
        return;

    var carbonationError = document.createElement('div');
    carbonationError.style.top = '40%';
    carbonationError.style.left = '40%';
    carbonationError.style.position = 'absolute';

    var errorMessage = document.createElement('a');
    errorMessage.href = '/history.php';
    errorMessage.id = 'historyLink';
    errorMessage.innerHTML = 'Browse Message History';

    var newMessage = document.createElement('a');
    newMessage.href = '/postmsg.php?tag=LUE';
    newMessage.id = 'newMessageLink';
    newMessage.innerHTML = 'Post New Message';

    var irc = document.createElement('a');
    irc.href = 'https://qchat.rizon.net/?channels=ETI';
    irc.target = '_blank';
    irc.id = 'ircLink';
    irc.innerHTML = 'Come chat on IRC while ETI is down!';

    carbonationError.insertBefore(irc, carbonationError.firstChild);
    carbonationError.insertBefore(document.createElement('br'), carbonationError.firstChild);
    carbonationError.insertBefore(newMessage, carbonationError.firstChild);
    carbonationError.insertBefore(document.createElement('br'), carbonationError.firstChild);
    carbonationError.insertBefore(errorMessage, carbonationError.firstChild);

    document.body.appendChild(carbonationError);
}