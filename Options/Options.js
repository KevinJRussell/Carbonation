function saveOptions() {
    browser.storage.local.set({
        blacklist: document.querySelector('#blacklist').value,
        filterme: document.querySelector('#filterme').checked,
        messagehistory: document.querySelector('#messagehistory').checked,
        quickpoststyletags: document.querySelector('#quickpoststyletags').checked,
        postnumbers: document.querySelector('#postnumbers').checked,
        quotestyle: document.querySelector('#quotestyle').checked,
        tcindicator: document.querySelector('#tcindicator').checked,
        usernotebutton: document.querySelector('#usernotebutton').checked
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector('#blacklist').value = result.blacklist;
        document.querySelector('#filterme').checked = result.filterme;
        document.querySelector('#messagehistory').checked = result.messagehistory;
        document.querySelector('#postnumbers').checked = result.postnumbers;
        document.querySelector('#quickpoststyletags').checked = result.quickpoststyletags;
        document.querySelector('#quotestyle').checked = result.quotestyle;
        document.querySelector('#tcindicator').checked = result.tcindicator;
        document.querySelector('#usernotebutton').checked = result.usernotebutton;
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.local.get({
        blacklist: '',
        filterme: false,
        messagehistory: false,
        postnumbers: false,
        quickpoststyletags: false,
        quotestyle: false,
        tcindicator: false,
        usernotebutton: false
    });
    getting.then(setCurrentChoice, onError);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelectorAll('input').forEach((input) => input.addEventListener('change', saveOptions));
