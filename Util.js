function AddTextToTextArea(ta, text) {
    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    if (start || start === 0) {
        ta.value = ta.value.substring(0, start)
            + text
            + ta.value.substring(end, ta.value.length);
    }
    else {
        ta.value += text;
    }

    // Set the cursor at the end of the new style tag
    ta.focus();
    ta.setSelectionRange(start + text.length, start + text.length);
}

function CreateStyleTagButton(textarea, buttonName, buttonType) {
    const newButton = document.createElement('button');
    newButton.id = `${buttonName}Button`;
    newButton.type = 'button';
    newButton.innerText = buttonType;
    newButton.tabIndex = -1;
    newButton.onclick = function() {
      AddTextToTextArea(textarea, newButton.innerText.startsWith('/') ? `</${buttonType}>` : `<${buttonType}>`);
      console.log(newButton.innerText.startsWith('/'));
      newButton.innerText = newButton.innerText.startsWith('/') ? `${buttonType}` : `/${buttonType}`;
    };

    return newButton;
}

function GetBackgroundColor() {
    return window.getComputedStyle(document.querySelector('.message-top'), null).backgroundColor;
}

function GetPageNumber() {
    const pageNumber = GetUrlParameter('page');

    return pageNumber === null ? 1 : parseInt(pageNumber);
}

function GetParameter(url, key) {
    const decodeUrl = decodeURIComponent(url);
    let value = null;

    decodeUrl.split('&').forEach(function (queryString) {
        const urlParameter = queryString.split('=');

        if (urlParameter[0] === key)
            value = urlParameter[1];
    });

    return value;
}

// key = url parameter
// Examples:
// id = Message ID (used with message.php)
// page = Page Number (not present on page 1)
// r = Revision Number (for individual messages)
// u = User ID (Only used on showmessages.php in conjunction with topic for filtering)
function GetUrlParameter(key) {
    return GetParameter(window.location.search.substring(1), key);
}

function GetUrlTopic() {
    return window.location.toString().split('&')[0];
}

function GetUserId() {
    const userbar = document.querySelector('.userbar');
    const url = userbar.querySelector('a').getAttribute('href');

    return GetParameter(url.split('?')[1], 'user');
}

function GetUserIdFromPost(post) {
    const url = post.querySelector('.message-top a').getAttribute('href');

    return GetParameter(url.split('?')[1], 'user');
}

function GetUsernameFromPost(post) {
    const username = post.querySelector('.message-top a').innerHTML;
    return username === 'Filter' ? null : username;
}