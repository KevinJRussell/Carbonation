let styletags;

GetSettings();

function GetSettings() {
    const getSettings = browser.storage.local.get('styletags');

    getSettings.then(function (result) {
        styletags = result.styletags;
        console.log(styletags);

        if (styletags)
          AddStyleTags()
    });
}

function AddStyleTags() {
    const parentForm = document.querySelector('form');
    const textarea = document.querySelector('#message');

    const italicsButton = CreateStyleTagButton(textarea, 'italics', 'i');
    const boldButton = CreateStyleTagButton(textarea, 'bold', 'b');
    const underlineButton = CreateStyleTagButton(textarea, 'underline', 'u');
    const preButton = CreateStyleTagButton(textarea, 'pre', 'pre');
    const spoilerButton = CreateStyleTagButton(textarea, 'spoiler', 'spoiler');
    const imgButton = CreateStyleTagButton(textarea, 'img', 'img');

    parentForm.insertBefore(italicsButton, textarea);
    parentForm.insertBefore(boldButton, textarea);
    parentForm.insertBefore(underlineButton, textarea);
    parentForm.insertBefore(preButton, textarea);
    parentForm.insertBefore(spoilerButton, textarea);
    parentForm.insertBefore(document.createElement('br'), textarea);
}