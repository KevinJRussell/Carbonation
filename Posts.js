AddPostNumber();
AddFilterMeButton();

function AddPostNumber() {
    var pageNumber = GetUrlParameter('page');
    if (pageNumber == null)
        pageNumber = 1;
    var postFloor = (pageNumber - 1) * 50;

    var posts = document.getElementsByClassName('message-container');

    for (var i = 0; i < posts.length; i++) {
        var postNumber = document.createTextNode(' | #' + (postFloor + i + 1));

        posts[i].getElementsByClassName('message-top')[0].appendChild(postNumber);
    }
}

function AddFilterMeButton() {
    var userId = GetUserId();
    var url = document.location + '&u=' + userId;
    var infobar = document.getElementsByClassName('infobar')[0];
    var filterMeButton = document.createElement('a');
    filterMeButton.href = url;
    filterMeButton.id = 'filterMe';
    filterMeButton.innerHTML = 'Filter Me';
    filterMeButton.style = 'text-decoration: none;';

    infobar.insertBefore(document.createTextNode(' | '), infobar.firstChild);
    infobar.insertBefore(filterMeButton, infobar.firstChild);
}