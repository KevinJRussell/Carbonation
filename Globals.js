// Constant fields:
const POSTS_PER_PAGE = 50;

AddMessageHistoryButton();

// Global page mods:
function AddMessageHistoryButton() {
    const getting = browser.storage.local.get('messagehistory');
    getting.then(function (result) {
        const history = result.messagehistory;

        if (history === false) return;

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