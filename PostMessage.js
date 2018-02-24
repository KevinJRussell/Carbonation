let styletags;
let styletaglocation;

GetSettings();

function GetSettings() {
    const getSettings = browser.storage.local.get();

    getSettings.then(function (result) {
        styletags = result.styletags;
        styletaglocation = result.styletaglocation;

        if (styletags)
          AddStyleTags();
    });
}

function AddStyleTags() {
    const parentForm = document.querySelector('form');
    const textarea = document.querySelector('#message');
    const bottomButtons = document.querySelector('#buttons');

    const italicsButton = CreateStyleTagButton(textarea, 'italics', 'i');
    const boldButton = CreateStyleTagButton(textarea, 'bold', 'b');
    const underlineButton = CreateStyleTagButton(textarea, 'underline', 'u');
    const preButton = CreateStyleTagButton(textarea, 'pre', 'pre');
    const imgButton = CreateStyleTagButton(textarea, 'img', 'img');
    const quoteButton = CreateStyleTagButton(textarea, 'quote', 'quote');
    const spoilerButton = CreateStyleTagButton(textarea, 'spoiler', 'spoiler');

    parentForm.insertBefore(italicsButton, styletaglocation ? textarea : bottomButtons);
    parentForm.insertBefore(boldButton, styletaglocation ? textarea : bottomButtons);
    parentForm.insertBefore(underlineButton, styletaglocation ? textarea : bottomButtons);
    parentForm.insertBefore(preButton, styletaglocation ? textarea : bottomButtons);
    parentForm.insertBefore(imgButton, styletaglocation ? textarea : bottomButtons);
    parentForm.insertBefore(quoteButton, styletaglocation ? textarea : bottomButtons);
    parentForm.insertBefore(spoilerButton, styletaglocation ? textarea : bottomButtons);
    parentForm.insertBefore(document.createElement('br'), styletaglocation ? textarea : bottomButtons);
}