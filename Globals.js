const POSTS_PER_PAGE = 50;

AddMessageHistoryButton();

function AddMessageHistoryButton() {
    var getting = browser.storage.local.get('messagehistory');
    getting.then(function (result) {
        var history = result.messagehistory;

        if (history === false) return;

        var menubar = document.querySelector('.menubar');
        var bookmarks = menubar.querySelector('#bookmarks');
        var messageHistoryButton = document.createElement('a');
        messageHistoryButton.href = 'history.php';
        messageHistoryButton.id = 'messageHistory';
        messageHistoryButton.innerHTML = 'Message History';

        console.log(menubar);
        console.log(bookmarks);
        if (bookmarks === null) return;

        bookmarks.insertBefore(document.createTextNode(' | '), bookmarks.firstChild);
        bookmarks.insertBefore(messageHistoryButton, bookmarks.firstChild);
    });
}