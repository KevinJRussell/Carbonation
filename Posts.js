AddPostNumber();
AddFilterMeButton();

function AddPostNumber() {
    var pageNumber = GetUrlParameter('page') || 1;
    var postFloor = (pageNumber - 1) * POSTS_PER_PAGE;

    document.querySelectorAll('.message-container').forEach(function (post, index) {
        postNumber = document.createTextNode(` | #${(postFloor + index + 1)}`);
        post.querySelector('.message-top').appendChild(postNumber);
    });
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