AddPostNumber();
AddFilterMeButton();

function AddPostNumber() {
    var pageNumber = GetUrlParameter('page');
    if (pageNumber == null)
        pageNumber = 1;
    var postFloor = (pageNumber - 1) * POSTS_PER_PAGE;

    var posts = document.getElementsByClassName('message-container');

    for (var i = 0; i < posts.length; i++) {
        var postNumber = document.createTextNode(' | #' + (postFloor + i + 1));

        posts[i].querySelector('.message-top').appendChild(postNumber);
    }
}

function AddFilterMeButton() {
    var userId = GetUserId();
    var url = document.location + '&u=' + userId;
    var infobar = document.querySelector('.infobar');
    var filterMeButton = document.createElement('a');
    filterMeButton.href = url;
    filterMeButton.id = 'filterMe';
    filterMeButton.innerHTML = 'Filter Me';
    filterMeButton.style = 'text-decoration: none;';

    infobar.insertBefore(document.createTextNode(' | '), infobar.firstChild);
    infobar.insertBefore(filterMeButton, infobar.firstChild);
}